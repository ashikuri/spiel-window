let { app, BrowserWindow, Menu, ipcMain } = require("electron")
let SpielEngine = require("spiel-engine")
let path = require("path")
let fs = require("fs")

class ToLoader{
    constructor(use, values) {
        this.use = use
        this.values = values
    }
}
function createGame(option){
    let width = option.width || 800
    let height = option.height || 600
    class Window{
        constructor(){
            this.main = null
        }
        create(){
            this.main = new BrowserWindow({
                width: width,
                height: height + 29 + (!!option.menubar ? 20 : 0),
                autoHideMenuBar: !option.menubar,
                icon: option.icon,
                resizable: option.resizable,
                webPreferences: {
                    nodeIntegration: true
                },
            })
            if(!!option.menubar && typeof option.menubar !== "boolean") this.main.setMenu(option.menubar)
            this.main.loadFile(path.resolve(__dirname, "./window.html"))
            ipcMain.on("spiel", () =>{
                let configPath = path.resolve("./spiel-window.config.js")
                if(fs.existsSync(path.resolve("./resources")) && fs.existsSync(path.resolve("./vk_swiftshader.dll"))) configPath = path.resolve("./resources/app/spiel-window.config.js")
                this.main.webContents.send("spiel:set-variable", option.title || require(configPath).name, option.fonts || [])
                this.main.webContents.send("spiel:game", option.game, width, height)
            })
            this.main.on("closed", () =>{
                this.main = null
            })
        }
      }
    let window = new Window()
    app.on("ready", window.create)
    
    app.on("window-all-closed", () =>{
        if(process.platform !== "darwin") app.quit()
    })
    app.on("activate", () =>{
        if(window.main === null) window.create()
    })
}
const Spiel = Object.assign({}, SpielEngine, {
    Loader: {
        Image(link){return new ToLoader("Image", [path.resolve(link)])},
        Audio(link){return new ToLoader("Audio", [path.resolve(link)])},
        Text(text, style){return new ToLoader("Text", [text, style])},
    },
    Game: null
})
module.exports = {
    createGame,
    Spiel,
    Menu
}