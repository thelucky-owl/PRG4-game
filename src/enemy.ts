import * as PIXI from 'pixi.js'
import { Application, ObservablePoint, Sprite, Texture } from 'pixi.js'
import '@pixi/math-extras'
import {Game} from "./game"

export class Enemy extends PIXI.AnimatedSprite{
    //not used yet so commented out
    private xSpeed: number = 0
    private ySpeed: number = 0
    private speed:number = 5
    public health: number = 3
    private game: Game
    public previousHit:boolean = false
    public currentHit:boolean = false
    private active:boolean= false
    public knockback:boolean = false

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
    private clamp(num: number, min: number, max: number) {
        return Math.min(Math.max(num, min), max)
    }
    public updateEnemy(delta:number,playerPosition: PIXI.Point){
        let mapwidth = 800
        let mapheight = 450
        
        //keep the enemies inside the map
        this.x = this.clamp(this.x + this.xSpeed, 0, mapwidth)
        this.y = this.clamp(this.y + this.ySpeed, 0, mapheight)
        super.update(delta)
        this.checkCollision()
        // else
        // this.x += 1 * delta
        //set x to +1, timer goes, set x-1 repeat, if active stop and follow player, movement before following player
        const direction = playerPosition.subtract(this.position).normalize();
        //calculate the distance from the player
        const xDifference = this.position.x - playerPosition.x
        const yDifference = playerPosition.y - this.position.y
        const difference = Math.sqrt( xDifference * xDifference + yDifference*yDifference)
        //check how close the player is
        if(difference < 200){
            this.active = true
        }
        //start following the player
        if(this.active == true){
            if(this.knockback == true){
                this.speed = 30
                const progress = direction.multiplyScalar(this.speed * -1);
                this.position = this.position.add(progress) as ObservablePoint;
                this.speed =5
            }else{
            const speed = direction.multiplyScalar(2)
            this.position = this.position.add(speed) as ObservablePoint;
        }
    }
        
    }
    private checkCollision() {
        if(this.currentHit && !this.previousHit) {
            this.health--
        }

        this.previousHit = this.currentHit
    }
    public takeDamage() {
        // maybe do something with different weapons, more damage whatever
        // bijv. this.health -= player.weapon.damage
        if (!this.previousHit) {
            console.log(this.health)
            this.health --
            this.knockback = true
            //check for death
            if (this.health <= 0) {
                this.game.level1.enemyArray = this.game.level1.enemyArray.filter(f => f != this)
                this.game.score ++
                this.game.batSound.play()
                this.destroy()
            }
        }
       
    }
    
}
