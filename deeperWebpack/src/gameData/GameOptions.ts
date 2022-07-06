export const GameOptions = {
    gameSize:{
        width:750,
        height:1334,
    },
    firstPlatformPosition: 0.4,
    gameGravity: 500,
    heroSpeed: 300,
    platformSpeed: 120,
    platformLengthRange: [150, 150],
    platformHorizontalDistanceRange: [0, 250],
    platformVerticalDistanceRange: [150, 250],

    platformColors: [0xffffff, 0xff0000, 0x00ff00],
    bounceVelocity: 400,
    disappearTime: 1000,

    enemyPatrolingSpeed: [40, 80],
    enemyChance: 0.5, //적이 플랫폼위에 나타날 확률 50%
}