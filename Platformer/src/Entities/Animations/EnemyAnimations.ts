import Phaser from "phaser";

export const birdmanAnim = (animationManager : Phaser.Animations.AnimationManager)=>{
    
    animationManager.create({
        key:'birdman-idle',
        frames:animationManager.generateFrameNumbers("birdman", {start:0, end:12}),
        frameRate:8,
        repeat:-1
    });
};