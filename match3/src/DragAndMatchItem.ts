export class DragAndMatchItem 
{
    row: number;
    column: number;
    value: number;
    data: any;
    posX: number;
    posY: number;
    isDummy: boolean;

    constructor(row:number, column: number, value:number, posX: number, posY: number, isDummy: boolean)
    {
        this.row = row;
        this.column = column;
        this.value = value;
        this.posX = posX;
        this.posY = posY;
        this.isDummy = isDummy;
    }
}