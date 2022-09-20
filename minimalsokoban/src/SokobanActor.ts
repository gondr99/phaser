import { TileType } from "./Define";
import { SokobanCoordinate } from "./SokobanCoordinate";

export class SokobanActor 
{
    data:any; //해당 오브젝트가 가질 고유 데이터
    private _position: SokobanCoordinate; //좌표
    private _type: TileType; //타일 타입

    //생성자에서 셋팅
    constructor(row: number, column: number, type: TileType)
    {
        this._position = new SokobanCoordinate(row, column);
        this._type = type;
    }

    get type(): TileType
    {
        return this._type;
    }

    get isCrate(): boolean 
    {
        return this._type == TileType.CRATE;
    }

    get isPlayer(): boolean 
    {
        return this._type == TileType.PLAYER;
    }

    get column(): number 
    {
        return this._position.column;
    }

    get row(): number 
    {
        return this._position.row;
    }

    moveTo(row: number, column: number) : void 
    {
        this._position.setCoordinate(row, column);
    }

}