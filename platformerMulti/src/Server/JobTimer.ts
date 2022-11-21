export default class JobTimer
{
    action : () => void;
    time:number = 0;
    intervalTimer: NodeJS.Timer;
    //함수타입 정의는 람다식으로 가능
    constructor(time:number, action: () => void )
    {
        this.time = time;
        this.action = action;
    }

    stopTimer() : void
    {
        clearInterval(this.intervalTimer);
    }

    startTimer() : void
    {
        this.intervalTimer = setInterval(this.action, this.time);
    }
}