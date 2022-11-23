import Phaser from 'phaser';

export default class CollideableObject extends Phaser.Physics.Arcade.Sprite
{
    addCollider(other : Phaser.GameObjects.GameObject | Phaser.GameObjects.Group, Callback:ArcadePhysicsCallback | undefined , context:any) : CollideableObject
    {
        this.scene.physics.add.collider(this, other, Callback, undefined, context);
        return this;
    }
 
    addOverlap(other : Phaser.GameObjects.GameObject | Phaser.GameObjects.Group, Callback:ArcadePhysicsCallback, context:any) : CollideableObject
    {
        this.scene.physics.add.overlap(this, other, Callback, undefined, context);
        return this;
    }

}