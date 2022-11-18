import Phaser from "phaser"
export default (am:Phaser.Animations.AnimationManager)=>{
    am.create({
        key:"hiteffect",
        frames:am.generateFrameNumbers("hit_effect", {start:0, end:4}),
        frameRate:10,
        repeat:0,
    });

    am.create({
        key:"sword_default_swing",
        frames:am.generateFrameNumbers("sword_default", {start:0, end:2}),
        frameRate:20,
        repeat:0,
    });
}