import * as PIXI from 'pixi.js'
import { Application, Sprite } from 'pixi.js'
import {Game} from "./game"

export class Fish extends PIXI.Sprite{
    private speed: number
    game: Game
    constructor(texture: PIXI.Texture, game:Game){
        super(texture)
        this.x = Math.random()* game.pixi.screen.right
        this.y = Math.random()* game.pixi.screen.bottom
        this.scale.set(-1,1)
        this.anchor.set(0.5)
        this.tint = Math.random() * 0xFFFFFF
        this.interactive = true
        this.on('pointerdown',() => this.onClick())
        this.game = game
    }
    onClick() {
      this.game.pixi.stage.removeChild(this)
    }

    updateFish(delta:number){
        if(this.x > 850){
            this.x = -150
        }else
        this.x += 1 * delta
        this.y += Math.sin(this.x * 0.1)
        
    }

}
