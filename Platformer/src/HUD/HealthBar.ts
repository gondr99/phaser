import Phaser from "phaser";
import { GameOption } from "../GameOption";



export default class HealthBar 
{
    bar: Phaser.GameObjects.Graphics;

    rect: Phaser.Geom.Rectangle;
    pixelPerHealth:number; //헬스당 픽셀
    
    maxHP: number; //최대 체력
    constructor(scene:Phaser.Scene, x:number, y:number, health:number)
    {
        const {width, height, cameraZoomFactor} = GameOption;
        
        this.bar = new Phaser.GameObjects.Graphics(scene);
        this.bar.setScrollFactor(0, 0);
        this.rect = new Phaser.Geom.Rectangle(x, y, 40, 8);
        this.maxHP = health;

        //HP 1당 픽셀수
        this.pixelPerHealth = this.rect.width / this.maxHP;

        scene.add.existing(this.bar);
        

        let leftOffset = (width - width / cameraZoomFactor) * 0.5;
        let topOffset = (height - height / cameraZoomFactor) * 0.5;
        this.draw(x + leftOffset, y+ topOffset);
    }

    draw(x:number, y:number):void
    {
        this.bar.clear(); //기존 바를 지우고
        const {width, height} = this.rect;
        
        const margin = 2;
        this.bar.fillStyle(0x801ceb);
        this.bar.fillRect(x-margin, y-margin, width + margin*2, height + margin*2);

        
        this.bar.fillStyle(0xffffff);
        this.bar.fillRect(x, y, width, height);
    }
}