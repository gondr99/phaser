import Phaser from "phaser";
import { GameOption } from "../GameOption";
//Hud를 만들기 위한 컨테이너 박스
export default class Hud extends Phaser.GameObjects.Container
{
    fontSize:number = 20;
    // scoreText:Phaser.GameObjects.Text;
    // scoreImage:Phaser.GameObjects.Image;
    scoreBoard: Phaser.GameObjects.Container;
    
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
        this.scoreBoard = this.createScoreText();

        this.add([this.scoreBoard]);

        //컨테이너가 가지고 있는 리스트
        const lineHieght:number = 20;
        this.list.forEach((item:any, index:number)=>{
            item.setPosition(item.x, item.y + lineHieght * index);
        });
    }

    createScoreText(): Phaser.GameObjects.Container
    {
        let scoreText = this.scene.add.text(0, 0, '0', {fontSize:`${this.fontSize}px`, color:"#fff"});
        let scoreImage = this.scene.add.image(scoreText.width + 5, 0, 'diamond');
        scoreImage.setOrigin(0).setScale(1.2); //좌측 상단

        const scoreBoard = this.scene.add.container(0, 0, [scoreText, scoreImage]);
        return scoreBoard;
    }

    updateScoreText(score:number): void 
    {
        //, scoreImage ,Phaser.GameObjects.Image
        const scoreText = this.scoreBoard.list[0] as Phaser.GameObjects.Text; //꺼내오고
        scoreText.setText(score.toString());

        const scoreImage = this.scoreBoard.list[1] as Phaser.GameObjects.Image;
        scoreImage.setPosition(scoreText.width + 5, 0);
    }
}