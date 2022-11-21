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

    addFromLayer(layer: Phaser.Tilemaps.ObjectLayer): void 
    {
        layer.objects.forEach(c => {
            //프로퍼티 첫번째에 스코어 저장되어 있다.
            let temp:Collectable = new Collectable(this.scene, c.x as number, c.y as number, "diamond", c.properties[0].value);
            this.add(temp);
        });
    }
}