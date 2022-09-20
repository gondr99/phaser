import { SokobanActor } from "./SokobanActor";
import { SokobanCoordinate } from "./SokobanCoordinate";

export class SokobanMovement 
{
    actor: SokobanActor;
    from: SokobanCoordinate;
    to: SokobanCoordinate;
    
    constructor(actor: SokobanActor, from: SokobanCoordinate, to: SokobanCoordinate)
    {
        this.actor = actor;
        this.from = new SokobanCoordinate(from.row, from.column);
        this.to = new SokobanCoordinate(to.row, to.column);
    }

    
}