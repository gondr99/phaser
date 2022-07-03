export default class PlaterSprite extends Phaser.Physics.Arcade.Sprite
{
    canDestroyPlatform: Boolean = false;

    isDying: Boolean = false;

    mainScene: Phaser.Scene;

    constructor(scene : Phaser.Scene, x: number, y: number, key: string) {
        super(scene, x, y, key);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.mainScene = scene;
    }

    die(mult: number) : void
    {
        this.isDying = true;
        this.setVelocityY(-200);
        this.setVelocityX(200 * mult);

        this.mainScene.tweens.add({
            targets: this,
            angle: 45 * mult,
            duration: 500
        });
    }
}