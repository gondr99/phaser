import Phaser from 'phaser';
import { GameOption } from '../GameOption';
import { MenuItem, SetupMenuFn } from './MenuScene';

export default class LevelScene extends Phaser.Scene {

    menu: MenuItem[] = [];
    screenCenter: Phaser.Math.Vector2;

    fontSize: number;
    lineHeight: number;

    screenWidth: number;
    screenHeight: number;
    fontOption: Phaser.Types.GameObjects.Text.TextStyle;
    constructor() {
        super("LevelScene");

        this.screenWidth = GameOption.width;
        this.screenHeight = GameOption.height;

        this.screenCenter = new Phaser.Math.Vector2(this.screenWidth * 0.5, this.screenHeight * 0.5);
        this.fontSize = 75;
        this.lineHeight = 82;
        this.fontOption = { fontSize: `${this.fontSize}px`, color: '#713E01' };
    }

    create() {

        const levels = this.registry.get("unlocked-levels");
        this.menu = [];
        for(let i = 1; i <= levels; i++ )
        {
            this.menu.push({ scene: 'PlayGameScene', text: `Level ${i}`, level:i });
        }

        this.add.image(0, 0, 'menu_bg')
            .setOrigin(0)
            .setScale(2.7);

        this.createMenu(this.menu, this.setupMenuEvent.bind(this));

        const backBtn = this.add.image(this.screenWidth - 10, this.screenHeight - 10, 'back')
                            .setOrigin(1, 1)
                            .setScale(2)
                            .setInteractive();
        //백버튼 누르면 메뉴씬으로 이동한다.
        backBtn.on("pointerup", ()=>{
            this.scene.start("MenuScene");
        });
    }

    setupMenuEvent(menuItem: MenuItem): void {
        const textGO = menuItem.textGO as Phaser.GameObjects.Text;
        textGO.setInteractive();

        textGO.on('pointerover', () => {
            textGO.setStyle({ fill: '#ff0' });
        });

        textGO.on('pointerout', () => {
            textGO.setStyle({ fill: '#713E01' });
        })

        textGO.on('pointerup', () => {
            if(menuItem.scene && menuItem.level)
            {
                this.registry.set('level', menuItem.level);
                this.scene.start(menuItem.scene);
            }

            if (menuItem.text === 'Exit') {
                this.game.destroy(true);
            }
        })
    }

    createMenu(menu: MenuItem[], setupMenuEvents: SetupMenuFn) {
        let lastMenuPositionY = 0;

        menu.forEach(menuItem => {
            let x = this.screenCenter.x;
            let y =  this.screenCenter.y + lastMenuPositionY;
            menuItem.textGO = this.add.text(x, y, menuItem.text, this.fontOption).setOrigin(0.5, 1);
            lastMenuPositionY += this.lineHeight;
            setupMenuEvents(menuItem);
        });
    }
}
