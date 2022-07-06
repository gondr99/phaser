import { GameOptions } from "./gameData/GameOptions";
import PlayerSprite from "./PlayerSprite";
import PlatformSprite from "./PlatformSprite";
import GameUtil from "./GameUtil";
import { PlatformTypes } from "./gameData/PlatformTypes";
import GameObject = Phaser.GameObjects.GameObject;
import PlatformGroup from "./PlatformGroup";
import EnemyGroup from "./EnemyGroup";
import EnemySprite from "./EnemySprite";

export class PlayGameScene extends Phaser.Scene
{
    //물리엔진 그룹(플랫폼들을 담을 공간)
    platformGroup: PlatformGroup;
    //적들을 담을 그룹
    enemyGroup: EnemyGroup;
    enemyPool: EnemySprite[];

    hero: PlayerSprite;
    firstMove: boolean;
    
    isStart: boolean = false;
    depthText: Phaser.GameObjects.BitmapText;
    debugText: Phaser.GameObjects.Text;

    depth: number = 0; //현재 내려간 깊이
    
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
        
        this.debugText = this.add.text(16, 16, '', fontStyle);
        this.enemyPool = []; //비어있는 배열로 풀을 선언
        this.firstMove = false; //아직 움직이지 않은것으로 

        this.platformGroup = new PlatformGroup(this.physics.world, this);
        this.enemyGroup = new EnemyGroup(this.physics.world, this);
        this.isStart = false;
        this.depth = 0;

        //최초 10개의 플랫폼을 생성해서 아래로 내려간다.
        for(let i: number = 0; i < 10; i++)
        {
            let platform: PlatformSprite = new PlatformSprite(this, this.platformGroup); // 0, 0 위치에 생성후 이동
            
            if(i > 0 ) //첫번째 플랫폼이 아니라면 플랫폼 위에 무엇인가를 올릴지를 결정한다.
            {
                this.placeStuffOnPlatform(platform);
            }
        }
        this.hero = new PlayerSprite(this); //시작 플랫폼보다 100px위에 위치
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
        if(Math.random() < GameOptions.enemyChance) {
            if(this.enemyPool.length == 0){ //풀에 여유분 적군이 없다면 
                new EnemySprite(this, p, this.enemyGroup);
            }
            else {
                let e: EnemySprite = this.enemyPool.shift() as EnemySprite;
                e.poolToGroup(p, this.enemyGroup);
            }
        }
    }

    resetPlatform(platform: PlatformSprite): void {
        // recycle the platform
        platform.init();
        // place stuff on platform
        this.placeStuffOnPlatform(platform);
    }

    moveHero(e: Phaser.Input.Pointer ): void {
        let dirSign = (e.x) > GameOptions.gameSize.width * 0.5 ? 1: -1; //화면의 좌나 우를 클릭했을 때 
        this.hero.setVelocityX( GameOptions.heroSpeed *  dirSign );

        this.checkFirstMove();
    }

    moveKeyHero(dirSign: number ): void {
        this.hero.setVelocityX( GameOptions.heroSpeed *  dirSign );

        this.checkFirstMove();
    }

    checkFirstMove() : void {
        if(this.firstMove == false)
        {
            this.firstMove = true;
            this.isStart = true; //게임 시작

            this.platformGroup.setVelocityY(-GameOptions.platformSpeed); //플랫폼 스피드로 위로 올라간다.
        }
    }

    stopHero(): void {
        this.hero.setVelocityX(0); //정지
    }

    handleEnemyCollision(body1: GameObject, body2: GameObject) : void 
    {
        let hero: PlayerSprite = body1 as PlayerSprite;
        let e : EnemySprite = body2 as EnemySprite;

        if(hero.body.touching.down && e.body.touching.up){ //밟아죽인거면
            e.groupToPool(this.enemyGroup, this.enemyPool); //죽여서 풀로 보내라
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

    handleEnemyPlatformCollision(body1: GameObject, body2: GameObject): void 
    {
        let e : EnemySprite = body1 as EnemySprite;
        let p : PlatformSprite = body2 as PlatformSprite;

        e.platform = p;
    }
    

    update(time: number, delta: number): void {
        this.debugText.setText('Enemy Group: ' + this.enemyGroup.countActive(true) + "\nEnemy Pool: " + this.enemyPool.length);

        //플랫폼과 플레이어간의 충돌 체크
        this.physics.world.collide(this.hero, this.platformGroup, this.handleCollision, undefined, this);
        //적군과 플랫폼간의 충돌체크
        this.physics.world.collide(this.enemyGroup, this.platformGroup, this.handleEnemyPlatformCollision, undefined, this);
        //플레이어와 적간의 충돌
        this.physics.world.collide(this.hero, this.enemyGroup, this.handleEnemyCollision, undefined, this);

        let platforms: PlatformSprite[] = this.platformGroup.getChildren() as PlatformSprite[];
        for(let p of platforms)
        {
            let pBound: Phaser.Geom.Rectangle = p.getBounds();

            if(pBound.bottom < 0)
            {
                this.resetPlatform(p); //위치 재조정
            }
        }

        const {width, height} = GameOptions.gameSize;
        let enemies: EnemySprite[] = this.enemyGroup.getChildren() as EnemySprite[];
        for(let e of enemies) {
            e.patrol();

            let eBounds: Phaser.Geom.Rectangle = e.getBounds();
            if(eBounds.bottom < 0 || (eBounds.top > height && e.body.velocity.y > 500) )
            {
                e.groupToPool(this.enemyGroup, this.enemyPool); //화면밖으로 나갔다면 다시 풀에 넣어서 재활용
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
}