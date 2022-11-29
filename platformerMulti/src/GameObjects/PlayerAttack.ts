import Phaser from "phaser";
import { GetTimestamp } from "../Core/GameUtil";
import SocketManager from "../Core/SocketManager";
import { Iceball, Position } from "../Network/Protocol";
import Player from "./Player";
import ProjectilePool from "./Pools/ProjectilePool";

export default class PlayerAttack 
{
    //아이스볼 관련 변수
    lastProjectileTime: number = 0; 
    coolDown:number = 1000;//1초
    projectileDamage: number = 10;
    lifeTime:number = 1500; //1.5초
    
    player:Player;
    
    constructor(p: Player)
    {
        this.player = p;
    }

    //공격시도
    attemptAttack() : void
    {
        let now:number = GetTimestamp();
        if(this.coolDown + this.lastProjectileTime > now) return;
        let ownerId = SocketManager.Instance.socket.id; 
        let direction = this.player.flipX ? -1 : 1; //방향
        let center = this.player.getCenter();
        let position:Position = {x: center.x + direction * 5, y:center.y};
        let velocity:Position = {x: 400 * direction, y:0};
        let data:Iceball = {ownerId,direction,position,lifetime:this.lifeTime,velocity, projectileId:0, damage:this.projectileDamage};

        SocketManager.Instance.sendData("fire_projectile", data);
        return;
    }

    fireProjectile(data:Iceball) :void 
    {
        this.lastProjectileTime = GetTimestamp(); //현재시간 저장하고
        let {position, direction, lifetime, ownerId, velocity, projectileId, damage} = data;

        let p = ProjectilePool.Instance.getProjectile();
        p.initAndFire(position, lifetime, velocity.x , direction, ownerId, projectileId, damage);

        this.player.play("throw");
    }

}