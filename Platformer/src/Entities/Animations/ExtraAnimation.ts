import Phaser from "phaser"
export default (am:Phaser.Animations.AnimationManager)=>{
    am.create({
        key:"hiteffect",
        frames:am.generateFrameNumbers("hit_effect", {start:0, end:4}),
        frameRate:10,
        repeat:0,
    })
}