const mapWidth:number = 1600;
const gameWidth:number = 1280;
const gameHeight:number = 600;
const zoomFactor = 1.5;
export const GameOption = 
{
    width:gameWidth,
    height:gameHeight,
    mapOffset: mapWidth > gameWidth ? mapWidth - gameWidth : 0 ,
    cameraZoomFactor:zoomFactor,
    bottomOffset:200, //캠 밖까지의 오프셋
    realWidth: gameWidth / zoomFactor,
    realHeight: gameHeight / zoomFactor,
    lastLevel:2
}