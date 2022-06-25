import * as PIXI from 'pixi.js'
import { Game } from './game'
import { Button } from './button'
import { BaseTexture } from 'pixi.js'

export class startmenu{

    public pixi:PIXI.Application
    private button:Button

    constructor(){
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
        //create new pixi application
        this.pixi = new PIXI.Application({ width: 800, height: 450 })
        document.body.appendChild(this.pixi.view)
        this.button = new Button(this.pixi.screen.width/2, this.pixi.screen.height/2)
        this.pixi.stage.addChild(this.button)
        console.log('hello world')
        this.button.on("pointerdown",()=> this.onClick())
    }

    private onClick(){
        this.button.destroy()
        new Game(this.pixi)

    }
}
new startmenu()