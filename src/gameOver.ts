import * as PIXI from 'pixi.js'
import { Game } from './game'
import { Button } from './button'
import grassImage from "./images/grass.png"
import { BaseTexture } from 'pixi.js'
import { Level1 } from './level1'

export class GameOver{

    public pixi:PIXI.Application
    private button:Button
    private background:PIXI.Sprite
    private game:Game
    private bgTexture:PIXI.Texture

    constructor(game:Game,texture:PIXI.Texture){
        this.bgTexture = texture
        this.game = game
        //create new pixi application
        this.pixi = game.pixi
        this.button = new Button(this.pixi.screen.width/2, this.pixi.screen.height/2,"Retry?")
        console.log('hello world')
        this.button.on("pointerdown",()=> this.onClick())
    }
    loadCompleted(){
        this.background = new PIXI.Sprite(this.bgTexture)
        this.background.scale.set(1.4)
        this.pixi.stage.addChild(this.background)
        this.pixi.stage.addChild(this.button)
    }

    private onClick(){
        this.button.destroy()
        this.background.destroy()
        this.game.createNewlevel()

    }
}