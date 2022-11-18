import Phaser from 'phaser';

export default class CollideableObject extends Phaser.Physics.Arcade.Sprite
{
    addCollider(other : Phaser.GameObjects.GameObject | Phaser.GameObjects.Group) : CollideableObject
    {
        this.scene.physics.add.collider(this, other);
        return this;
    }
 
    addOverlap(other : Phaser.GameObjects.GameObject | Phaser.GameObjects.Group, Callback:ArcadePhysicsCallback) : CollideableObject
    {
        this.scene.physics.add.overlap(this, other, Callback, undefined, this);
        return this;
    }
}