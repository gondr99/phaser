export interface Position 
{
    x:number;
    y:number;
}

export interface SessionInfo
{
    id:string;
    name:string;
    position:Position;
    flipX:boolean;
    isMoving:boolean;
}

export interface PlayerList 
{
    list:SessionInfo[];
}

export interface Iceball 
{
    ownerId:string;
    position:Position;
    direction:number;
    velocity:Position;
    lifetime:number;
}