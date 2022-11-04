import { GameOptions } from "./gameData/GameOptions";
import PlayerSprite from "./PlayerSprite";
import PlatformSprite from "./PlatformSprite";

export class PlayGameScene extends Phaser.Scene
{
    eyes: Phaser.GameObjects.Sprite;
    hero: PlayerSprite;
    emitter: Phaser.GameObjects.Particles.ParticleEmitter;
    platformGroup: Phaser.Physics.Arcade.Group;
    gameWidth: number;
    gameHeight: number;
    borderGraphics: Phaser.GameObjects.Graphics;
    spritePattern: Phaser.GameObjects.TileSprite;

    actionCamera: Phaser.Cameras.Scene2D.Camera; //액션 카메라
    sky: Phaser.GameObjects.Sprite;
    particles: Phaser.GameObjects.Particles.ParticleEmitterManager;

    constructor() {
        super( {key: 'PlayGame'});
    }

    create(): void {
        this.gameWidth = this.game.config.width as number;
        this.gameHeight = this.game.config.height as number;
        this.addSky();

        this.borderGraphics = this.add.graphics();
        this.borderGraphics.setVisible(false);
        this.spritePattern = this.add.tileSprite(
            this.gameWidth *0.5, GameOptions.platformHeight * 0.5, 
            this.gameWidth, 
            GameOptions.platformHeight * 2, 'pattern');
        this.spritePattern.setVisible(false);

        this.eyes = this.add.sprite(0, 0, 'eyes');
        this.eyes.setVisible(false);
        this.platformGroup = this.physics.add.group();
        for (let i: number = 0; i < 12; i++)
        {
            this.addPlatform(i == 0);
        }

        this.hero = new PlayerSprite(this, this.gameWidth * 0.5, 0, 'hero');

        
        this.input.on('pointerdown', this.destroyPlatform, this);
        this.createEmitter();

        
        this.setCameras(); //카메라 셋팅
    }

    setCameras() : void 
    {
        this.actionCamera = this.cameras.add(0, 0, this.gameWidth, this.gameHeight);
        this.actionCamera.ignore([this.sky]); //하늘 배경은 무시한다. 액션카메라는
        this.actionCamera.startFollow(this.hero, true, 0, 0.5, 
            0, -(this.gameHeight * 0.5 - this.gameHeight * GameOptions.firstPlatformPosition));

        //메인 카메라는 배경만
        this.cameras.main.ignore([this.particles]);
        this.cameras.main.ignore([this.hero]);
        if(this.physics.world.debugGraphic != null)
            this.cameras.main.ignore([this.physics.world.debugGraphic]);
        this.cameras.main.ignore(this.platformGroup);
    }

    addSky() : void 
    {
        this.sky = this.add.sprite(0, 0, 'sky');
        this.sky.displayWidth = this.gameWidth;
        this.sky.displayHeight = this.gameHeight;
        this.sky.setOrigin(0, 0);
    }


    addPlatform(isFirst: Boolean) : void
    {
        let platform: PlatformSprite = new PlatformSprite(this, 
                            this.gameWidth * 0.5, isFirst ? this.gameHeight * GameOptions.firstPlatformPosition : 0, 
                            this.gameWidth / 8, GameOptions.platformHeight);
        this.platformGroup.add(platform);
        platform.setPhysics();
        platform.drawTexture(this.borderGraphics, this.spritePattern, this.eyes);
        if (!isFirst) {
            this.initPlatform(platform);
        }
        else {
            platform.setTint(0x00ff00);
            platform.canLandOnIt = true;
        }
    }

    createEmitter(): void {
        this.particles = this.add.particles('particle');
        this.emitter = this.particles.createEmitter({
            //1에서 시작해서 0으로 점점 작아짐.
            scale: {
                start: 1,
                end: 0
            },

            //파티클의 속도
            speed: {
                min: 0,
                max: 200
            },
            active: false,   //playonawake
            lifespan: 500,  //0.5초동안 파티클 살아있게
            quantity: 50
        });
    }

    destroyPlatform(): void {
        if (this.hero.canDestroyPlatform && this.hero.isDying == false) {
            console.log("파괴");
            this.hero.canDestroyPlatform = false;
            let closestPlatform: Phaser.Physics.Arcade.Body = 
                this.physics.closest(this.hero) as Phaser.Physics.Arcade.Body;
            let platform: PlatformSprite = closestPlatform.gameObject as PlatformSprite;
            platform.explodeAndDestroy(this.emitter);
            this.initPlatform(platform); //아래로 내려서 재활용
        }
    }

    //가장 밑에 있는 플랫폼을 가져온다.
    getLowestPlatform(): number {
        let lowestPlatform: number = 0;
        let platforms: PlatformSprite[] = this.platformGroup.getChildren() as PlatformSprite[];
        for (let platform of platforms) {
            lowestPlatform = Math.max(lowestPlatform, platform.y);    
        }
        return lowestPlatform;
    }
 
    //maxHeight 보다 큰 놈들 중에서 가장 먼저 나오는 녀석을 찾는다.
    getHighestPlatform(maxHeight: number): PlatformSprite {
        let highestPlatformY:number = Infinity;
        
        let platforms: PlatformSprite[] = this.platformGroup.getChildren() as PlatformSprite[];
        let highestPlatform: PlatformSprite = platforms[0];
        for (let platform of platforms) {
            if ((platform.y > maxHeight) && (platform.y < highestPlatformY)) {
                highestPlatform = platform;
                highestPlatformY = platform.y;
            }   
        }
        return highestPlatform;
    }

    initPlatform(platform: PlatformSprite): void {
        platform.assignedVelocity = this.rand(GameOptions.platformHorizontalSpeedRange) * Phaser.Math.RND.sign(); //랜덤 부호 
        platform.transformTo(this.gameWidth / 2, this.getLowestPlatform() + this.rand(GameOptions.platformVerticalDistanceRange), 
                            this.rand(GameOptions.platformLengthRange), GameOptions.platformHeight);
        platform.drawTexture(this.borderGraphics, this.spritePattern, this.eyes);
    }

    rand(a: number[]): number {
        return Phaser.Math.Between(a[0], a[1]);
    }

    handleCollision(body1: Phaser.GameObjects.GameObject, body2: Phaser.GameObjects.GameObject): void {
        let hero: PlayerSprite = body1 as PlayerSprite;
        let platform: PlatformSprite = body2 as PlatformSprite;
        if (!platform.isHeroOnIt ) {
            if (hero.x < platform.getBounds().left) { //중심부가 벗어났다면 왼쪽으로 튕겨나가고
                this.fallAndDie(-1);
                return;
            }
            if (hero.x > platform.getBounds().right) {  //오른쪽으로 벗어났다면 오른쪽으로 튕겨나가고
                this.fallAndDie(+1);
                return;
            }

            if(platform.canLandOnIt == false)
            {
                this.fallAndDie(+1);
                return;
            }
            
            platform.isHeroOnIt = true;
            this.paintSafePlatforms();
            this.hero.canDestroyPlatform = true;  //다시 히어로가 플랫폼을 부술 수 있도록

            
        }
    }

    // method to make the hero fall and die
    fallAndDie(mult: number): void {
 
        // call hero's die method
        this.hero.die(mult);
 
        // create a time event
        this.time.addEvent({
            // 0.8초 뒤에 카메라가 더이상 플레이어를 따라다니지 않도록 처리함
            delay: 800,
            callback: () => this.actionCamera.stopFollow()
        });
    }

    paintSafePlatforms(): void {
        let floorPlatform: PlatformSprite = this.getHighestPlatform(0);
        floorPlatform.setTint(0xff0000);
        let targetPlatform: PlatformSprite = this.getHighestPlatform(floorPlatform.y);
        targetPlatform.setTint(0x00ff00);
        targetPlatform.canLandOnIt = true;
    }

    update(): void {
        if (this.hero.isDying == false) {
            this.physics.world.collide(this.hero, this.platformGroup, this.handleCollision,
                 undefined, this);
        }
        let platforms: PlatformSprite[] = this.platformGroup.getChildren() as PlatformSprite[];
        for (let platform of platforms) {
            if (platform.y + this.gameHeight < this.hero.y) {
                this.scene.start('PlayGame');     //플레이어가 첫 플랫폼으로부터 화면 하나만큼 내려오면 게임오버
            }   
            //플랫폼과 게임 좌우 외곽라인중 짧은 라인과의 거리 체크 해서 
            let distance: number = Math.max(
                0.2, 
                1 - ( (Math.abs(this.gameWidth / 2 - platform.x) / (this.gameWidth / 2)) )) * Math.PI / 2;
            platform.body.setVelocityX(platform.assignedVelocity * distance); //목적지에 다가가면 천천히
            if ((platform.body.velocity.x < 0 && platform.getBounds().left < this.hero.displayWidth / 2) || 
            (platform.body.velocity.x > 0 &&  platform.getBounds().right > this.gameWidth - this.hero.displayWidth / 2)) {
                //경계선에 가면 토글
                platform.assignedVelocity *= -1;
           }
        }
    }
}