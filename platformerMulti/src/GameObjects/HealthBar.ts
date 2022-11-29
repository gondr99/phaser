import Phaser from "phaser";

export default class HealthBar 
{
    bar: Phaser.GameObjects.Graphics;

    x:number;
    y:number;

    size:Phaser.Math.Vector2;
    
    margin:number = 2;

    healthRatio:number = 1;
    constructor(scene:Phaser.Scene, x:number, y:number, width:number, height:number, margin:number = 2)
    {        
        this.bar = new Phaser.GameObjects.Graphics(scene);
        
        scene.add.existing(this.bar);
        this.x = x;
        this.y = y;

        this.margin = margin;

        this.size = new Phaser.Math.Vector2(width, height);
        this.draw();
    }

    move(x:number, y:number): void 
    {
        this.x = x;
        this.y = y;
        this.draw();
    }

    setHealth(ratio:number):void 
    {
        this.healthRatio = ratio;
        this.draw();
    }
    
    //0~1까지의 값을 입력받아서 체력바 그림
    draw(): void
    {
        this.bar.clear(); //기존 바를 지우고
        let {x:width, y:height} = this.size;

        this.bar.fillStyle(0x787878);
        this.bar.fillRect( this.x - this.margin, this.y-this.margin, 
                width + this.margin*2, height + this.margin*2);

        this.bar.fillStyle(0xffffff);
        this.bar.fillRect(this.x, this.y, width, height);

        const healthWidth = Math.floor(this.healthRatio * width);
        if(this.healthRatio <= 0.3){
            this.bar.fillStyle(0xff0000);
        }else{
            this.bar.fillStyle(0x32f232);
        }
        this.bar.fillRect(this.x, this.y, healthWidth, height);
    }
}