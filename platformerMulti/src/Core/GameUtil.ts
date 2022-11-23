import Phaser from "phaser";

export const GetTimestamp = () : number => {
    let d = new Date();
    return d.getTime(); //타임스탬프를 리턴한다.
};

export const CheckAnimationPlay = (am:Phaser.Animations.AnimationState, key:string) : boolean => {
    return am.isPlaying && am.currentAnim.key === key;
}