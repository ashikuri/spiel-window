#!/usr/bin/env node
let child_process = require("child_process")
let path = require("path")
let fs = require("fs")

function has(o, items){
    for(const item of items) {
        if(item in o) return true
    }
    return false
}

var argv = require('yargs')
    .scriptName("spiel-window")
    .command({
        command: 'init',
        desc: 'Init a config file',
        handler(args){
            let finalobject = {
                name: "unnamed",
                dist: "dist", 
                file: "app.js"
            }
            if(!has(args, ["yes", "y"])){
                process.stdin.setEncoding('utf8')
                console.log("This utility will walk you through creating a `spiel-window.config.js` file\nfor your game creation project with spiel-engine.\n")
                console.log("Press ^C at any time to quit.\n")
                let steps = [
                    {question: "What is the name of your game (default: unnamed): ", default: "unnamed", item: "name"}, 
                    {question: "Destination to run build (default: dist): ", default: "dist", item: "dist"}, 
                    {question: "Main file of your game (default: app.js): ", default: "app.js", item: "file"}, 
                    {question: "Is this OK? (default: yes): ", default: "yes"}
                ]
                let i = 0
                process.stdout.write(steps[i].question)
                process.stdin.on('readable', () => {
                    let responce = ""
                    while(i < steps.length && (responce = process.stdin.read()) !== null){
                        responce = responce.replace(/\r\n/g, "")
                        if("item" in steps[i]) finalobject[steps[i].item] = responce || steps[i].default
                        
                        if(responce === "no" && steps[i].default === "yes"){
                            process.stdout.write("Discontinued.\n")
                            process.exit(0)
                        }
                        if(++i < steps.length) process.stdout.write(steps[i].question)
                        else end()
                    }
                })
            }else{
                console.log("creation of the spiel-window.config.js config file")
                end()
            }
            function end(){
                fs.createWriteStream(path.resolve("./spiel-window.config.js"))
                    .write(`module.exports = {\n\tname: "${finalobject.name}",\n\tdist: "${finalobject.dist}", \n\tfile: "${finalobject.file}"\n}`)
            }
        }
    })
    .command({
        command: "run [mode]",
        desc: "Start the game in development mode or build your game",
        handler(args){
            let config = require(path.resolve("./spiel-window.config.js"))
            if(args.mode === "build"){
                child_process.execSync(`npx electron-packager . "${config.name}" --overwrite --platform=win32 --arch=x64 --prune=true --out=${config.dist}`)
                child_process.execSync(`npx electron-packager . "${config.name}" --overwrite --platform=linux --arch=x64 --prune=true --out=${config.dist}`)
                child_process.execSync(`npx electron-packager . "${config.name}" --overwrite --platform=darwin --arch=x64 --prune=true --out=${config.dist}`)
            }else if(args.mode === "dev"){
                child_process.execSync(`npx electron ${config.file}`)
            }
        }
    })
    .command({
        command: "start-project [name]",
        desc: "Create a new game with a template",
        handler(args){
            child_process.exec(`npx degit ashikuri/spiel-window-template ${args.name}`, (err) =>{
                if(err) console.log(err.message)
                else console.log("Thanks for using spiel, good hacking. 😉")
            })
        }
    })
    .help()
    .argv
