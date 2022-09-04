import { GameOptions } from "./gameData/GameOptions";
import PlayerSprite from "./PlayerSprite";
import PlatformSprite from "./PlatformSprite";
//import GameUtil from "./GameUtil";
import { PlatformTypes } from "./gameData/PlatformTypes";
import GameObject = Phaser.GameObjects.GameObject;
import PlatformGroup from "./PlatformGroup";
import EnemyGroup from "./EnemyGroup";
import EnemySprite from "./EnemySprite";

import SawSprite from "./SawSprite";
import SawGroup from "./SawGroup";
import { Game } from "phaser";

export class PlayGameScene extends Phaser.Scene
{
    //물리엔진 그룹(플랫폼들을 담을 공간)
    platformGroup: PlatformGroup;
    //적들을 담을 그룹
    enemyGroup: EnemyGroup;
    enemyPool: EnemySprite[];

    //톱날을 담을 그룹
    sawGroup: SawGroup;
    sawPool: SawSprite[];

    hero: PlayerSprite;
    firstMove: boolean;
    
    isStart: boolean = false;
    depthText: Phaser.GameObjects.BitmapText;
    debugText: Phaser.GameObjects.Text;

    depth: number = 0; //현재 내려간 깊이
    
    backgroundImage: Phaser.GameObjects.TileSprite;
    leftPlatform: Phaser.GameObjects.Sprite[] = [];
    rightPlatform: Phaser.GameObjects.Sprite[] = [];
    middlePlatform: Phaser.GameObjects.Sprite[] = [];

    //입력을 위한 처리
    arrowKeys: Phaser.Types.Input.Keyboard.CursorKeys; //화살표키
    keyA: Phaser.Input.Keyboard.Key;
    keyD: Phaser.Input.Keyboard.Key;
    pointer: Phaser.Input.Pointer;

    constructor() {
        super( {key: 'PlayGame'});
    }

    create(): void {
        let fontStyle: Phaser.Types.GameObjects.Text.TextStyle = {
            color: '#7fdbff',
            fontFamily: 'monospace',
            fontSize: '32px'
        };        
        
        //시작전 초기화 들어가고
        this.initializePlatformSprites(); //스프라이트 초기화
        this.initializeAnimations(); //애니메이션 초기화
        this.setBackground(); //백그라운드 초기화

        this.debugText = this.add.text(16, 16, '', fontStyle);
        this.enemyPool = []; //비어있는 배열로 풀을 선언
        this.sawPool = []; //비어있는 배열로 선언
        this.firstMove = false; //아직 움직이지 않은것으로 

        this.platformGroup = new PlatformGroup(this.physics.world, this);
        this.enemyGroup = new EnemyGroup(this.physics.world, this);
        this.sawGroup = new SawGroup(this.physics.world, this);

        this.isStart = false;
        this.depth = 0;

        //최초 10개의 플랫폼을 생성해서 아래로 내려간다.
        for(let i: number = 0; i < 10; i++)
        {
            let platform: PlatformSprite 
                = new PlatformSprite(this, this.platformGroup, this.leftPlatform, this.middlePlatform, this.rightPlatform); 
            
            if(i > 0 ) //첫번째 플랫폼이 아니라면 플랫폼 위에 무엇인가를 올릴지를 결정한다.
            {
                this.placeStuffOnPlatform(platform);
            }
        }
        //플레이어 캐릭터 추가.
        this.hero = new PlayerSprite(this); //시작 플랫폼보다 100px위에 위치
        //캐릭터 이동용 마우스 조작 추가.
        this.input.on("pointerdown", this.moveHero, this);
        this.input.on("pointerup", this.stopHero, this);

        //키보드 입력을 위한 처리
        // initialize arrow keys
        this.arrowKeys = this.input.keyboard.createCursorKeys();
        // add to keyA keyboard input with "A" key
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        // add to keyD keyboard input with "D" key
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);        

        this.depthText = this.add.bitmapText(GameOptions.gameSize.width * 0.5, 20, 'onefont', `Depth : ${this.depth}`, 40, 2);
        this.depthText.setOrigin(0.5, 0);
        //this.depthText.setCenterAlign();
        //0 = Left aligned (default) 1 = Middle aligned 2 = Right aligned

        //마우스 상태 감지를 위한 처리
        this.pointer = this.input.activePointer;
    }

    placeStuffOnPlatform(p: PlatformSprite): void 
    {
        //적 배치 확률을 따져봐서 확률에 해당하면 적을 배치함
        switch(p.platformType){
            case PlatformTypes.ENEMY:
                if(this.enemyPool.length == 0){ //풀에 여유분 적군이 없다면 
                    new EnemySprite(this, p, this.enemyGroup);
                }
                else {
                    let e: EnemySprite = this.enemyPool.shift() as EnemySprite;
                    e.poolToGroup(p, this.enemyGroup);
                }
                break;
            case PlatformTypes.SAW:
                if(this.sawPool.length == 0)
                {
                    new SawSprite(this, p, this.sawGroup);
                }else{
                    let s: SawSprite = this.sawPool.shift() as SawSprite;
                    s.poolToGroup(p, this.sawGroup);
                }
                break;
        }
       
    }

    resetPlatform(platform: PlatformSprite): void {
        // recycle the platform
        platform.init();
        // place stuff on platform
        this.placeStuffOnPlatform(platform);
    }

    //마우스 입력으로 플레이어 움직일때
    moveHero(e: Phaser.Input.Pointer ): void {
        this.hero.setMovement((e.x > GameOptions.gameSize.width * 0.5) ? this.hero.RIGHT : this.hero.LEFT);

        this.checkFirstMove();
    }

    //키보드 입력으로 플레이어 움직일때
    moveKeyHero(dirSign: number ): void {
        //this.hero.setVelocityX( GameOptions.heroSpeed *  dirSign );
        this.hero.setMovement(dirSign);

        this.checkFirstMove();
    }

    checkFirstMove() : void {
        if(this.firstMove == false)
        {
            this.firstMove = true;
            this.isStart = true; //게임 시작

            this.platformGroup.setVelocityY(-GameOptions.platformSpeed); //플랫폼 스피드로 위로 올라간다.
            this.sawGroup.setVelocityY(-GameOptions.platformSpeed);
        }
    }

    stopHero(): void {
        //this.hero.setVelocityX(0); //정지
        this.hero.setMovement(this.hero.STOP);
    }

    handleEnemyCollision(body1: GameObject, body2: GameObject) : void 
    {
        let hero: PlayerSprite = body1 as PlayerSprite;
        let e : EnemySprite = body2 as EnemySprite;

        if(hero.body.touching.down && e.body.touching.up){ //밟아죽인거면
            e.groupToPool(this.enemyGroup, this.enemyPool); //죽여서 풀로 보내라
            e.anims.play('enemy_falling', true); //이전 플레이를 무시하고 진행
            e.setFlipY(true); //y축으로 플립시킨다.
            hero.setVelocityY(GameOptions.bounceVelocity * -1);
        }else { //밟지 못하고 측면에서 처맞은거라면
            this.setGameOver();
        }
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
                    if(p.isFadingOut == false) //이미 사라지고 있는 중이 아니라면 사라지도록
                    {
                        p.isFadingOut = true;
                        this.tweens.add({
                            targets:p, 
                            alpha:0, 
                            ease: 'bounce',
                            duration: GameOptions.disappearTime,
                            onComplete: () => {
                                this.resetPlatform(p); //재배치
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

    //적과 플랫폼의 충돌시에는 그냥 해당 플랫폼으로 상주하도록 처리
    handleEnemyPlatformCollision(body1: GameObject, body2: GameObject): void 
    {
        let e : EnemySprite = body1 as EnemySprite;
        let p : PlatformSprite = body2 as PlatformSprite;

        e.platform = p;
    }
      
    //플레이어와 톱니의 충돌감지
    handleSawCollision(body1: GameObject, body2: GameObject): void {
        this.setGameOver(); 
    }
    

    update(time: number, delta: number): void {
        this.debugText.setText('Enemy Group: ' + this.enemyGroup.countActive(true) + "\nEnemy Pool: " + this.enemyPool.length);

        //히어로가 움직이기 시작했다면
        if(this.firstMove == true)
        {
            this.backgroundImage.tilePositionY += 0.2; //타일도 천천히 내려오게
        }

        this.hero.move(); //이동에 따른 애니메이팅 처리

        //플랫폼과 플레이어간의 충돌 체크
        this.physics.world.collide(this.hero, this.platformGroup, this.handleCollision, undefined, this);
        //적군과 플랫폼간의 충돌체크
        this.physics.world.collide(this.enemyGroup, this.platformGroup, this.handleEnemyPlatformCollision, undefined, this);
        //플레이어와 적간의 충돌
        this.physics.world.collide(this.hero, this.enemyGroup, this.handleEnemyCollision, undefined, this);
        //플레이어와 톱니와의 충돌 체크
        this.physics.world.collide(this.hero, this.sawGroup, this.handleSawCollision, undefined, this);

        let platforms: PlatformSprite[] = this.platformGroup.getChildren() as PlatformSprite[];
        for(let p of platforms)
        {
            let pBound: Phaser.Geom.Rectangle = p.getBounds();

            if(pBound.bottom < 0)  //화면위로 올라갔다면 플랫폼 위치를 재조정해야한다.
            {
                this.resetPlatform(p); //위치 재조정
            }
        }

        const {width, height} = GameOptions.gameSize;
        let enemies: EnemySprite[] = this.enemyGroup.getChildren() as EnemySprite[];
        for(let e of this.enemyPool)
        {
            //바닥으로 떨어졌다면
            if(e.y > height + 100) {
                e.setVelocity(0, 0); //정지시키고
                e.body.setAllowGravity(false); //중력 적용 안받게 해주고
            }
        }
        for(let e of enemies) {
            e.patrol();

            let eBounds: Phaser.Geom.Rectangle = e.getBounds();
            if(eBounds.bottom < 0 ) //화면 위로 사라졌다면 즉시 풀에 넣어주고 visible false
            {
                e.setVelocity(0, 0); //정지시키고
                e.body.setAllowGravity(false); //중력 적용 안받게 해주고
                e.groupToPool(this.enemyGroup, this.enemyPool); //화면밖으로 나갔다면 다시 풀에 넣어서 재활용
                e.setVisible(false);
            }
            
        }

        //톱니들의 업데이트
        let saws : SawSprite[] = this.sawGroup.getChildren() as SawSprite[];

        for(let s of saws)
        {
            s.patrol(); //모든 톱니들을 업데이트 시켜주고
            let sawBounds: Phaser.Geom.Rectangle = s.getBounds();

            if(sawBounds.bottom < 0) { //하늘위로 올라감.
                s.groupToPool(this.sawGroup, this.sawPool); //풀로 돌려보냄
            }

        }

        if(this.hero.y > height || this.hero.y < 0)
        {
            this.setGameOver();
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
        }else if(this.pointer.isDown == false){
            this.stopHero();
        }
        
    }

    setGameOver(): void
    {
        this.scene.start("PlayGame");
    }

    //플랫폼 스프라이트 초기화
    initializePlatformSprites() : void
    {
        let names = ["platform", "platformtimer", "platformjumper", "platform", "platform"];
        for(let key in PlatformTypes){
            let idx = PlatformTypes[key];
            this.leftPlatform[idx] = this.add.sprite(0, 0, "left"+ names[idx]);
            this.leftPlatform[idx].setOrigin(0, 0);
            this.leftPlatform[idx].setVisible(false);

            this.rightPlatform[idx] = this.add.sprite(0, 0, "right"+ names[idx]);
            this.rightPlatform[idx].setOrigin(1, 0);
            this.rightPlatform[idx].setVisible(false);
            
            this.middlePlatform[idx] = this.add.sprite(0, 0,names[idx]);
            this.middlePlatform[idx].setOrigin(0,0);
            this.middlePlatform[idx].setVisible(false);
        }
        
    }
    //애니메이션 초기화
    initializeAnimations() : void 
    {
        //플레이어 아이들 애니메이션
        this.anims.create({
            key:"idle",
            frames:this.anims.generateFrameNumbers("hero", {
                start:0, end:10
            }),
            frameRate:20,
            repeat:-1, //무한반복
        });
        //플레이어 달리는 애니메이션
        this.anims.create({
            key:"run",
            frames: this.anims.generateFrameNumbers("hero_run", {
                start:0,
                end:11
            }),
            frameRate:20,
            repeat:-1
        });
        //적의 움직이는 애니메이션 (적은 idle이 없다)
        this.anims.create({
            key:"enemy_run",
            frames:this.anims.generateFrameNumbers("enemy", {
                start:0,
                end:11
            }),
            frameRate:20,
            repeat:-1
        });
        //적의 사망 (떨어짐) 애니메이션
        this.anims.create({
            key:"enemy_falling",
            frames: this.anims.generateFrameNumbers("enemy_hit", {
                start:0,
                end:2,
            }),
            frameRate:20
        });
        //톱니 애니메이션
        this.anims.create({
            key:"saw",
            frames:this.anims.generateFrameNumbers("saw", {
                start:0,
                end:7
            }),
            frameRate:20,
            repeat:-1
        });
    
    }
    //배경이미지 셋팅
    setBackground() : void
    {
        
        this.backgroundImage = this.add.tileSprite(
            0, 0, 
            GameOptions.gameSize.width / GameOptions.pixelScale, 
            GameOptions.gameSize.height / GameOptions.pixelScale, 'background');
        this.backgroundImage.setOrigin(0, 0);
        this.backgroundImage.scale = GameOptions.pixelScale;
    }
}