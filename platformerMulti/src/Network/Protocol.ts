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
    damage:number;
}

export interface ProjectileHitInfo
{
    projectileId:number; //피격한 투사체의 아이디
    playerId:string; //피격당한 녀석
    projectileLTPosition:Position; //투사체의 왼쪽 상단 위치
    damage:number;
}
//플레이어 크기는 32X38, 투사체 크기는 20X20 이다.

export interface DeadInfo
{
    playerId:string;
}

export interface ReviveInfo
{
    playerId:string;
    info:SessionInfo;
}

export interface UserInfo{
    name:string;
    playerId?:string;
}

//현재 방의 진행정보들
export interface RoomInfo {
    userList:UserInfo[],
    roomName:string,
    userCnt:number;
    maxCnt:number;
    isPlaying:boolean
}