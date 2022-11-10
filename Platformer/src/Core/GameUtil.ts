import Phaser from "phaser";
import GameMap from "../Entities/GameMap";

export interface RayCastHit 
{
    line:Phaser.Geom.Line;
    hasHit:boolean;
}

export default class GameUtil
{
    static raycast(start:Phaser.Math.Vector2, direction : Phaser.Math.Vector2, mapLayer:Phaser.Tilemaps.TilemapLayer,  rayLength:number = 60) : RayCastHit
    {
        //const {x, y, width, height, halfHeight} = body;
        const line = new Phaser.Geom.Line();

        line.x1 = start.x;
        line.y1 = start.y;
        line.x2 = start.x + direction.x * rayLength;
        line.y2 = start.y + direction.y * rayLength;
        
        const hits:Phaser.Tilemaps.Tile[] = mapLayer.getTilesWithinShape(line, {isColliding:true});
        
        return {line, hasHit: hits.length > 0};
    }
}