export { Menu } from "electron";

interface WindowOptionInterface{
    icon?: string
    title?: string
    width?: number
    height?: number
    menubar?: boolean | Menu
    resizable?: boolean
    fonts?: Array<{fontName: string, fontStyle: string, url: string}>
    game: Spiel.OptionInterface
}
export namespace Spiel{
    export {
        AnyEntity, 
        BodyEntityInterface,
        CameraInterface,
        ControlInterface,
        Entity,
        EntityInterface,
        Plugin,
        SceneEntity,
        SceneInterface,
        SpritEntityInterface,
        TextEntityInterface,
        TextInterface,
        ex
    } from "spiel-engine/types/index"
    interface ToLoader{
        use: string
        values: Array<any>
    }
    export interface OptionInterface{
        plugins?: Array<Plugin>
        darkmode?: boolean
        pixel?: boolean
        canvas?: HTMLCanvasElement
        scene: Array<SceneInterface>
        save?: boolean
        loadScene?(ctx: CanvasRenderingContext2D, percentage: number): void
        state?: {}
        load: {[x: string]: ToLoader}
    }
    export namespace Loader{
        export function Image(link: string): ToLoader
        export function Audio(link: string): ToLoader
        export function Text(text: string, style?: {fontSize?: number, fontFamily?: string, color?: string, alpha?: number, padding?: number}): ToLoader
    }
}
export function createGame(option: WindowOptionInterface)
