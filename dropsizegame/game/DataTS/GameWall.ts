export default class GameWall extends Phaser.GameObjects.Sprite {
    constructor(scene: Phaser.Scene, x:number, y :number, key: string, origin:Phaser.Math.Vector2) {
        super(scene, x, y, key);
        this.setOrigin(origin.x, origin.y);
    }

    tweenTo(x: number): void 
    {
        this.scene.tweens.add({
            targets:this,
            x:x,
            duration:500,
            ease: 'Cubic.easeOut'
        });
    }
}