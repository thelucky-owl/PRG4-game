import * as PIXI from 'pixi.js'
import { Application, Sprite, Texture } from 'pixi.js'
import {Game} from "./game"

export class Enemy extends PIXI.AnimatedSprite{
    private speed: number
    game: Game
    constructor(textures: Texture[], game:Game){
        super(textures)
        this.x = Math.random()* game.pixi.screen.right
        this.y = Math.random()* game.pixi.screen.bottom
        this.scale.set(-1,1)
        this.anchor.set(0.5)
        this.animationSpeed = 0.1
        this.tint = Math.random() * 0xFFFFFF
        this.play()
    }

    update(delta:number){
        super.update(delta)
        if(this.x > 850){
            this.x = -150
        }else
        this.x += 1 * delta
        
    }

}
