
export class PreloadAssets extends Phaser.Scene 
{
    constructor() {
        super({key: 'PreloadAssets'});
    }

    preload() : void {
        this.load.image('platform', 'assets/platform.png');
        this.load.image('background', 'assets/background.png');
        this.load.image('leftplatform', 'assets/leftplatformedge.png');
        this.load.image('rightplatform', 'assets/rightplatformedge.png');

        this.load.image('leftplatformjumper', 'assets/leftplatformjumper.png');
        this.load.image('rightplatformjumper', 'assets/rightplatformjumper.png');
        this.load.image('platformjumper', 'assets/platformjumper.png');

        this.load.image('leftplatformtimer', 'assets/leftplatformtimer.png');
        this.load.image('rightplatformtimer', 'assets/rightplatformtimer.png');
        this.load.image('platformtimer', 'assets/platformtimer.png');
        
        //스프라이트 시트는 이런식으로 로딩한다. 애니메이션은 별개
        this.load.spritesheet('enemy', 'assets/enemy.png', {
            frameWidth:36,
            frameHeight:30
        });
        this.load.spritesheet('enemy_hit', 'assets/enemy_hit.png', {
            frameWidth: 36,
            frameHeight: 30
        });
        this.load.spritesheet('hero', 'assets/hero.png', {
            frameWidth:32,
            frameHeight:32
        });
        this.load.spritesheet('hero_run', 'assets/hero_run.png', {
            frameWidth:32,
            frameHeight:32
        });
        this.load.spritesheet('saw', 'assets/saw.png', {
            frameWidth:38,
            frameHeight:38
        })

        this.load.bitmapFont('onefont', 'assets/fonts/onefont_0.png', 'assets/fonts/onefont.fnt');
    }

    create() : void {
        this.scene.start('PlayGame');
    }
}