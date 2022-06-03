import * as PIXI from 'pixi.js'
import grassImage from "./images/grass.png"
import swordImage from "./images/sword.png"
import { Enemy } from './enemy'
import { Player } from './player'

export class Game{
    private enemyArray : Enemy [] = []
    playerTextures: PIXI.Texture[]=[]
    enemyTextures: PIXI.Texture[]=[]
    player:Player
    sword:PIXI.Sprite
    pixi: PIXI.Application
    loader: PIXI.Loader
    constructor(){
        this.pixi = new PIXI.Application({ width: 800, height: 450 })
        document.body.appendChild(this.pixi.view)
        this.loader = new PIXI.Loader()
        window.addEventListener("keydown", (e: KeyboardEvent)=>this.player.onKeyDown(e))
        window.addEventListener("keyup",(e: KeyboardEvent)=>this.player.onKeyUp(e))
        this.loader
            .add('grassTexture', grassImage)
            .add("swordTexture",swordImage)
            .add("spritesheet","spritesheet.json")
            .add("spritesheetBat","spritesheetBat.json")
        this.loader.load(()=>this.loadCompleted())
    }
    loadCompleted() {
        this.sword =  new PIXI.Sprite(this.loader.resources["swordTexture"].texture!)
        this.sword.angle = 90
        this.sword.x = 100
        this.sword.scale.set(0.1,0.1)
        this.sword.visible = false
        const background = new PIXI.Sprite(this.loader.resources['grassTexture'].texture!)
        background.scale.set(1.4)
        this.pixi.stage.addChild(background)
        for(let i = 0; i < 7; i++){
            const texture  = PIXI.Texture.from(`tile${i}.png`)
            this.playerTextures.push(texture)
            console.log(this.playerTextures)
        }
        for(let i = 0; i < 7; i++){
            const batTexture  = PIXI.Texture.from(`batTile${i}.png`)
            this.enemyTextures.push(batTexture)
            console.log(this.enemyTextures)
        }

        for(let i = 0; i < 5; i++){
           let enemy = new Enemy(this.enemyTextures, this)
            this.pixi.stage.addChild(enemy)
            this.enemyArray.push(enemy)
        }
        this.player = new Player(this.playerTextures,this,this.sword);
        this.player.play();
        this.pixi.stage.addChild(this.player);
        this.player.addChild(this.sword)
        this.pixi.ticker.add((delta: number) => this.update(delta))
    }
    
    
    collision(sprite1:PIXI.AnimatedSprite, sprite2:PIXI.Sprite) {
        const bounds1 = sprite1.getBounds()
        const bounds2 = sprite2.getBounds()

        return bounds1.x < bounds2.x + bounds2.width
            && bounds1.x + bounds1.width > bounds2.x
            && bounds1.y < bounds2.y + bounds2.height
            && bounds1.y + bounds1.height > bounds2.y;
    }

    

    update(delta:number){
        
        for (const enemy of this.enemyArray){
            enemy.update(delta)
            if(this.collision(this.player,enemy)&& this.sword.visible == true){
                this.pixi.stage.removeChild(enemy);
            }
        }
        if(this.pixi.stage.children.filter((object) => object instanceof Enemy).length === 0){
            // console.log("you win")
        } 
        this.player.update(delta)
        // console.log("update")
        
    }
    
}
new Game
