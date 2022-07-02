export class GameScene extends Phaser.Scene {
    constructor() {
        super({
            key:"GameScene"
        });
    }

    create() {
        this.add.text(10, 10, "Hello Phaser! Wonderful!! Amazing!!!");
    }
}