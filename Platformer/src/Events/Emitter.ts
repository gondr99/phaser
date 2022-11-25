import Phaser from "phaser";

export default class EventEmitter extends Phaser.Events.EventEmitter
{
    static Instance: EventEmitter;
    constructor()
    {
        super();
    }
}