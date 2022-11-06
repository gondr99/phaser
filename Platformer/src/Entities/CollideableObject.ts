import Phaser from 'phaser';

export default class CollideableObject extends Phaser.Physics.Arcade.Sprite
{
    addCollider(other : Phaser.GameObjects.GameObject | Phaser.GameObjects.Group) : CollideableObject
    {
        this.scene.physics.add.collider(this, other);
        return this;
    }
}