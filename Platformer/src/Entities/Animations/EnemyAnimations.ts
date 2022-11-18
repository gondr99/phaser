import Phaser from "phaser";

export const birdmanAnim = (animationManager : Phaser.Animations.AnimationManager)=>{
    
    animationManager.create({
        key:'birdman-idle',
        frames:animationManager.generateFrameNumbers("birdman", {start:0, end:12}),
        frameRate:8,
        repeat:-1
    });

    animationManager.create({
        key:'birdman-hurt',
        frames:animationManager.generateFrameNumbers('birdman', {start:25, end:26}),
        frameRate:10,
        repeat:0
    });
};

export const snakemanAnim = (animationManager : Phaser.Animations.AnimationManager)=>{
    
    animationManager.create({
        key:'snakeman-idle',
        frames:animationManager.generateFrameNumbers("snakeman", {start:0, end:8}),
        frameRate:8,
        repeat:-1
    });

    animationManager.create({
        key:'snakeman-hurt',
        frames:animationManager.generateFrameNumbers('snakeman', {start:21, end:22}),
        frameRate:10,
        repeat:0
    });
};