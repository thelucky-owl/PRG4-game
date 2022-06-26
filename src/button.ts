import * as PIXI from 'pixi.js'

export class Button extends PIXI.Graphics{
    constructor(x:number,y:number){
        super()
        
        this.beginFill(0x358224)
        this.drawRoundedRect(0,0,150,100,15)
        this.endFill()
        
        this.x = x - this.getBounds().width / 2 
        this.y = y - this.getBounds().height/2

        this.buttonMode = true
        this.interactive = true

        const startButtonText = new PIXI.Text("Start game",{
                "fill": "#d7ffd4",
                "fontVariant": "small-caps"
            })
            startButtonText.x = this.getBounds().width / 2
            startButtonText.y = this.getBounds().height / 2
            startButtonText.anchor.set(0.5)
            this.addChild(startButtonText)

    }
}