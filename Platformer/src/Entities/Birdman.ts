import Phaser, { Scenes } from 'phaser';
import Enemy from './Enemy';

export default class Birdman extends Enemy
{
    constructor(scene:Phaser.Scene, x:number, y:number, key:string, speed:number)
    {
        super(scene, x, y, key, speed);
    }

    init(): void 
    {
        this.setOrigin(0.5, 1); //아래쪽 중앙에 잡아준다.

        this.setCollideWorldBounds(true); //월드 경계선과 충돌하도록 처리
        
        this.body.setSize(this.width-10, this.height-20);
        this.body.setOffset(6, 20);
        this.setImmovable(true); //물리 현상에 의해 움직이지 않게    
    }
}