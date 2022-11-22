import Phaser from "phaser";
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
        const projectile = this.getFirstDead(true) as Projectile; //만약 없으면 생성까지
        projectile.setActive(true);
        projectile.setVisible(true);
        return projectile;
    }
}