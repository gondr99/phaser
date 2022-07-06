import PlatformGroup from "./PlatformGroup";
import { GameOptions } from "./gameData/GameOptions";
import GameUtil from "./GameUtil";

export default class PlatformSprite extends Phaser.Physics.Arcade.Sprite
{
    body: Phaser.Physics.Arcade.Body;
    //플랫폼의 타입
    platformType: number = 0;   
    //플랫폼이 페이드 아웃되어 사라졌는가?
    isFadingOut: Boolean = false;
    platformGroup: PlatformGroup
    
    constructor(scene: Phaser.Scene, group: PlatformGroup)
    {
        super(scene, 0, 0, 'platform');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        group.add(this);
        this.platformGroup = group;

        this.body.setImmovable(true); //플랫폼의 바디가 물리엔진에 영향 받지 않게 설정
        this.body.setAllowGravity(false); //중력에 영향을 받지 않도록 설정

        this.init();
    }

    init() : void {
        this.isFadingOut = false;
        this.alpha = 1;

        let lowestYPos : number = this.platformGroup.getLowestPlatformYPos();
        const {width, height} = GameOptions.gameSize;

        if(lowestYPos == 0)
        {
            //맨 처음으로 만들어지는 플랫폼
            this.y = height * GameOptions.firstPlatformPosition;
            this.x = width * 0.5;
        }else { //다음으로 만들어지는 플랫폼들
            this.y = lowestYPos + GameUtil.Rand(GameOptions.platformVerticalDistanceRange);
            this.x = width * 0.5 + GameUtil.Rand(GameOptions.platformHorizontalDistanceRange)

            this.platformType = Phaser.Math.Between(0, 2);
        }

        this.displayWidth = GameUtil.Rand(GameOptions.platformLengthRange);
        this.setTint(GameOptions.platformColors[this.platformType]);
    }
}