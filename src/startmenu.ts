import * as PIXI from 'pixi.js'
import { Game } from './game'
import { Button } from './button'
import grassImage from "./images/grass.png"
import { BaseTexture } from 'pixi.js'

export class startmenu{

    public pixi:PIXI.Application
    private button:Button
    private background:PIXI.Sprite

    constructor(){
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
        //create new pixi application
        this.pixi = new PIXI.Application({ width: 800, height: 450 })
        this.pixi.loader.add('grassTexture', grassImage)
        this.pixi.loader.load(()=>this.loadCompleted())
        document.body.appendChild(this.pixi.view)
        this.button = new Button(this.pixi.screen.width/2, this.pixi.screen.height/2)
        this.button.on("pointerdown",()=> this.onClick())
    }
    loadCompleted(){
        this.background = new PIXI.Sprite(this.pixi.loader.resources['grassTexture'].texture!)
        this.background.scale.set(1.4)
        this.pixi.stage.addChild(this.background)
        this.pixi.stage.addChild(this.button)
    }

    private onClick(){
        this.button.destroy()
        this.background.destroy()
        new Game(this.pixi)

    }
}
new startmenu()