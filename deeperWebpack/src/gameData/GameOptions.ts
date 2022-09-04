import { PlatformTypes } from "./PlatformTypes"
export const GameOptions = {
    gameSize:{
        width:750,
        height:1334,
    },
    pixelScale:3, //픽셀 스캐일 비율

    firstPlatformPosition: 0.4, //처음 시작하는 플랫폼의 y축 위치
    gameGravity: 1200, //게임에 적용되는 중력
    heroSpeed: 300,
    platformSpeed: 90,
    platformLengthRange: [150, 250], //플랫폼 길이 최소, 최대값
    platformHorizontalDistanceRange: [0, 250], // 플랫폼이 화면중응으로부터 멀어질 거리 최소, 최대
    platformVerticalDistanceRange: [150, 250], //이전 플랫폼과의 y축 거리 최소, 최대

    platformColors: [0xffffff, 0xff0000, 0x00ff00],
    bounceVelocity: 500,
    disappearTime: 1000,

    enemyPatrolingSpeed: [40, 80],
    //enemyChance: 1, //적이 플랫폼위에 나타날 확률 100%,

    sawSpeedRange:[10, 30],
    // platformStuf:[
    //     PlatformTypes.EMPTY_PLATFORM,
    //     PlatformTypes.ENEMY,
    //     PlatformTypes.SAW,
    //     PlatformTypes.ENEMY,
    //     PlatformTypes.ENEMY,
    //     PlatformTypes.SAW,
    //     PlatformTypes.SAW,
    // ],
}
