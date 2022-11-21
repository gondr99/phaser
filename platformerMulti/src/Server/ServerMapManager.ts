import { Position } from "./Network/ServerProtocol";
import FS from 'fs'

export default class ServerMapManager 
{
    static Instance: ServerMapManager

    spawnPoints: Position[] = []; //스폰 포지션
    constructor(mapPath:string)
    {
        if(FS.existsSync(mapPath)) {
            let mapJson = FS.readFileSync(mapPath);
            let json = JSON.parse(mapJson.toString());
            
            for(let i = 0; i < json.layers[3].objects.length; i++){
                let obj = json.layers[3].objects[i];
                this.spawnPoints.push({x:obj.x, y:obj.y});
            }
        }else {
            console.error("맵파일이 존재하지 않습니다.");
        }
    }
}