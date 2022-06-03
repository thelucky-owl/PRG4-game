import * as PIXI from 'pixi.js'
import { Application, Sprite, Texture } from 'pixi.js'
import {Game} from "./game"

export class Player extends PIXI.AnimatedSprite{
    public xSpeed: number = 0
    public ySpeed: number = 0
    game: Game
    private sword: PIXI.Sprite
    constructor(textures: Texture[], game:Game,sword: PIXI.Sprite){
        super(textures)
        this.x = 100
        this.y = 100
        this.anchor.set(0.5)
        this.animationSpeed = 0.07
        this.game = game
        this.sword = sword
        this.play()
    }
    public onKeyDown(e: KeyboardEvent):void{
        switch(e.key.toUpperCase()){
            case"D":
            case"ARROWRIGHT":
                this.xSpeed = 5
                this.scale.set(1)
            break
            case"A":
            case"ARROWLEFT":
                this.xSpeed = -5
                this.scale.set(-1,1)
                
            break
            case"W":
            case"ARROWUP":
                this.ySpeed = -5
                
            break
            case"S":
            case"ARROWDOWN":
                this.ySpeed = 5
                
            break
            case"F":
            this.sword.visible = true
            break
        }
    }
    public onKeyUp(e: KeyboardEvent):void{
        switch(e.key.toUpperCase()){
            case"D":
            case"ARROWRIGHT":
            case"A":
            case"ARROWLEFT":
                this.xSpeed = 0
                
                
            break
            case"W":
            case"ARROWUP":
            case"S":
            case"ARROWDOWN":
                this.ySpeed = 0
                
            break
            case"F":
            this.sword.visible = false
            
        break
        }
    }

    clamp(num: number, min: number, max: number) {
        return Math.min(Math.max(num, min), max)
    }
    update(delta:number){
        let mapwidth = 800
        let mapheight = 450
        
        // beweeg het karakter over de map maar niet buiten beeld
        this.x = this.clamp(this.x + this.xSpeed, 0, mapwidth)
        this.y = this.clamp(this.y + this.ySpeed, 0, mapheight)
 
        super.update(delta)
       this.x += this.xSpeed
       this.y += this.ySpeed
    }

}
