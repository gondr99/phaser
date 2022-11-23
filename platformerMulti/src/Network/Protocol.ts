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
    projectileId:number; //발사체 고유 아이디
    position:Position;
    direction:number;
    velocity:Position;
    lifetime:number;
}

export interface ProjectileHitInfo
{
    projectileId:number; //피격한 투사체의 아이디
    playerId:string; //피격당한 녀석
    projectileLTPosition:Position; //투사체의 왼쪽 상단 위치
}
//플레이어 크기는 32X38, 투사체 크기는 20X20 이다.