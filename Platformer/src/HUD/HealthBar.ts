import Phaser from "phaser";
import { GameOption } from "../GameOption";



export default class HealthBar 
{
    bar: Phaser.GameObjects.Graphics;

    rect: Phaser.Geom.Rectangle;
    //pixelPerHealth:number; //헬스당 픽셀
    
    x:number;
    y:number;
    scale:number;
    constructor(scene:Phaser.Scene, x:number, y:number, scale:number = 1)
    {
        const {width, height, cameraZoomFactor} = GameOption;
        
        this.bar = new Phaser.GameObjects.Graphics(scene);
        this.bar.setScrollFactor(0, 0);
        this.rect = new Phaser.Geom.Rectangle(x, y, 40, 8);

        scene.add.existing(this.bar);
        
        this.scale = scale;

        let leftOffset = (width - width / cameraZoomFactor) * 0.5;
        let topOffset = (height - height / cameraZoomFactor) * 0.5;

        this.x = x + leftOffset;
        this.y = y + topOffset;
        this.setHealth(1);
    }

    setHealth(ratio: number) : void 
    {
        this.bar.clear(); //기존 바를 지우고
        let {width, height} = this.rect;
        const x = this.x;
        const y = this.y;

        width = this.scale * width;
        height = this.scale * height;

        const margin = 2 * this.scale;
        this.bar.fillStyle(0x787878);
        this.bar.fillRect(x-margin, y-margin, width + margin*2, height + margin*2);

        
        this.bar.fillStyle(0xffffff);
        this.bar.fillRect(x, y, width, height);

        const healthWidth = Math.floor(ratio * width);
        if(ratio <= 0.3){
            this.bar.fillStyle(0xff0000);
        }else{
            this.bar.fillStyle(0x32f232);
        }
        this.bar.fillRect(x, y, healthWidth, height);
        
        this.bar.setScrollFactor(0,0);
    }
}