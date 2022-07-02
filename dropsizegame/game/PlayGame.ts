import { GameOptions } from "./DataTS/GameOptions";
import { GameModes } from "./DataTS/GameModes";
import { GameTexts } from "./DataTS/GameTexts";
import GameWall from "./DataTS/GameWall";
import SquareText from "./SquareText";
import PlayerSquare from "./PlayerSquare";
import Vector2 = Phaser.Math.Vector2;

export class PlayGame extends Phaser.Scene 
{
    saveData:any;
    leftSquare : GameWall;
    rightSquare : GameWall;
    leftWall: GameWall;
    rightWall: GameWall;
    square: PlayerSquare;
    squareText: SquareText;
    infoGroup: Phaser.GameObjects.Group;
    levelText: Phaser.GameObjects.BitmapText;
    squareTweenTargets: any[];
    currentGameMode: number = GameModes.IDLE;
    gameWidth: number = 0;
    gameHeight: number = 0;
    growTween: Phaser.Tweens.Tween;
    rotateTween: Phaser.Tweens.Tween;

    constructor() {
        super({key: 'PlayGame'})
    }

    create() : void 
    {
        this.gameWidth = this.game.config.width as number;
        this.gameHeight = this.game.config.height as number;
        
        let prevData = localStorage.getItem(GameOptions.localStorageName);

        if(prevData == null) {
            this.saveData = {level: 1};
        }else {
            this.saveData = JSON.parse(prevData as string);
        }

        let tintColor = Phaser.Utils.Array.GetRandom(GameOptions.bgColors);
        this.cameras.main.setBackgroundColor(tintColor);
        this.placeWalls();

        //플레이어 추가
        this.square = new PlayerSquare(this, this.gameWidth / 2, -400, 'square');
        this.add.existing(this.square);
        
        //텍스트 추가
        this.squareText = new SquareText(this, this.square.x, this.square.y, 'onefont', this.saveData.level, 120, tintColor);
        this.add.existing(this.squareText);
        this.squareTweenTargets = [this.square, this.squareText]; //텍스트와 플레이어를 전부 타겟으로 잡고
        this.levelText = this.add.bitmapText(this.gameWidth / 2, 0, 'onefont', 'level ' + this.saveData.level, 60);
        this.levelText.setOrigin(0.5, 0);
        
        
        this.updateLevel();
        this.input.on('pointerdown', this.grow, this);
        this.input.on('pointerup', this.stop, this);
    }

    placeWalls() : void 
    {
        this.leftSquare = new GameWall(this, 0, this.gameHeight, 'base', new Vector2(1, 1));
        this.add.existing(this.leftSquare);
        this.rightSquare = new GameWall(this, this.gameWidth, this.gameHeight, 'base', new Vector2(0, 1));
        this.add.existing(this.rightSquare);
        this.leftWall = new GameWall(this, 0, this.gameHeight - this.leftSquare.height, 'top', new Vector2(1, 1));
        this.add.existing(this.leftWall);
        this.rightWall = new GameWall(this, this.gameWidth, this.gameHeight - this.leftSquare.height, 'top', new Vector2(0, 1));
        this.add.existing(this.rightWall);
    }

    updateLevel() : void 
    {
        let holeWidth = Phaser.Math.Between(GameOptions.holeWidthRange[0], GameOptions.holeWidthRange[1]);
        let wallWidth = Phaser.Math.Between(GameOptions.wallRange[0], GameOptions.wallRange[1]);

        this.leftSquare.tweenTo( (this.gameWidth - holeWidth) * 0.5 );
        this.rightSquare.tweenTo( (this.gameWidth + holeWidth) * 0.5 );
        this.leftWall.tweenTo( (this.gameWidth - holeWidth) * 0.5 - wallWidth);
        this.rightWall.tweenTo((this.gameWidth + holeWidth) * 0.5 + wallWidth);
        
        this.tweens.add({
            targets: this.squareTweenTargets,
            y: 150,
            scaleX: 0.2,
            scaleY: 0.2,
            angle: 50,
            duration: 500,
            ease: 'Cubic.easeOut',
            callbackScope: this,
            onComplete: () => {
                //계속 흔들거리고 있도록 트윈을 걸어준다.
                this.rotateTween = this.tweens.add({
                    targets: this.squareTweenTargets,
                    angle: 40,
                    duration: 300,
                    yoyo: true,
                    repeat: -1
                });
                if (this.square.successful == 0) {
                    this.addInfo(holeWidth, wallWidth);
                }
                this.currentGameMode = GameModes.WAITING;
            }
        });
    }

    grow() : void {
        if(this.currentGameMode == GameModes.WAITING)
        {
            this.currentGameMode = GameModes.GROWING;
            if(this.square.successful == 0) { //처음 시작이라면
                this.infoGroup.toggleVisible();
            }
            
            //0.4 => 1로 커져가는 트윈을 만들어두고 손을 뗐을 때 정지
            this.growTween = this.tweens.add({
                targets: this.squareTweenTargets,
                scaleX:1,
                scaleY:1,
                duration: GameOptions.growTime
            });
        }
    }

    stop(): void{
        if(this.currentGameMode == GameModes.GROWING)
        {
            this.currentGameMode = GameModes.IDLE;
            this.growTween.stop(); //트윈 정지
            this.rotateTween.stop(); //흔들거리는 회전 트윈 정지
            this.rotateTween = this.tweens.add({
                targets: this.squareTweenTargets,  //플레이어와 숫자를
                angle:0,
                duration:300,
                ease:'Cubic.easeOut',
                //이렇게 해주거나 callbackScope : this를 추가하여 function으로 설정 가능
                onComplete:()=>{
                    if(this.square.displayWidth <= this.rightSquare.x - this.leftSquare.x){
                        //스케일 업 된 사이즈가 홀에 빠질정도로 작다면
                        this.tweens.add({
                            targets:this.squareTweenTargets,
                            y: this.gameHeight + this.square.displayHeight, //바닥 뚫고 나가
                            duration:600,
                            ease: 'Cubic.easeIn',
                            onComplete:()=>{
                                this.levelText.text = GameTexts.failure;
                                this.gameOver();
                            }
                        })   
                    }else {
                        if(this.square.displayWidth <= this.rightWall.x - this.leftWall.x) {
                            this.fallAndBounce(true);
                        }else{
                            this.fallAndBounce(false);
                        }
                    }
                }
            })
        }
    }

    fallAndBounce(success: Boolean) : void {
        //추락지점을 계산하자
        let destY = this.gameHeight - this.leftSquare.displayHeight - this.square.displayHeight * 0.5;
        let msg = success ? GameTexts.success : GameTexts.failure;
        if(success) {
            this.square.successful++; //성공횟수 증가
        }
        else {
            destY = this.gameHeight - this.leftSquare.displayHeight 
                                    - this.leftWall.displayHeight  
                                    - this.square.displayHeight * 0.5;
        }
        this.tweens.add({
            targets:this.squareTweenTargets,
            y: destY,
            duration:600,
            ease: 'Bounce.easeOut',
            onComplete:()=>{
                this.levelText.text = msg;
                if(!success){
                    this.gameOver();
                }else{
                    this.time.addEvent({
                        delay:1000,
                        callback:()=>{
                            if(this.square.successful == this.saveData.level){
                                //기록갱신시
                                this.saveData.level++;
                                localStorage.setItem(GameOptions.localStorageName, JSON.stringify(this.saveData));
                                this.scene.start('PlayGame'); //씬 재시작
                            }else {
                                //기록 갱신은 못했다면 앞으로 기록 갱신까지 남은 스테이지 알려주고
                                this.squareText.updateText( (this.saveData.level - this.square.successful) + "");
                                this.levelText.text = `level ${this.saveData.level}`;
                                this.updateLevel();
                            }
                        }
                    })
                }
            }
        });
    }

    addInfo(holeWidth : number, wallWidth : number) : void 
    {
        this.infoGroup = this.add.group();
        let targetSquare = this.add.sprite(this.gameWidth / 2, this.gameHeight - this.leftSquare.displayHeight, 'square');
        targetSquare.displayWidth = holeWidth + wallWidth;
        targetSquare.displayHeight = holeWidth + wallWidth;
        targetSquare.alpha = 0.3;
        targetSquare.setOrigin(0.5, 1);
        this.infoGroup.add(targetSquare);
        let targetText = this.add.bitmapText(this.gameWidth / 2, targetSquare.y - targetSquare.displayHeight - 20, 'onefont', GameTexts.landHere, 48);
        targetText.setOrigin(0.5, 1);
        this.infoGroup.add(targetText);
        let holdText = this.add.bitmapText(this.gameWidth / 2, 250, 'onefont', GameTexts.infoLines[0], 40);
        holdText.setOrigin(0.5, 0);
        this.infoGroup.add(holdText);
        let releaseText = this.add.bitmapText(this.gameWidth / 2, 300, 'onefont', GameTexts.infoLines[1], 40);
        releaseText.setOrigin(0.5, 0);
        this.infoGroup.add(releaseText);
    }

    gameOver() : void 
    {
        this.time.addEvent({
            delay: 1000,
            callback: ()=> {
                this.scene.start('PlayGame');
            }
        });
    }
}