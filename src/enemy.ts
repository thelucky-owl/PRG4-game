import * as PIXI from 'pixi.js'
import { Application, Sprite, Texture } from 'pixi.js'
import {Game} from "./game"

export class Enemy extends PIXI.AnimatedSprite{
    //not used yet so commented out
    // private xSpeed: number = 0
    // private ySpeed: number = 0
    public health: number = 2
    private game: Game
    public previousHit:boolean = false
    public currentHit:boolean = false

    constructor(textures: Texture[], game:Game){
        super(textures)
        this.game = game
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
        this.checkCollision()
        //move enemy to left side of screen when they go off the right
        if(this.x > 850){
            this.x = -150
        }else
        this.x += 1 * delta
        
    }
    private checkCollision() {
        if(this.currentHit && !this.previousHit) {
            this.health--
            console.log(this.previousHit)
            // console.log('hit')
        }

        this.previousHit = this.currentHit
    }
    takeDamage() {
        // maybe do something with different weapons, more damage whatever
        // bijv. this.health -= player.weapon.damage
        if (!this.previousHit) {
            console.log(this.health)
            this.health --
            //check for death
            if (this.health <= 0) {
                this.game.enemyArray = this.game.enemyArray.filter(f => f != this)
                this.destroy()
            }
        }
       
    }
    
}

//not working yet so commented out
