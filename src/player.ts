import * as PIXI from 'pixi.js'
import { Sprite, Texture } from 'pixi.js'
import {Game} from "./game"

export class Player extends PIXI.AnimatedSprite{
    private xSpeed: number = 0
    private ySpeed: number = 0
    public health: number = 4
    public hasBeenHit :boolean = false
    private game: Game
    private idleTextures:Texture[]=[]
    private WalkingTexture:Texture[]=[]
    
    constructor(textures: Texture[],idleTextures:Texture[], game:Game){
        super(textures)
        this.idleTextures = idleTextures
        this.WalkingTexture = textures
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
                // this.changeSpritesheetWalking()
                this.scale.set(-1,1)

                
            break
            case"W":
            case"ARROWUP":
                this.ySpeed = -2
                // this.changeSpritesheetWalking()

            break
            case"S":
            case"ARROWDOWN":
                this.ySpeed = 2
                // this.changeSpritesheetWalking()

            break
            case"F":
            //play the animation and set the elemnt to visible
            this.game.sound.play()
            this.game.attack.visible = true
            this.game.attack.play()
            //when animation is complete reset the animation and set the element to invisible
            this.game.attack.onComplete = ()=>{
                this.game.attack.visible = false
                this.game.attack.gotoAndStop(0)
            }
            break
        }
    }
    private changeSpritesheetIdle(){
        this.textures = this.idleTextures
        this.scale.set(4)
        this.animationSpeed = 0.08
        this.play()
    }
    private changeSpritesheetWalking(){
        this.textures = this.WalkingTexture
        this.scale.set(1)
        this.play()
    }
    public onKeyUp(e: KeyboardEvent):void{
        switch(e.key.toUpperCase()){
            case"D":
            case"ARROWRIGHT":
                this.xSpeed = 0
                // this.changeSpritesheetIdle()
            break
            case"A":
            case"ARROWLEFT":
                this.xSpeed = 0
                // this.changeSpritesheetIdle()
                // this.scale.set(-4,4)
            break
            case"W":
            case"ARROWUP":
            case"S":
            case"ARROWDOWN":
                this.ySpeed = 0
                // this.changeSpritesheetIdle()
            break
        }
    }
    //function to take damage and check if the player has health above 0
    public takeDamage(){
        //lower health
        this.health -= 1
        // console.log(this.health)
        //check for death
        if(this.health <= 0){
           console.log("Game over")
            // this.game.reset()
        }
    }

    private clamp(num: number, min: number, max: number) {
        return Math.min(Math.max(num, min), max)
    }
    public updatePlayer(delta:number){
        let mapwidth = 800
        let mapheight = 450
        
        //keep the player inside the map
        this.x = this.clamp(this.x + this.xSpeed, 0, mapwidth)
        this.y = this.clamp(this.y + this.ySpeed, 0, mapheight)
 
        super.update(delta)
        //update the players position
        this.x += this.xSpeed
        this.y += this.ySpeed
    }

}
