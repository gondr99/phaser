import KeyCodes = Phaser.Input.Keyboard.KeyCodes;

export class PlayGameScene extends Phaser.Scene {
    debugText: Phaser.GameObjects.Text;
    arrowKeys: Phaser.Types.Input.Keyboard.CursorKeys; //커서키

    keyA: Phaser.Input.Keyboard.Key;
    keyD: Phaser.Input.Keyboard.Key;

    leftPress: boolean;
    rightPress: boolean;

    mousePressed: boolean;
    mouseX:number;

    //타일 스프라이트는 반복되는 텍스쳐를 만들 때 사용한다
    leftHighlight: Phaser.GameObjects.TileSprite;
    rightHighlight: Phaser.GameObjects.TileSprite;

    halfGameWidth: number;
    gameHeight: number;

    constructor()
    {
        super("PlayGameScene");
    }

    preload() : void {
        this.load.image("line", "assets/dotted.png");
        this.load.image("highlight", "assets/highlight.png");
    }
    create() : void {
        //게임의 절반크기와 높이를 구해주고
        this.halfGameWidth = this.game.config.width as number / 2;
        this.gameHeight = this.game.config.height as number;
        //마우스가 눌렸는지를 체크
        this.mousePressed = false;
        
        this.leftHighlight = this.add.tileSprite(0, 0, this.halfGameWidth, this.gameHeight, 'highlight');
        this.leftHighlight.setOrigin(0, 0);

        this.rightHighlight = this.add.tileSprite(this.halfGameWidth, 0, this.halfGameWidth, this.gameHeight, 'highlight');
        this.rightHighlight.setOrigin(0, 0);

        // 가운데 라인은 한번 그리고 말거라서 굳이 변수로 넣지 않고 추가만 한다.
        this.add.tileSprite(this.halfGameWidth, 0, 4, this.gameHeight, 'line').setOrigin(0.5, 0);

        //화살표키
        this.arrowKeys = this.input.keyboard.createCursorKeys();
        this.keyA = this.input.keyboard.addKey(KeyCodes.A);
        this.keyD = this.input.keyboard.addKey(KeyCodes.D);

        //일반적으로 페이저는 모바일 전용이기 때문에 포인터를 많이 활용한다.(키보드는 거의 디버깅용도)
        //기본적으로 포인터 2개를 활성화하는데 하나가 마우스 포인터, 2번째가 터치포인터(Pointer1)다.
        this.input.addPointer(2); //뒤의 숫자는 포인터의 갯수 (멀티 터치 이용할거면 숫자올려, 최대 10개까지 가능)
        
        this.input.on("pointerdown", this.setMousePressed, this);
        this.input.on("pointerup", this.setMouseReleased, this);
        this.input.on("pointermove", this.getMousePosition, this);

        const textStyle : Phaser.Types.GameObjects.Text.TextStyle = {
            color:"#ffffff",
            fontFamily:"monospace",
            fontSize:"18px"
        };
        this.debugText = this.add.text(16, 16, "", textStyle);
    }
    setMousePressed(): void 
    {
        this.mousePressed = true;
        
    }

    setMouseReleased(): void
    {
        this.mousePressed = false;
    }

    getMousePosition(p : Phaser.Input.Pointer): void
    {
        this.mouseX = p.x;
    }

    update(time: number, delta:number) : void{
        this.leftPress = false;
        this.rightPress = false;
        
        let reportText: string = "";

        if(this.mousePressed)
        {
            if(this.mouseX > this.halfGameWidth) //오른쪽이 눌림
            {
                this.rightPress = true;
                reportText += "오른쪽 영역 마우스 클릭!\n";
            }else{
                this.leftPress = true;
                reportText += "왼쪽 영역 마우스 클릭!\n";
            }
        }

        //만약 터치 포인터를 잡아내려면
        if(this.input.pointer1.isDown)
        {
            if(this.input.pointer1.x > this.halfGameWidth)
            {
                this.rightPress = true;
                reportText += "오른쪽 영역에 포인터1이 눌림";
            }else {
                this.leftPress = true;
                reportText += "왼쪽 영역에 포인터1이 눌림";
            }
        }

        //두번째 포인터도 잡으려면
        if(this.input.pointer2.isDown)
        {
            if(this.input.pointer2.x > this.halfGameWidth)
            {
                this.rightPress = true;
                reportText += "오른쪽 영역에 포인터2이 눌림";
            }else {
                this.leftPress = true;
                reportText += "왼쪽 영역에 포인터2이 눌림";
            }
        }

        // is "A" key down?
        if (this.keyA.isDown) {
 
            // left button is being pressed
            this.leftPress = true;
 
            // update report text
            reportText += "'A' key pressed\n";
        }
 
        // is "D" or key down?
        if (this.keyD.isDown) {
             
            // right button has been pressed
            this.rightPress = true;
 
            // update report text
            reportText += "'D' key pressed\n";
        }
 
        // is left arrow key down?
        if (this.arrowKeys.left.isDown) {
 
            // left button is being pressed
            this.leftPress = true;
 
            // update report text
            reportText += "'LEFT' key pressed\n";
        }
 
        // is right arrow key down?
        if (this.arrowKeys.right.isDown) {
             
            // right button has been pressed
            this.rightPress = true;
 
            // update report text
            reportText += "'RIGHT' key pressed\n";
        }


        this.leftHighlight.setVisible(this.leftPress);
        this.rightHighlight.setVisible(this.rightPress);
        this.debugText.setText(`왼쪽 요약 : ${this.leftPress}\n오른쪽 요약 : ${this.rightPress}\n-------------------\n${reportText}`);
    }

}