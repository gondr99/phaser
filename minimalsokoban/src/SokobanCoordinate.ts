
export class SokobanCoordinate
{
    private _row : number;
    private _column: number;

    constructor(row: number, column: number)
    {
        this._row = row;
        this._column = column;
    }

    //이러면 멤버변수처럼 사용가능하다.
    get row(): number 
    {
        return this._row;
    }
    get column(): number
    {
        return this._column;
    }

    setCoordinate(row: number, column: number): void 
    {
        this._row = row;
        this._column = column;
    }
}