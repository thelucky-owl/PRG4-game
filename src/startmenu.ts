import * as PIXI from 'pixi.js'
import { Game } from './game'
import { Button } from './button'
import grassImage from "./images/grass.png"
import { BaseTexture } from 'pixi.js'

export class startmenu{

    public pixi:PIXI.Application
    private button:Button
    private background:PIXI.Sprite
    private tutorialText:PIXI.Text
    private tutorialText2:PIXI.Text

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
        this.tutorialText = new PIXI.Text("Beweeg met WASD of de pijltjes toetsen.",{
            "fill": "#d7ffd4",
            "fontVariant": "small-caps"
        })
        this.tutorialText2 = new PIXI.Text("Vall aan met F",{
            "fill": "#d7ffd4",
            "fontVariant": "small-caps"
        })
        this.tutorialText.x = this.pixi.screen.width / 5
        this.tutorialText.y = this.pixi.screen.width / 2.9
        this.tutorialText2.x = this.pixi.screen.width / 2.6
        this.tutorialText2.y = this.pixi.screen.width / 2.6
        this.pixi.stage.addChild(this.background)
        this.pixi.stage.addChild(this.tutorialText)
        this.pixi.stage.addChild(this.tutorialText2)
        this.pixi.stage.addChild(this.button)
    }

    private onClick(){
        this.button.destroy()
        this.background.destroy()
        this.tutorialText.destroy()
        this.tutorialText2.destroy()
        new Game(this.pixi)

    }
}
new startmenu()