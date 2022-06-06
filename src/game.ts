import * as PIXI from 'pixi.js'
import grassImage from "./images/grass.png"
import swordImage from "./images/sword.png"
import redImage from "./images/ff6961.png"
import { Enemy } from './enemy'
import { Player } from './player'
import { AnimatedSprite, Application, Container, Ticker } from 'pixi.js'

export class Game{
    private enemyArray : Enemy [] = []
    playerTextures: PIXI.Texture[]=[]
    enemyTextures: PIXI.Texture[]=[]
    attackTextures: PIXI.Texture[]=[]
    player:Player
    playerHitbox:PIXI.Sprite
    sword:PIXI.Sprite
    attack:PIXI.AnimatedSprite
    pixi: PIXI.Application
    loader: PIXI.Loader
    hit: boolean = false
    invincibleCounter:number = 0
    constructor(){
        //create new pixi application
        this.pixi = new PIXI.Application({ width: 800, height: 450 })
        document.body.appendChild(this.pixi.view)
        //create new pixi loader
        this.loader = new PIXI.Loader()
        //create keyboard events
        window.addEventListener("keydown", (e: KeyboardEvent)=>this.player.onKeyDown(e))
        window.addEventListener("keyup",(e: KeyboardEvent)=>this.player.onKeyUp(e))
        //load sprites
        this.loader
            .add('grassTexture', grassImage)
            .add("swordTexture",swordImage)
            .add("redTexture",redImage)
            .add("spritesheet","spritesheet.json")
            .add("spritesheetBat","spritesheetBat.json")
            .add("spritesheetAttack","spritesheetAttack.json")
        this.loader.load(()=>this.loadCompleted())
    }
    loadCompleted() {
        //make spritesheets
        this.createSpritesheet(8,this.playerTextures,'tile')
        this.createSpritesheet(7,this.enemyTextures,'batTile')
        this.createSpritesheet(6,this.attackTextures,'tileAttack')
        //create attack
       
        //create background
        const background = new PIXI.Sprite(this.loader.resources['grassTexture'].texture!)
        background.scale.set(1.4)
        //create animated attack
        this.attack = new AnimatedSprite(this.attackTextures)
        this.attack.x = 100
        this.attack.animationSpeed = 0.5
        this.attack.anchor.set(0.5)
        // this.attack.scale.set(0.1,0.1)
        this.attack.visible = false
        this.attack.loop = false
        //create player
        this.player = new Player(this.playerTextures,this);
        this.player.play();
        //create player hitbox this.loader.resources['redTexture'].texture!
        this.playerHitbox = new PIXI.Sprite()
        this.playerHitbox.anchor.set(0.5)
        // this.playerHitbox.visible = false
        this.playerHitbox.scale.set(0.3,0.3)
        this.player.addChild(this.playerHitbox)
        this.player.addChild(this.attack)
        //add everything to stage
        this.pixi.stage.addChild(background)
        this.pixi.stage.addChild(this.player);
        // this.player.addChild(this.sword)
        //spawn enemies after so theyre on top of bg
        for(let i = 0; i < 5; i++){
            let enemy = new Enemy(this.enemyTextures, this)
            this.pixi.stage.addChild(enemy)
            this.enemyArray.push(enemy)
        }
        this.pixi.ticker.add((delta: number) => this.update(delta))
    }
    
    testCreateSpritesheet(){
        for(let i = 0; i < 7; i++){
            const texture  = PIXI.Texture.from(`tile${i}.png`)
            this.playerTextures.push(texture)
        }
        for(let i = 0; i < 7; i++){
            const batTexture  = PIXI.Texture.from(`batTile${i}.png`)
            this.enemyTextures.push(batTexture)
        }
    }
    createSpritesheet(spriteAmount:number,spriteArray:PIXI.Texture[],tileName:string){
        for(let i = 0; i < spriteAmount; i ++){
            const texture  = PIXI.Texture.from(`${tileName}${i}.png`)
            spriteArray.push(texture)
        }
    }
    
    collision(sprite1:PIXI.Sprite, sprite2:PIXI.Sprite) {
        const bounds1 = sprite1.getBounds()
        const bounds2 = sprite2.getBounds()

        return bounds1.x < bounds2.x + bounds2.width
            && bounds1.x + bounds1.width > bounds2.x
            && bounds1.y < bounds2.y + bounds2.height
            && bounds1.y + bounds1.height > bounds2.y;
    }
// && this.sword.visible == true
    takeDamage(){
        this.hit = true
        this.player.health -= 1
        console.log(this.player.health)
        //check for death
        if(this.player.health <= 0){ 
            console.log("you lose")
        }
    }
    
    update(delta:number){
        
        for (const enemy of this.enemyArray){
            enemy.update(delta)
            if(this.collision(this.playerHitbox,enemy)&& this.hit == false){
                this.takeDamage()
            }
            if(this.collision(this.attack,enemy)&&this.attack.visible == true){
                //delete from array
                this.enemyArray = this.enemyArray.filter(f => f != enemy)
                //delete from pixi
                 enemy.destroy()
            }
        }
        if(this.pixi.stage.children.filter((object) => object instanceof Enemy).length === 0){
            // console.log("you win")
        } 
        this.player.update(delta)
        // console.log("update")
        switch(this.hit){
            case true && this.invincibleCounter>100:
                this.invincibleCounter = 0
                this.hit = false
            break
            case this.hit = true&& this.invincibleCounter < 100:
                this.invincibleCounter += delta
            break
        }
    }
    
}
new Game
//  this.sword =  new PIXI.Sprite(this.loader.resources["swordTexture"].texture!)
//         this.sword.angle = 90
//         this.sword.x = 100
//         this.sword.scale.set(0.1,0.1)
//         this.sword.visible = false