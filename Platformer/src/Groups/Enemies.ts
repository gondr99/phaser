import Phaser from 'phaser'
import Birdman from '../Entities/Birdman';

interface EnemyMap {
    [key:string]: any
}

export const EnemyCategory : EnemyMap =
{
    "Birdman": Birdman
}

export default class Enemies extends Phaser.GameObjects.Group
{
    constructor(scene:Phaser.Scene)
    {
        super(scene);
    }

    getTypes(name:string) : any{
        return EnemyCategory[name];
    }

    addCollider(
        other : Phaser.GameObjects.GameObject | Phaser.GameObjects.Group, 
        callback:ArcadePhysicsCallback | undefined,
        callbackContext:any = undefined) : Enemies
    {
        this.scene.physics.add.collider(this, other, callback, callbackContext);
        return this;
    }
}