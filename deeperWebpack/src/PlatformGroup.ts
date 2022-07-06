import PlatformSprite from "./PlatformSprite";

export default class PlatformGroup extends Phaser.Physics.Arcade.Group
{
    constructor(world:Phaser.Physics.Arcade.World, scene: Phaser.Scene) {
        super(world, scene);
    }

    getLowestPlatformYPos(): number 
    {
        let lowerYPos: number = 0;
        let platforms: PlatformSprite[] = this.getChildren() as PlatformSprite[];

        for(let p of platforms){
            lowerYPos = Math.max(lowerYPos, p.y);
        }
        return lowerYPos;
    }
}