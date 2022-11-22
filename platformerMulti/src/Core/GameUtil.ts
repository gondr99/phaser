import Phaser from "phaser";

export const GetTimestamp = () : number => {
    let d = new Date();
    return d.getTime(); //타임스탬프를 리턴한다.
};