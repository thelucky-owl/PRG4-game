import * as PIXI from 'pixi.js'
import { Application, Sprite, Texture } from 'pixi.js'
import {Game} from "./game"

export class Player extends PIXI.AnimatedSprite{
    public xSpeed: number = 0
    public ySpeed: number = 0
    public health: number = 10
    game: Game
    constructor(textures: Texture[], game:Game){
        super(textures)
        this.x = 100
        this.y = 100
        this.anchor.set(0.5)
        this.animationSpeed = 0.1
        this.game = game
        this.play()
    }
    public onKeyDown(e: KeyboardEvent):void{
        switch(e.key.toUpperCase()){
            case"D":
            case"ARROWRIGHT":
                this.xSpeed = 2
                this.scale.set(1)
            break
            case"A":
            case"ARROWLEFT":
                this.xSpeed = -2
                this.scale.set(-1,1)
                
            break
            case"W":
            case"ARROWUP":
                this.ySpeed = -2
                
            break
            case"S":
            case"ARROWDOWN":
                this.ySpeed = 2
                
            break
            case"F":
            // this.game.sword.visible = true
            this.game.attack.visible = true
            this.game.attack.play()
            this.game.attack.onComplete = ()=>{
                console.log("animation done")
                this.game.attack.visible = false
                this.game.attack.gotoAndStop(0)
            }
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
            // this.game.sword.visible = false
            
            
            break
        }
    }

    animationReset(){

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
