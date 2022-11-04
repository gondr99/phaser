const mapWidth:number = 1600;
const gameWidth:number = 1280;

export const GameOption = 
{
    width:gameWidth,
    height:600,
    mapOffset: mapWidth > gameWidth ? mapWidth - gameWidth : 0 ,
    cameraZoomFactor:1.5,
    bottomOffset:200, //캠 밖까지의 오프셋
}