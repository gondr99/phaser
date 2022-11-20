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

    am.create({
        key:"diamond_shine",
        frames:[
            {key:"diamond-1"},
            {key:"diamond-2"},
            {key:"diamond-3"},
            {key:"diamond-4"},
            {key:"diamond-5"},
            {key:"diamond-6"}
        ],
        frameRate:5,
        repeat:-1
    })
}