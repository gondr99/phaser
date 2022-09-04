import PlatformGroup from "./PlatformGroup";
import { GameOptions } from "./gameData/GameOptions";
import GameUtil from "./GameUtil";
import { PlatformTypes } from "./gameData/PlatformTypes";

export default class PlatformSprite extends  Phaser.GameObjects.RenderTexture 
{
    body: Phaser.Physics.Arcade.Body;
    //플랫폼의 타입
    platformType: number = 0;   
    //플랫폼이 페이드 아웃되고 있는 중인가?
    isFadingOut: Boolean = false;
    //플랫폼이 속한 플랫폼 그룹
    platformGroup: PlatformGroup
    
    //왼쪽 가운데 오른쪽 스프라이트
    leftSprite:Phaser.GameObjects.Sprite[];
    middleSprite:Phaser.GameObjects.Sprite[];
    rightSprite:Phaser.GameObjects.Sprite[];

    constructor(scene: Phaser.Scene, group: PlatformGroup, 
        leftSprite:Phaser.GameObjects.Sprite[], 
        middleSprite: Phaser.GameObjects.Sprite[], 
        rightSprite: Phaser.GameObjects.Sprite[])
    {
        super(scene, 0, 0, 1, 16); //x, y, width, height

        this.leftSprite = leftSprite;
        this.middleSprite = middleSprite;
        this.rightSprite = rightSprite;

        this.setOrigin(0.5); //중심으로 오리진 잡고
        scene.add.existing(this);
        scene.physics.add.existing(this);
        group.add(this); //플랫폼 그룹에 넣어주고        
        this.body.setImmovable(true); //플랫폼의 바디가 물리엔진에 영향 받지 않게 설정
        this.body.setAllowGravity(false); //중력에 영향을 받지 않도록 설정
        
        this.platformGroup = group;
        this.init();
        this.scale = GameOptions.pixelScale;
    }

    init() : void {
        this.isFadingOut = false;
        this.alpha = 1;

        let lowestYPos : number = this.platformGroup.getLowestPlatformYPos();
        const {width, height} = GameOptions.gameSize;

        if(lowestYPos == 0)
        {
            //맨 처음으로 만들어지는 플랫폼(이건 타입을 기본 타입으로 해야함.)
            this.y = height * GameOptions.firstPlatformPosition;
            this.x = width * 0.5;
        }else { //다음으로 만들어지는 플랫폼들
            this.y = lowestYPos + GameUtil.Rand(GameOptions.platformVerticalDistanceRange);
            this.x = width * 0.5 + GameUtil.Rand(GameOptions.platformHorizontalDistanceRange)

            let keys = Object.keys(PlatformTypes);
            this.platformType = Phaser.Math.Between(0, keys.length-1);
        }

        let newWidth: number =  GameUtil.Rand(GameOptions.platformLengthRange) 
                                            / GameOptions.pixelScale;
        this.setSize(newWidth, 16); //높이 16픽셀짜리라 알맞게 그려지게 된다.
        this.body.setSize(newWidth, 16);
        
        this.middleSprite[this.platformType].displayWidth = newWidth;

        this.draw(this.middleSprite[this.platformType], 0, 0);
        this.draw(this.leftSprite[this.platformType], 0, 0);
        this.draw(this.rightSprite[this.platformType], newWidth, 0);
        // this.displayWidth = GameUtil.Rand(GameOptions.platformLengthRange);
        // this.setTint(GameOptions.platformColors[this.platformType]);
    }
}