import * as PIXI from 'pixi.js'
import outsideImage from "./images/outside1.png"
import redImage from "./images/ff6961.png"
import sound from "url:./sounds/woosh.mp3"
import batSound from "url:./sounds/batDeath.mp3"
import { Enemy } from './enemy'
import { Player } from './player'
import { Level1 } from './level1'
import { AnimatedSprite, Container } from 'pixi.js'

export class Game{
    private playerTextures: PIXI.Texture[]=[]
    private playerIdleTextures: PIXI.Texture[]=[]
    private playerDeathTextures: PIXI.Texture[]=[]
    private enemyTextures: PIXI.Texture[]=[]
    private attackTextures: PIXI.Texture[]=[]
    public player:Player
    public playerHitbox:PIXI.Sprite
    public attack:PIXI.AnimatedSprite
    public pixi: PIXI.Application
    public loader: PIXI.Loader
    private invincibleCounter:number = 0
    public underLayer:Container
    public level1:Level1
    public score:number = 0
    private scoreText:PIXI.Text
    private hpText:PIXI.Text
    public sound:any
    public batSound:any

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
            .add("outsideTexture",outsideImage)
            .add("redTexture",redImage)
            .add("spritesheet","spritesheet.json")
            .add("spritesheetBat","spritesheetBat.json")
            .add("spritesheetAttack","spritesheetAttack.json")
            .add("spritesheetIdle","spritesheetIdle.json")
            .add("spritesheetDeath","spritesheetDeath.json")
            .add("sound",sound)
            .add("batSound",batSound)
        this.loader.load(()=>this.loadCompleted())
    }

//function executed once pixi loader has added textures
    private loadCompleted() {
        //Fill spritesheet arrays
        this.createSpritesheet(8,this.playerTextures,'tile')
        this.createSpritesheet(5,this.playerIdleTextures,'tileIdle')
        this.createSpritesheet(7,this.enemyTextures,'batTile')
        this.createSpritesheet(6,this.attackTextures,'tileAttack')
        this.createSpritesheet(5,this.playerDeathTextures,'tileDeath')
        //create background
        this.underLayer = new Container()
        this.pixi.stage.addChild(this.underLayer)
        this.createNewlevel()
        //create animated attack
        this.attack = new AnimatedSprite(this.attackTextures)
        this.attack.x = 100
        this.attack.animationSpeed = 0.4
        this.attack.anchor.set(0.5)
        this.attack.visible = false
        this.attack.loop = false
        //create player
        this.player = new Player(this.playerTextures,this.playerIdleTextures,this.playerDeathTextures,this);
        this.player.play();
        //create player hitbox 
        this.playerHitbox = new PIXI.Sprite(this.loader.resources['redTexture'].texture!)
        this.playerHitbox.anchor.set(0.5)
        this.playerHitbox.scale.set(0.1,0.1)
        // this.playerHitbox.visible = false
        //add everything to stage
        this.player.addChild(this.playerHitbox)
        this.player.addChild(this.attack)
        this.pixi.stage.addChild(this.player);
        //asign sounds to var
        this.sound = this.loader.resources["sound"].data!
        this.batSound = this.loader.resources["batSound"].data!
        //create ui text
        this.scoreText = new PIXI.Text(`Score: ${this.score}`,{
            "fill": "#d7ffd4",
            "fontVariant": "small-caps"
        })
        this.hpText = new PIXI.Text(`Health: ${this.player.health}`,{
            "fill": "#d7ffd4",
            "fontVariant": "small-caps"
        })
        this.hpText.x = 150
        this.pixi.stage.addChild(this.scoreText)
        this.pixi.stage.addChild(this.hpText)
        //start ticker/update function
        this.pixi.ticker.add((delta: number) => this.update(delta))

    }
    //function to run through spritesheets and create arrays
    private createSpritesheet(spriteAmount:number,spriteArray:PIXI.Texture[],tileName:string){
        for(let i = 0; i < spriteAmount; i ++){
            const texture  = PIXI.Texture.from(`${tileName}${i}.png`)
            spriteArray.push(texture)
        }
    }
    //function to check collision on two sprites
    public collision(sprite1:PIXI.Sprite, sprite2:PIXI.Sprite) {
        const bounds1 = sprite1.getBounds()
        const bounds2 = sprite2.getBounds()

        return bounds1.x < bounds2.x + bounds2.width
            && bounds1.x + bounds1.width > bounds2.x
            && bounds1.y < bounds2.y + bounds2.height
            && bounds1.y + bounds1.height > bounds2.y;
    }
    private updateUI(){
        this.scoreText.text = `Score: ${this.score}`
        this.hpText.text = `Health: ${this.player.health}`
    }
    public createNewlevel(){
        this.level1= new Level1(this.loader.resources['outsideTexture'].texture!,this,this.enemyTextures,this.loader.resources['redTexture'].texture!)
            
    }
    private update(delta:number){
        this.updateUI()
        //switch case current level = level1, current level = level2, update 1/2 ect.
       this.level1.update(delta)
        //for loop which goes through the enemy array
        for (const enemy of this.level1.enemyArray){
            
            //update every enemy
            enemy.updateEnemy(delta,this.player.position)
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
            }else{
                enemy.knockback = false
                enemy.currentHit = false
            }
        }
        //check if there are anyt enmies left
        if(this.pixi.stage.children.filter((object) => object instanceof Enemy),0){
            console.log("you win")
        }
        //update the player
        if(this.player.alive == true){
            this.player.updatePlayer(delta)
        }
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

