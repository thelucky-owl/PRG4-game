import * as PIXI from 'pixi.js'
import { Sprite, Texture } from 'pixi.js'
import { Enemy } from './enemy'
import { Game } from './game'

export class Level1 extends PIXI.Sprite{
    public enemyTextures: PIXI.Texture[]=[]
    public enemyArray : Enemy [] = []
    public exit:PIXI.Sprite
    private background
    private game:Game
    private spawnTimer:number = 0

    constructor(bgSprite:PIXI.Texture, game:Game,enemyTexture:PIXI.Texture[],exit:Texture){
        super()
        this.game = game
        this.background  = new PIXI.Sprite(bgSprite)
        this.background.scale.set(1)
        this.background.anchor.set(0,0.3)
        this.game.underLayer.addChild(this.background)
        this.enemyTextures = enemyTexture
        for(let i = 0; i < 1; i++){
            let enemy = new Enemy(this.enemyTextures, this.game)
            this.game.underLayer.addChild(enemy)
            this.enemyArray.push(enemy)
        }
        this.exit = new PIXI.Sprite(exit)
        this.exit.scale.set(0.8,0.5)
        this.exit.x = 370
        this.exit.y = 0
        this.exit.visible = false
        this.game.underLayer.addChild(this.exit)

    }
    public update(delta:number){

        this.spawnTimer += delta
        if(this.spawnTimer >= 600&&this.game.player.alive == true){
            this.spawnTimer = 0
            let enemy = new Enemy(this.enemyTextures, this.game)
            this.game.pixi.stage.addChild(enemy)
            this.enemyArray.push(enemy)
        }
        if(this.game.collision(this.game.playerHitbox,this.exit)&& this.enemyArray.length <= 0){
            this.destroyAll()
            this.game.createNewlevel()
            this.game.player.x = 100
        }
    }
    public destroyAll(){
        this.exit.destroy()
        this.background.destroy()
        for(const enemy of this.enemyArray){
            this.enemyArray = this.enemyArray.filter(f => f != enemy)
                enemy.destroy()
        }
        this.destroy()
    }
    
}