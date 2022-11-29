import Phaser from "phaser";
import { Position } from "../../Network/Protocol";
import Projectile from "../Projectile";

export default class ProjectilePool extends Phaser.Physics.Arcade.Group
{
    static Instance: ProjectilePool;

    pool: Projectile[];
    constructor(scene: Phaser.Scene)
    {
        super(scene.physics.world, scene);

        this.pool = this.createMultiple({
            frameQuantity:20,  //얼마나 많은 발사체가 게임에서 활성화 될거냐
            active:false,
            visible:false,
            key:'iceball',
            classType: Projectile
        }) as Projectile[];
        //만들어진 풀에 있는 녀석들의 중력적용을 해제
        this.pool.forEach(p => p.body.setAllowGravity(false));
    }

    getProjectile(): Projectile
    {
        //가져오는게 null일경우 새로 만들어서 셋팅
        let projectile: Projectile | null = this.getFirstDead(false) as Projectile; //만약 없으면 생성까지
        if(projectile == null)
        {
            projectile = new Projectile(this.scene, 0, 0, "iceball");
            this.add(projectile);
            this.pool.push(projectile);
            projectile.body.setAllowGravity(false);
        }
        projectile.setActive(true);
        projectile.setVisible(true);
        return projectile;
    }

    searchAndDestroy(id:number, pLTPos:Position): void 
    {
        let p = this.pool.find(x => x.projectileId == id);
        if(p == undefined)
        {
            console.log(`error: no projectie ${id}`);
            return;
        }


        p.addExplosion(pLTPos); //이거 위치 보정해야해
        p.setDisable();

    }
}