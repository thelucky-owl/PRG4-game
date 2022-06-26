import * as PIXI from 'pixi.js'
import { Sprite, Texture } from 'pixi.js'
import { Button } from './button'
import {Game} from "./game"

export class Player extends PIXI.AnimatedSprite{
    private xSpeed: number = 0
    private ySpeed: number = 0
    public health: number = 1
    public hasBeenHit :boolean = false
    private game: Game
    private idleTextures:Texture[]=[]
    private WalkingTexture:Texture[]=[]
    private deathTexture:Texture[]=[]
    private walking: boolean = false
    public alive: boolean = true
    private button:Button
    
    constructor(textures: Texture[],idleTextures:Texture[],deathTextures:Texture[], game:Game){
        super(idleTextures)
        this.idleTextures = idleTextures
        this.WalkingTexture = textures
        this.deathTexture = deathTextures
        console.log(this.deathTexture)
        this.x = 100
        this.y = 100
        this.anchor.set(0.5)
        this.scale.set(4)
        this.animationSpeed = 0.1
        this.game = game
        this.play()
    }
    public onKeyDown(e: KeyboardEvent):void{
    
        switch(e.key.toUpperCase()){
            case"D":
            case"ARROWRIGHT":
                this.xSpeed = 2
                this.changeSpritesheetWalking()
                // this.scale.set(1)
            break
            case"A":
            case"ARROWLEFT":
                this.xSpeed = -2
                this.changeSpritesheetWalking()
                this.scale.set(-1,1)

                
            break
            case"W":
            case"ARROWUP":
                this.ySpeed = -2
                this.changeSpritesheetWalking()

            break
            case"S":
            case"ARROWDOWN":
                this.ySpeed = 2
                this.changeSpritesheetWalking()

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
        this.walking = false
        this.textures = this.idleTextures
        this.scale.set(4)
        this.game.attack.scale.set(0.25)
        this.game.attack.x = 25
        this.animationSpeed = 0.08
        this.play()
        this.game.playerHitbox.scale.set(0.08,0.08)
    }
    private changeSpritesheetWalking(){
        if(this.textures != this.WalkingTexture){
            this.game.attack.x = 100
            this.game.attack.scale.set(1)
            this.textures = this.WalkingTexture
            this.loop = true
            this.scale.set(1)
            this.play()
            this.game.playerHitbox.scale.set(0.3,0.3)
        }
    }
    public onKeyUp(e: KeyboardEvent):void{
        switch(e.key.toUpperCase()){
            case"D":
            case"ARROWRIGHT":
                this.xSpeed = 0
                this.changeSpritesheetIdle()
            break
            case"A":
            case"ARROWLEFT":
                this.xSpeed = 0
                this.changeSpritesheetIdle()
                this.scale.set(-4,4)
            break
            case"W":
            case"ARROWUP":
            case"S":
            case"ARROWDOWN":
                this.ySpeed = 0
                this.changeSpritesheetIdle()
            break
        }
    }
    //function to take damage and check if the player has health above 0
    public takeDamage(){
        //lower health
        this.health -= 1
        //check for death
        if(this.health == 0){
            this.textures = this.deathTexture
            this.animationSpeed = 0.2
            this.play()
            this.loop = false
            this.alive = false
            this.resetButton()
        }
    }
    private resetButton(){
        this.button = new Button(this.game.pixi.screen.width/2, this.game.pixi.screen.height/2)
        this.button.on("pointerdown",()=> this.onClick())
        this.game.pixi.stage.addChild(this.button)
    }
    private onClick(){
        this.button.destroy()
        this.game.level1.destroyAll()
        this.game.createNewlevel()
        this.alive = true
        this.x = 100
        this.y = 100
        this.health = 4
        this.changeSpritesheetIdle()
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
