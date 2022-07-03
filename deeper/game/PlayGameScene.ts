import { GameOptions } from "./gameData/GameOptions";
import PlayerSprite from "./PlayerSprite";
import PlatformSprite from "./PlatformSprite";
import GameUtil from "./GameUtil";
import { PlatformTypes } from "./gameData/PlatformTypes";
import GameObject = Phaser.GameObjects.GameObject;
import { Bounds } from "matter";
import { Game } from "phaser";

export class PlayGameScene extends Phaser.Scene
{
    platformGroup: Phaser.Physics.Arcade.Group;
    hero: PlayerSprite;
    gameWidth: number;
    gameHeight: number;
    depthText: Phaser.GameObjects.BitmapText;

    depth: number = 0; //현재 내려간 깊이
    
    isStart: boolean = false;

    arrowKeys: Phaser.Types.Input.Keyboard.CursorKeys; //화살표키
    keyA: Phaser.Input.Keyboard.Key;
    keyD: Phaser.Input.Keyboard.Key;

    constructor() {
        super( {key: 'PlayGame'});
    }

    create(): void {
        this.gameWidth = this.game.config.width as number;
        this.gameHeight = this.game.config.height as number;
        this.platformGroup = this.physics.add.group(); //플랫폼들을 관리할 그룹을 생성
        this.isStart = false;
        this.depth = 0;

        //시작 플랫폼 생성
        let startPlatform: PlatformSprite = new PlatformSprite(
                    this, this.gameWidth * 0.5, this.gameHeight * GameOptions.firstPlatformPosition, "platform");
        
        startPlatform.addToGroup(this.platformGroup); //첫번째 플랫폼을 그룹에 넣고

        //최초 10개의 플랫폼을 생성해서 아래로 내려간다.
        for(let i: number = 0; i < 10; i++)
        {
            let platform: PlatformSprite = new PlatformSprite(this, 0, 0, "platform"); // 0, 0 위치에 생성후 이동
            platform.addToGroup(this.platformGroup); //피직스 그룹에 추가함.
            this.positionPlatform(platform);
        }
        this.hero = new PlayerSprite(this, this.gameWidth * 0.5, startPlatform.getBounds().y - 100, "hero"); //시작 플랫폼보다 100px위에 위치
        this.input.on("pointerdown", this.moveHero, this);
        this.input.on("pointerup", this.stopHero, this);

        //키보드 입력을 위한 처리
        // initialize arrow keys
        this.arrowKeys = this.input.keyboard.createCursorKeys();
        // add to keyA keyboard input with "A" key
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        // add to keyD keyboard input with "D" key
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);        

        this.depthText = this.add.bitmapText(this.gameWidth * 0.5, 20, 'onefont', `Depth : ${this.depth}`, 40, 2);
        this.depthText.setOrigin(0.5, 0);
        //this.depthText.setCenterAlign();
        //0 = Left aligned (default) 1 = Middle aligned 2 = Right aligned
    }

    //생성된 플랫폼을 적당한 위치로 이동시키기
    positionPlatform(p: PlatformSprite): void
    {
        p.y = this.getLowestPlatformYPos() + GameUtil.Rand(GameOptions.platformVerticalDistanceRange); //랜덤 y값만큼 떨구고
        p.x = this.gameWidth * 0.5 + GameUtil.Rand(GameOptions.platformHorizontalDistanceRange) * Phaser.Math.RND.sign(); //+, - 랜덤

        p.displayWidth = GameUtil.Rand(GameOptions.platformLengthRange); //너비를 랜덤하게

        //  1: x = scale : displayWidth 니까 displayWidth 를 scale로 나누면 원본 x 값이 나오게 됨. 픽셀크기인 125임.
        // 세로 크기는 의도적으로 좀 더 크게 400px로 잡아줌.
        p.setBodySize(p.displayWidth / p.scaleX, 400, false);
        p.isHigher = true; 

        p.platformType = Phaser.Math.Between(PlatformTypes.NORMAL, PlatformTypes.JUMPING); // 0, 1, 2
        p.setTint(GameOptions.platformColors[p.platformType]); //각 타입에 맞는 색상으로
    }

    //가장 아래쪽의 플랫폼의 인덱스 번호를 리턴한다
    getLowestPlatformYPos(): number {
        let lowerYPos: number = 0;
        let platforms: PlatformSprite[] = this.platformGroup.getChildren() as PlatformSprite[];

        for(let p of platforms){
            lowerYPos = Math.max(lowerYPos, p.y);
        }
        return lowerYPos;
    }

    moveHero(e: Phaser.Input.Pointer ): void {
        let dirSign = (e.x) > this.gameWidth * 0.5 ? 1: -1; //화면의 좌나 우를 클릭했을 때 
        this.hero.setVelocityX( GameOptions.heroSpeed *  dirSign );

        if(this.hero.firstMove == true)
        {
            this.hero.firstMove = false;
            this.isStart = true; //게임 시작

            this.platformGroup.setVelocityY(-GameOptions.platformSpeed); //플랫폼 스피드로 위로 올라간다.
        }
    }

    moveKeyHero(dirSign: number ): void {
        this.hero.setVelocityX( GameOptions.heroSpeed *  dirSign );

        if(this.hero.firstMove == true)
        {
            this.hero.firstMove = false;
            this.isStart = true; //게임 시작

            this.platformGroup.setVelocityY(-GameOptions.platformSpeed); //플랫폼 스피드로 위로 올라간다.
        }
    }

    stopHero(): void {
        this.hero.setVelocityX(0); //정지
    }

    handleCollision(body1: GameObject, body2: GameObject): void
    {
        let hero: PlayerSprite = body1 as PlayerSprite;
        let p: PlatformSprite = body2 as PlatformSprite;
        //touching 은 이 바디가 다른 바디나 스태틱 바디와 충돌하는지와 방향들을 저장함. (none, up, down, left, right)
        //https://photonstorm.github.io/phaser3-docs/Phaser.Types.Physics.Arcade.html#.ArcadeBodyCollision 
        if(hero.body.touching.down && p.body.touching.up) { //위 아래로 부딛힌건지 체크한다.
            switch(p.platformType){
                case PlatformTypes.TIMER:  //사라지는 플랫폼은 사라지도록
                    if(p.isFadingOut == false)
                    {
                        p.isFadingOut = true;
                        this.tweens.add({
                            targets:p, 
                            alpha:0, 
                            ease: 'bounce',
                            duration: GameOptions.disappearTime,
                            onComplete: () => {
                                p.isFadingOut = false;
                                p.alpha = 1;
                                this.positionPlatform(p); //재배치
                            }
                        })
                    }
                    break;
                case PlatformTypes.JUMPING:
                    hero.setVelocityY(GameOptions.bounceVelocity * -1); //위로 튀어오르도록 함.
                    break;
            }
        }
    }

    update(time: number, delta: number): void {
        this.physics.world.collide(this.hero, this.platformGroup, this.handleCollision, undefined, this);

        let heroLowerBounds: number = this.hero.getBounds().bottom; //아래쪽 : 높이와 x좌표를 더해서 만들어짐.
        let platforms: PlatformSprite[] = this.platformGroup.getChildren() as PlatformSprite[];

        for(let p of platforms)
        {
            let pBound: Phaser.Geom.Rectangle = p.getBounds();

            //플레이어가 아래로 내려갔다면 충돌체 재조정 = 왜하는진 모르겠다.
            if(pBound.top < heroLowerBounds && p.isHigher) {
                p.setBodySize(p.displayWidth / p.scaleX, p.displayHeight, false); //마지막은 부모 오브젝트의 중앙정렬인지 여부
                p.isHigher = false;
            }

            if(pBound.bottom < 0)
            {
                this.positionPlatform(p); //위치 재조정
            }
        }

        if(this.hero.y > this.gameHeight || this.hero.y < 0)
        {
            this.scene.start("PlayGame");
        }

        if(this.isStart == true)
        {
            this.depth += (delta / 100000) * GameOptions.platformSpeed;
            this.depthText.setText(`Depth: ${this.depth.toFixed(2)}`);
        }
        

        if(this.keyA.isDown || this.arrowKeys.left.isDown){
            this.moveKeyHero(-1);
        }else if(this.keyD.isDown || this.arrowKeys.right.isDown){
            this.moveKeyHero(1);
        }else {
            this.stopHero();
        }
        
    }

    
}