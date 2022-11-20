import Phaser from "phaser";
import Collectable from "../Entities/Collectables/Collectable";


export default class Collectables extends Phaser.Physics.Arcade.StaticGroup
{
    constructor(scene:Phaser.Scene)
    {
        super(scene.physics.world, scene);

        this.createFromConfig({
            classType:Collectable,
        });
    }
}