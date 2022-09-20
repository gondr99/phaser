import { DragAndMatchItem } from "./DragAndMatchItem";

interface DragAndMatchConfig {
    rows?: number;
    columns? : number;
    items? : number;
    match? : number;
    tileSize? : number;
    startX? : number;
    startY? : number;
    minDragDistance?: number;
    [otherOptions: string] : unknown;
}
//선택적 프로퍼티는 ?를 붙여서 구현하지 않아도 됨을 알린다.

interface GameConfig 
{
    rows: number;
    columns: number;
    items: number;
    match: number;
    tileSize: number;
    startX: number;
    startY: number;
    minDragDistance: number;
}

enum DirectionType {
    NONE,
    HORIZONTAL,
    VERTICAL
}

interface DragAndMatchTile 
{
    empty: boolean;
    value: number;
    item: DragAndMatchItem
}

export class DragAndMatch 
{
    static readonly DEFAULT_VALUES : GameConfig = {
        rows:6,
        columns:8,
        items:6,
        match:3,
        tileSize:100,
        startX:0,
        startY:0,
        minDragDistance:20
    };

    config:GameConfig;
    gameArray: DragAndMatchTile[][];
    dragDirection: DirectionType;
    dummyItem:DragAndMatchItem;

    constructor(options?: DragAndMatchConfig)
    {
        this.config = {
            rows : (options === undefined || options.rows === undefined) ? DragAndMatch.DEFAULT_VALUES.rows : options.rows,
            columns : (options === undefined || options.columns === undefined) ? DragAndMatch.DEFAULT_VALUES.columns : options.columns,
            items : (options === undefined || options.items === undefined) ? DragAndMatch.DEFAULT_VALUES.items : options.items,
            match : (options === undefined || options.match === undefined) ? DragAndMatch.DEFAULT_VALUES.match : options.match,
            tileSize : (options === undefined || options.tileSize === undefined) ? DragAndMatch.DEFAULT_VALUES.tileSize : options.tileSize,
            startX : (options === undefined || options.startX === undefined) ? DragAndMatch.DEFAULT_VALUES.startX : options.startX,
            startY : (options === undefined || options.startY === undefined) ? DragAndMatch.DEFAULT_VALUES.startY : options.startY,
            minDragDistance : (options === undefined || options.minDragDistance === undefined) ? DragAndMatch.DEFAULT_VALUES.minDragDistance : options.minDragDistance,    
        };

        this.dragDirection = DirectionType.NONE;
        this.gameArray = [];
        //2차원 배열판을 채워준다.
        for(let i : number = 0; i < this.config.rows; i++)
        {
            this.gameArray[i] = [];
            for(let j: number = 0; j < this.config.columns; j++)
            {
                let randomValue : number = this.safeValue(i, j);
                this.gameArray[i][j] = {
                    empty: false,
                    value:randomValue,
                    item: new DragAndMatchItem(
                        i, j, randomValue, 
                        this.config.startX + j * this.config.tileSize, 
                        this.config.startY + i * this.config.tileSize , false)
                }
            }
        }
        this.dummyItem = new DragAndMatchItem(0, 0, 0, 0, 0, true);
    }

    //해당 위치에 매칭으로 처리되지 않는 안전한 랜덤 블럭 번호를 제공한다.
    private safeValue(row: number, column: number): number 
    {
        let safeValues: number[] = [...Array(this.config.items).keys()]; //0 ~5
        if(row >= this.config.match -1) //윗행에 2개이상있으니 매칭될수도 있어
        {
            //3개의 매치가 완성되지 않도록 배치해야하니까
            let possibleMatch: boolean = true;
            let prevValue: number = -1;
            let value: number = -1;

            //현재 배정하고자 하는 열에서부터 매치되는 열까지 전부 매치가 되는지를 체크한다.
            for(let i: number = row - 1; i > row - this.config.match; i--)
            {
                value = this.gameArray[i][column].value;
                possibleMatch = possibleMatch && (value == prevValue || prevValue == -1);
                prevValue = value;
            }
            if(possibleMatch )
            {
                //매칭가능하다면 그녀석은 안전값에서 제거
                let index = safeValues.indexOf(value);
                if(index > -1)
                {
                    safeValues.splice(index, 1); //해당 값은 제거한다.
                }
            }
        }
        //열도 마찬가지로 자기 앞에 2개가 있다면 검사시작
        if (column >= this.config.match - 1) {
            let possibleMatch : boolean = true;
            let prevValue : number = -1;
            let value : number = -1;
            for (let i : number = column - 1; i > column - this.config.match; i --) {
                value = this.gameArray[row][i].value;
                possibleMatch = possibleMatch && (value == prevValue || prevValue == -1);
                prevValue = value;
            }
            if (possibleMatch) {
                let index = safeValues.indexOf(value);
                if (index > -1) {
                    safeValues.splice(index, 1);
                }
            }
        }

        return safeValues[Math.floor(Math.random() * safeValues.length)]; //안전값들중에 랜덤값 배정해서 넘김
    }

    //판에 있는 모든 아이템을 다 긁어온다.
    get items() : DragAndMatchItem[] 
    {
        let items: DragAndMatchItem[] = [];

        for(let i : number = 0; i < this.config.rows; i++)
        {
            for (let j : number = 0; j < this.config.columns; j++)
            {
                items.push(this.gameArray[i][j].item);
            }
        }

        return items;
    }

    //입력이 게임보드 안에서 일어났는지 검사하는 매서드
    isInputInsideBoard(x: number, y:number): boolean
    {
        let column : number = Math.floor((x - this.config.startX) / this.config.tileSize);
        let row : number = Math.floor((y - this.config.startY) / this.config.tileSize);
        return this.validPick(row, column);
    }


    /* 해당 로우와 컬럼이 유효한지를 검사해주는 매서드 */
    validPick(row : number, column : number) : boolean {
        return row >= 0 && row < this.config.rows && column >= 0 && column < this.config.columns && this.gameArray[row] != undefined && this.gameArray[row][column] != undefined;
    }

    /* 입력의 이동을 처리해주는 매서드 */
    handleInputMovement(startX : number, startY : number, currentX : number, currentY : number) : DragAndMatchItem[] {
        let distanceX : number = currentX - startX;
        let distanceY : number = currentY - startY; //이동한 델타값을 계산하고
        //이전에 이동이 없어서 현재 이동한 값이 최소 터치 이동보다 크다면 방향을 다시 계산
        if (this.dragDirection == DirectionType.NONE && Math.abs(distanceX) + Math.abs(distanceY) > this.config.minDragDistance) {
            //세로 이동과 가로이동중에 큰 값을 기준으로 방향 결정
            this.dragDirection = (Math.abs(distanceX) > Math.abs(distanceY)) ? DirectionType.HORIZONTAL : DirectionType.VERTICAL;
        }
        let items : DragAndMatchItem[] = [];
        switch (this.dragDirection) {
            case DirectionType.HORIZONTAL :  //좌우 이동일때
                let row : number = Math.floor((startY - this.config.startY) / this.config.tileSize); //드래그를 시작한 녀석을 찾아내고
                items = this.getItemsAtRow(row); //해당 열의 모든 아이템을 가져온다.
                items.forEach((item) => {
                    let newPosX : number = item.column * this.config.tileSize + distanceX;
                    let limitX : number = this.config.columns * this.config.tileSize;
                    newPosX = newPosX >= 0 ? newPosX % limitX : (newPosX % limitX + limitX) % limitX; //루핑 위치를 구함.
                    item.posX = this.config.startX + newPosX; 
                });
                this.dummyItem.posY = this.config.startY + row * this.config.tileSize;
                this.dummyItem.posX = distanceX >= 0 ? (this.config.startX + Math.abs(distanceX) % this.config.tileSize - this.config.tileSize) : (this.config.startX - Math.abs(distanceX) % this.config.tileSize);
                let columnOffset : number = Math.floor(distanceX / this.config.tileSize);
                let newColumnReference : number = columnOffset >= 0 ? (this.config.columns - 1 - columnOffset % this.config.columns) : (((1 + columnOffset) * -1) % this.config.columns);
                this.dummyItem.value = this.gameArray[row][newColumnReference].value;
                items.push(this.dummyItem);
                break;
            case DirectionType.VERTICAL :
                let column : number = Math.floor((startX - this.config.startX) / this.config.tileSize);
                items = this.getItemsAtColumn(column);
                items.forEach((item) => {
                    let newPosY : number = item.row * this.config.tileSize + distanceY;                  
                    let limitY : number = this.config.rows * this.config.tileSize;
                    newPosY = newPosY >= 0 ? newPosY % limitY : (newPosY % limitY + limitY) % limitY;
                    item.posY = this.config.startY + newPosY;                  
                });
                this.dummyItem.posX = this.config.startX + column * this.config.tileSize;
                this.dummyItem.posY = distanceY >= 0 ? (this.config.startY + Math.abs(distanceY) % this.config.tileSize - this.config.tileSize) : (this.config.startY - Math.abs(distanceY) % this.config.tileSize);  
                let rowOffset : number = Math.floor(distanceY / this.config.tileSize);
                let newRowReference : number = rowOffset >= 0 ? (this.config.rows - 1 - rowOffset % this.config.rows) : (((1 + rowOffset) * -1) % this.config.rows);
                this.dummyItem.value = this.gameArray[newRowReference][column].value;
                items.push(this.dummyItem);
                break;
        }
        return items;
    }


    /* get all items in a row */
    getItemsAtRow(row : number) : DragAndMatchItem[] {
        let items : DragAndMatchItem[] = [];
        for (let i : number = 0; i < this.config.columns; i ++) {
            items.push(this.gameArray[row][i].item as DragAndMatchItem);
        }
        return items;
    }

    /* get all items in a column */
    getItemsAtColumn(column : number) : DragAndMatchItem[] {
        let items : DragAndMatchItem[] = [];
        for (let i : number = 0; i < this.config.rows; i ++) {
            items.push(this.gameArray[i][column].item as DragAndMatchItem);
        }
        return items;
    }
}