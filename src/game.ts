import * as PIXI from 'pixi.js'
import grassImage from "./images/grass.png"
import redImage from "./images/ff6961.png"
import sound from "url:./sounds/hero_dash.mp3"
import { Enemy } from './enemy'
import { Player } from './player'
import { AnimatedSprite, Application, Container, Ticker } from 'pixi.js'

export class Game{
    public enemyArray : Enemy [] = []
    public playerTextures: PIXI.Texture[]=[]
    public playerIdleTextures: PIXI.Texture[]=[]
    public enemyTextures: PIXI.Texture[]=[]
    private attackTextures: PIXI.Texture[]=[]
    private player:Player
    private playerHitbox:PIXI.Sprite
    public attack:PIXI.AnimatedSprite
    public pixi: PIXI.Application
    private loader: PIXI.Loader
    private invincibleCounter:number = 0



    constructor(pixi:PIXI.Application){
        //create new pixi application
        this.pixi = pixi
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
        document.body.appendChild(this.pixi.view)
        //create new pixi loader
        this.loader = new PIXI.Loader()
        //create keyboard events
        window.addEventListener("keydown", (e: KeyboardEvent)=>this.player.onKeyDown(e))
        window.addEventListener("keyup",(e: KeyboardEvent)=>this.player.onKeyUp(e))
        //load sprites
        this.loader
            .add('grassTexture', grassImage)
            .add("redTexture",redImage)
            .add("spritesheet","spritesheet.json")
            .add("spritesheetBat","spritesheetBat.json")
            .add("spritesheetAttack","spritesheetAttack.json")
            .add("spritesheetIdle","spritesheetIdle.json")
            .add("sound",sound)
        this.loader.load(()=>this.loadCompleted())
    }

//function executed once pixi loader has added textures
    loadCompleted() {
        //Fill spritesheet arrays
        this.createSpritesheet(8,this.playerTextures,'tile')
        this.createSpritesheet(5,this.playerIdleTextures,'tileIdle')
        this.createSpritesheet(7,this.enemyTextures,'batTile')
        this.createSpritesheet(6,this.attackTextures,'tileAttack')
        //create background
        const background = new PIXI.Sprite(this.loader.resources['grassTexture'].texture!)
        background.scale.set(1.4)
        //create animated attack
        this.attack = new AnimatedSprite(this.attackTextures)
        this.attack.x = 100
        this.attack.animationSpeed = 0.5
        this.attack.anchor.set(0.5)
        this.attack.visible = false
        this.attack.loop = false
        //create player
        this.player = new Player(this.playerTextures,this.playerIdleTextures,this);
        this.player.play();
        //create player hitbox 
        // this.loader.resources['redTexture'].texture!, commented out but can be used to see size of the hitbox
        // this.playerHitbox.visible = false
        this.playerHitbox = new PIXI.Sprite()
        this.playerHitbox.anchor.set(0.5)
        this.playerHitbox.scale.set(0.3,0.3)
        this.player.addChild(this.playerHitbox)
        this.player.addChild(this.attack)
        //add everything to stage
        this.pixi.stage.addChild(background)
        this.pixi.stage.addChild(this.player);
        //spawn enemies
        for(let i = 0; i < 5; i++){
            let enemy = new Enemy(this.enemyTextures, this)
            this.pixi.stage.addChild(enemy)
            this.enemyArray.push(enemy)
        }
        //moet eerst interact hebben  dus ff start scherm toevoegen
        //    let sound = this.loader.resources["sound"].data!
        //    sound.play()
    
        //start ticker/update function
        this.pixi.ticker.add((delta: number) => this.update(delta))

    }
    //function to run through spritesheets and create arrays
    createSpritesheet(spriteAmount:number,spriteArray:PIXI.Texture[],tileName:string){
        for(let i = 0; i < spriteAmount; i ++){
            const texture  = PIXI.Texture.from(`${tileName}${i}.png`)
            spriteArray.push(texture)
        }
    }
    //function to check collision on two sprites
    collision(sprite1:PIXI.Sprite, sprite2:PIXI.Sprite) {
        const bounds1 = sprite1.getBounds()
        const bounds2 = sprite2.getBounds()

        return bounds1.x < bounds2.x + bounds2.width
            && bounds1.x + bounds1.width > bounds2.x
            && bounds1.y < bounds2.y + bounds2.height
            && bounds1.y + bounds1.height > bounds2.y;
    }
    
    update(delta:number){
        //for loop which goes through the enemy array

        for (const enemy of this.enemyArray){
            
            //update every enemy
            enemy.update(delta)
            //check collision on player and enemy
            if(this.collision(this.playerHitbox,enemy)&& this.player.hasBeenHit == false){
                this.player.takeDamage()
                this.player.hasBeenHit = true 
            }
            //check collision on the attacks hitbox and an enemy
            if(this.collision(this.attack,enemy) && this.attack.visible){
                enemy.takeDamage()
                enemy.currentHit = true
                enemy.previousHit = enemy.currentHit
                break
                // //delete from array
                // this.enemyArray = this.enemyArray.filter(f => f != enemy)
                // //delete from pixi
                //  enemy.destroy()
            }else{
                console.log('not hit')
                enemy.currentHit = false
            }
        }
        //check if there are anyt enmies left
        if(this.pixi.stage.children.filter((object) => object instanceof Enemy).length === 0){
            console.log("you win")
        }
        //update the player
        this.player.update(delta)
        //switch statement to check if the player has been hit previously, and if the player is still invincible 
        switch(this.player.hasBeenHit == true){
            case this.invincibleCounter>100:
                this.invincibleCounter = 0
                this.player.hasBeenHit = false
            break
            case this.player.hasBeenHit == true && this.invincibleCounter < 100:
                this.invincibleCounter += delta
            break
        }
    }
    
}

