export default (animationManager : Phaser.Animations.AnimationManager) => 
{
    animationManager.create({
        key:'idle',
        frames:animationManager.generateFrameNumbers("player", 
        {start:0, end:8}),
        frameRate:8,
        repeat:-1
    });

    animationManager.create({
        key:'run',
        frames:animationManager.generateFrameNumbers("player", 
        {start:11, end:16}),
        frameRate:8,
        repeat:-1
    });

    animationManager.create({
        key:'jump',
        frames:animationManager.generateFrameNumbers("player", 
        {start:17, end:23}),
        frameRate:4,
        repeat:1
    });
}