import Phaser from "phaser";
import { GameOption } from "../GameOption";
//Hud를 만들기 위한 컨테이너 박스
export default class Hud extends Phaser.GameObjects.Container
{
    fontSize:number = 20;
    scoreText:Phaser.GameObjects.Text;
    scoreImage:Phaser.GameObjects.Image;
    
    constructor(scene:Phaser.Scene, x:number, y:number)
    {
        super(scene, x, y);
        scene.add.existing(this);
        
        let {width, height, cameraZoomFactor} = GameOption;

        //확대된 상태에서의 좌표 구하고
        let xPos:number = (width - width / cameraZoomFactor) * 0.5 + width / cameraZoomFactor;
        let yPos:number = (height - height / cameraZoomFactor) * 0.5;

        const containerWidth = 80;
        this.setPosition(xPos - containerWidth, yPos + 5);
        this.setScrollFactor(0);
        this.setDepth(100);

        this.setupList();
    }

    setupList() : void 
    {
        const scoreBoard = this.createScoreText();

        this.add([scoreBoard]);

        //컨테이너가 가지고 있는 리스트
        const lineHieght:number = 20;
        this.list.forEach((item:any, index:number)=>{
            item.setPosition(item.x, item.y + lineHieght * index);
        });
    }

    createScoreText(): Phaser.GameObjects.Container
    {
        this.scoreText = this.scene.add.text(0, 0, '022', {fontSize:`${this.fontSize}px`, color:"#fff"});
        this.scoreImage = this.scene.add.image(this.scoreText.width + 5, 0, 'diamond');
        this.scoreImage.setOrigin(0).setScale(1.2); //좌측 상단

        const ScoreBoard = this.scene.add.container(0, 0, [this.scoreText, this.scoreImage]);
        return ScoreBoard;
    }
}