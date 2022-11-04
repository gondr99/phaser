import { TileType } from "./Define";
import { GameOptions } from "./GameOptions";
import { Sokoban } from "./Sokoban";

export class PlayGameScene extends Phaser.Scene
{
    sokobanGame: Sokoban;
    arrowKeys: Phaser.Types.Input.Keyboard.CursorKeys;
    isPlayerMoving: boolean;
    
    typeImage: { [key in number]: number};

    constructor()
    {
        super({key:'PlayGameScene'});
        this.typeImage = {};
        this.typeImage[TileType.FLOOR] = 0;
        this.typeImage[TileType.WALL] = 1;
        this.typeImage[TileType.GOAL] = 2;
        this.typeImage[TileType.CRATE] = 3;
        this.typeImage[TileType.PLAYER] = 4;
        this.typeImage[TileType.GOAL | TileType.CRATE] = 5;
        this.typeImage[TileType.GOAL | TileType.PLAYER] = 6;
    }

    create(): void 
    {
        this.isPlayerMoving = false;

        const levelString : string = '########\n#####@.#\n####.$$#\n#### $ #\n### .# #\n###    #\n###  ###\n########';
  
        //인스턴스 만들고 문자열기반으로 스테이지 만들기
        this.sokobanGame = new Sokoban();
        this.sokobanGame.buildLevelFromString(levelString);
        
        this.sokobanGame.actors.map( actor => {
            const ts = GameOptions.tileSize;
            let sprite: Phaser.GameObjects.Sprite = this.add.sprite(ts * actor.column, ts * actor.row, 'tiles', this.typeImage[actor.type]);
            sprite.setOrigin(0, 0);
            actor.data = sprite;
        });

        this.arrowKeys = this.input.keyboard.createCursorKeys();

        document.querySelector("#sendBtn")?.addEventListener("click", e => {
            let xhr:XMLHttpRequest = new XMLHttpRequest();
            
            xhr.open("POST", "http://localhost:9090/data");
            xhr.setRequestHeader("Content-type", "applicaion/json");
            xhr.onreadystatechange = ()=>{
                if(xhr.readyState == XMLHttpRequest.DONE)
                {
                    console.log(xhr.responseText);
                }
            };
            xhr.send(JSON.stringify({name:"gondr"}));
        });
    }

    update(): void
    {
        if(this.isPlayerMoving)
        {
            if (!this.arrowKeys.up.isDown && !this.arrowKeys.right.isDown && 
                !this.arrowKeys.down.isDown && !this.arrowKeys.left.isDown) {
                //키가 안눌렸다면 무브 취소
                this.isPlayerMoving = false;
            }
        }else { //플레이어가 움직이는 중이 아니라면
            let playerMove: (number | null) = null;
            if(this.arrowKeys.up.isDown)
            {
                playerMove = this.sokobanGame.up;
            }
            if(this.arrowKeys.right.isDown)
            {
                playerMove = this.sokobanGame.right;
            }
            if(this.arrowKeys.left.isDown)
            {
                playerMove = this.sokobanGame.left;
            }
            if(this.arrowKeys.down.isDown)
            {
                playerMove = this.sokobanGame.down;
            }

            if(playerMove != null)
            {
                this.isPlayerMoving = true;

                //이쪽방향으로 이동시에 이동해야할것들의 리스트를 받아서 맵핑
                const ts = GameOptions.tileSize;
                this.sokobanGame.move(playerMove).map(move => {
                    move.actor.data.setPosition(ts * move.to.column, ts * move.to.row);
                     
                    move.actor.data.setFrame( this.typeImage[this.sokobanGame.getValueAt(move.to.row, move.to.column)]);
 
                    if (this.sokobanGame.solved) {
                        this.cameras.main.shake(500);
                    }
                });
            }
        }
    }
}