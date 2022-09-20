import { TileType, Direction } from "./Define";
import { SokobanActor } from "./SokobanActor";
import { SokobanCoordinate } from "./SokobanCoordinate";
import { SokobanMovement } from "./SokobanMovement";

//type TileData = {[key in string]: TileType};  //이렇게해도 되긴 됨.

export class Sokoban
{
    private _movementInfo: SokobanCoordinate[] = [
        new SokobanCoordinate(-1, 0),  //row -1, col 0 => UP
        new SokobanCoordinate(1, 0), //row 1, col 0 => DOWN
        new SokobanCoordinate(0, -1), //row 0, col -1 => LEFT
        new SokobanCoordinate(0, 1), //row 0, col 1 => RIGHT
    ];

    //소코반 레벨 설계용 아이콘들
    private _stringItems: string = " #.$@*+"; // 0 : " "(바닥), 1: # (벽), 2: . (골), 3:$(바닥에 상자), 4:@(플레이어), 5:*(골 위에 상자), 6:+(골 위에 플레이어)
    private _tileData : {[key in string]: TileType} = {
        " ": TileType.FLOOR,
        "#": TileType.WALL,
        ".": TileType.GOAL,
        "$": TileType.FLOOR | TileType.CRATE,
        "@": TileType.FLOOR | TileType.PLAYER,
        "*": TileType.GOAL | TileType.CRATE,
        "+": TileType.GOAL | TileType.PLAYER
    };
    private _player: SokobanActor;
    private _crates: SokobanActor[];
    private _tiles: SokobanActor[];

    private _level: number[][];

    //배열 초기화
    constructor(){
        this._crates = []
        this._level = [];
        this._tiles = [];
    }

    //문자열을 해석해서 스테이지로 만들어주는 함수
    buildLevelFromString(levelString: string): void 
    {
        let rows: string[] = levelString.split("\n"); //엔터기준으로 나누고
        for(let i : number = 0; i < rows.length; i++)
        {
            this._level[i] = [];
            for(let j: number = 0; j < rows[i].length; j++)
            {
                let value = this._tileData[rows[i].charAt(j)];

                this._level[i][j] = value;

                this.createActors(i, j, value);
            }
        }
    }

    private createActors(row: number, column: number, value: TileType) : void
    {
        switch(value)
        {
            case TileType.FLOOR:
            case TileType.WALL:
            case TileType.GOAL:
                this._tiles.push(new SokobanActor(row, column, value)); //해당 타일 만들어서 넣어주고
                break;
            case TileType.FLOOR | TileType.CRATE:
            case TileType.GOAL | TileType.CRATE:
                this._tiles.push(new SokobanActor(row, column, value - TileType.CRATE)); //상자 빼고 나머지를 타일에 넣어주고
                this._crates.push(new SokobanActor(row, column, TileType.CRATE)); //상자는 상자에 넣는다.
                break;
            case TileType.FLOOR | TileType.PLAYER:
            case TileType.GOAL | TileType.PLAYER:
                this._tiles.push(new SokobanActor(row, column, value - TileType.PLAYER)); //플레이어 빼고 나머지를 타일에 넣어주고
                this._player = new SokobanActor(row, column, TileType.PLAYER);
                break;
        }
    }

    get up(): number 
    {
        return Direction.UP;
    }
    get down(): number
    {
        return Direction.DOWN;
    }
    get left(): number
    {
        return Direction.LEFT;
    }
    get right(): number
    {
        return Direction.RIGHT;
    }

    get actors(): SokobanActor[] {
        let actorArr: SokobanActor[] = this._tiles.concat(this._crates); //타일과 박스를 합쳐서 주고
        actorArr.push(this._player);
        return actorArr; //모든 actor를 전부 리턴한다.
    }

    getValueAt(row: number, column: number): number 
    {
        return this._level[row][column];
    }
    get solved(): boolean
    {
        //바닥에 놓인 상자가 존재하지 않는다면 
        return this._level.findIndex(row => row.includes(TileType.FLOOR | TileType.CRATE)) == -1;
    }

    private isWalkableAt(row: number, column: number): boolean 
    {    
        return (this.getValueAt(row, column) == TileType.FLOOR) || this.getValueAt(row, column) == TileType.GOAL;
    }

    private isCrateAt(row: number, column: number): boolean 
    {
        return this.getValueAt(row, column) == TileType.CRATE || (this.getValueAt(row, column) == (TileType.GOAL | TileType.CRATE));
    }

    private isPushableCrateAt(row: number, column: number, direction:Direction): boolean 
    {
        //현재 장소에 상자가 있고 미는 방향으로 빈공간이 있다면
        return this.isCrateAt(row, column) && 
            this.isWalkableAt(row + this._movementInfo[direction].row, column + this._movementInfo[direction].column);
    }

    private canMove(direction: Direction): boolean
    {
        //이동하고자 하는 목표위치를 정하고
        let destinationRow: number = this._player.row + this._movementInfo[direction].row;
        let destinationCol: number = this._player.column + this._movementInfo[direction].column;

        return this.isWalkableAt(destinationRow, destinationCol) 
            || this.isPushableCrateAt(destinationRow, destinationCol, direction);
    }     
    private moveActor(actor: SokobanActor, from: SokobanCoordinate, to: SokobanCoordinate) : SokobanMovement
    {
        actor.moveTo(to.row, to.column);

        this._level[from.row][from.column] -= actor.type;
        this._level[to.row][to.column] += actor.type;

        return new SokobanMovement(actor, from, to);
    }

    //이동할 방향을 지정하면 움직여야할 actor들을 movement리스트에 담아준다.
    move(direction: Direction): SokobanMovement[] 
    {
        let movements: SokobanMovement[] = [];
        console.log(this.canMove(direction));
        if(this.canMove(direction))
        {
            let playerDestination : SokobanCoordinate 
                = new SokobanCoordinate(this._player.row + this._movementInfo[direction].row, 
                                        this._player.column + this._movementInfo[direction].column);
             
            // loop through all crates
            
            this._crates.forEach ((crate : SokobanActor) => {
                console.log(crate.row, crate.column);
                console.log(playerDestination.row, playerDestination.column);
                // 플레이어가 가고자 하는 방향에 상자가 있다면
                if (crate.row == playerDestination.row && crate.column == playerDestination.column) {
                    console.log("상자 발견");
                    // 해당 상자가 움직일 곳을 정의하여 movement에 넣어준다.
                    let crateDestination : SokobanCoordinate 
                        = new SokobanCoordinate(this._player.row + 2 * this._movementInfo[direction].row, 
                            this._player.column + 2* this._movementInfo[direction].column);
 
                    // move the crate
                    movements.push(this.moveActor(crate, new SokobanCoordinate(crate.row, crate.column), crateDestination));
                }
            });
 
            // move the player
            movements.push(this.moveActor(this._player, new SokobanCoordinate(this._player.row, this._player.column), playerDestination));
       
        }else {
            console.log("못움직여");
        }

        return movements;
    }
}