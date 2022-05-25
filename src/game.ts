import * as PIXI from 'pixi.js'
import grassImage from "./images/grass.png"
import { Enemy } from './enemy'
import { Player } from './player'

export class Game{
    private enemyArray : Enemy [] = []
    playerTextures: PIXI.Texture[]=[]
    enemyTextures: PIXI.Texture[]=[]
    player:Player

    pixi: PIXI.Application
    loader: PIXI.Loader
    constructor(){
        this.pixi = new PIXI.Application({ width: 800, height: 450 })
        document.body.appendChild(this.pixi.view)
        this.loader = new PIXI.Loader()
        window.addEventListener("keydown", (e: KeyboardEvent)=>this.onKeyDown(e))
        window.addEventListener("keyup",(e: KeyboardEvent)=>this.onKeyUp(e))
        this.loader
            .add('grassTexture', grassImage)
            .add("spritesheet","spritesheet.json")
            .add("spritesheetBat","spritesheetBat.json")
        this.loader.load(()=>this.loadCompleted())
    }
    loadCompleted() {
        const background = new PIXI.Sprite(this.loader.resources['grassTexture'].texture!)
        background.scale.set(1.4)
        this.pixi.stage.addChild(background)
        for(let i = 0; i < 7; i++){
            const texture  = PIXI.Texture.from(`tile${i}.png`)
            this.playerTextures.push(texture)
        }
        for(let i = 0; i < 7; i++){
            const texture  = PIXI.Texture.from(`batTile${i}.png`)
            this.enemyTextures.push(texture)
        }

        for(let i = 0; i < 5; i++){
           let enemy = new Enemy(this.enemyTextures, this)
            this.pixi.stage.addChild(enemy)
            this.enemyArray.push(enemy)
        }
        this.player = new Player(this.playerTextures,this);
        this.player.play();
        this.pixi.stage.addChild(this.player);
        
        this.pixi.ticker.add((delta: number) => this.update(delta))
    }
    onKeyDown(e: KeyboardEvent):void{
        switch(e.key.toUpperCase()){
            case"D":
            case"ARROWRIGHT":
                this.player.xSpeed = 5
                this.player.scale.set(1)
            break
            case"A":
            case"ARROWLEFT":
                this.player.xSpeed = -5
                this.player.scale.set(-1,1)
                
            break
            case"W":
            case"ARROWUP":
                this.player.ySpeed = -5
                
            break
            case"S":
            case"ARROWDOWN":
                this.player.ySpeed = 5
                
            break
        }
    }
    onKeyUp(e: KeyboardEvent):void{
        switch(e.key.toUpperCase()){
            case"D":
            case"ARROWRIGHT":
                this.player.xSpeed = 0
                
            break
            case"A":
            case"ARROWLEFT":
                this.player.xSpeed = 0
                
                
            break
            case"W":
            case"ARROWUP":
                this.player.ySpeed = 0
            break
            case"S":
            case"ARROWDOWN":
                this.player.ySpeed = 0
                
            break
        }
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
            if(this.collision(this.player,enemy)){
                this.pixi.stage.removeChild(enemy);
            }
        }
        if(this.pixi.stage.children.filter((object) => object instanceof Enemy).length === 0){
            console.log("you win")
        } 
        this.player.update(delta)
        console.log("update")
        
    }
    
}
new Game
