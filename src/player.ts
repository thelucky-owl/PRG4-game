import * as PIXI from 'pixi.js'
import { Application, Sprite, Texture } from 'pixi.js'
import {Game} from "./game"

export class Player extends PIXI.AnimatedSprite{
    public xSpeed: number = 0
    public ySpeed: number = 0
    game: Game
    constructor(textures: Texture[], game:Game){
        super(textures)
        this.x = 100
        this.y = 100
        this.anchor.set(0.5)
        this.animationSpeed = 0.07
        this.game = game
        this.play()
    }

    update(delta:number){
        super.update(delta)
       this.x += this.xSpeed
       this.y += this.ySpeed
    }

}
