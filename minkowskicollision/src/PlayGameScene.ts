import { PhysicsBox } from "./PhysicsBox";
import { PhaserSweptAABB } from "./PhaserSweptAABB";
import GameObject = Phaser.GameObjects.GameObject;

export class PlayGameScene extends Phaser.Scene {
    box: PhysicsBox;
    wall: PhysicsBox;

    arcadeBox: Phaser.Physics.Arcade.Sprite;
    arcadeWall: Phaser.Physics.Arcade.Sprite;

    projectileSpeed: number = 4000; //아주 빠르게(초당 2만 픽셀)
    wallSpeed: number = -2000;

    AABB: PhaserSweptAABB;

    constructor()
    {
        super({key: "PlayGameScene"});
    }

    preload() : void {
        this.load.image("dot", "assets/dot.png");
        this.load.image("wall", "assets/wall.png");
    }
    create() : void {
        //AABB를 계산 전담 클래스 만들고
        this.AABB = new PhaserSweptAABB();

        //민코프스키를 이용한 박스와
        this.box = new PhysicsBox(this, 20, 128, 'dot');
        this.wall = new PhysicsBox(this, 780, 128, 'wall');

        //아케이드 피직스를 이용한 박스
        this.arcadeBox = this.physics.add.sprite(20, 288, 'dot');
        this.arcadeWall = this.physics.add.sprite(780, 288, 'wall');

        this.arcadeBox.setImmovable(true);
        this.arcadeWall.setImmovable(true);

        this.input.on('pointerdown', this.fireBullets, this);
 
        // 정보 표시
        this.add.text(20, 195, `Bullet Speed: ${this.projectileSpeed} pixels per second`, {
            fontSize: '32px'
        });
 
        this.add.text(20, 12, 'Swept AABB', {
            fontSize: '24px'
        });
        this.add.text(20, 380, 'Arcade Physics', {
            fontSize: '24px'
        });
    }

    update(time: number, delta:number) {
        if (this.box.isMoving() || this.wall.isMoving()) {
 
            // check collision time, can be any number between 0 (already colliding) and 1 (never colliding in this frame)
            let collisionTime: number = this.AABB.checkCollisionTime(this.box, this.wall, delta);
            
            console.log(delta);
            // update box and wall positions according to collision time
            this.box.updatePosition(delta * collisionTime);
            this.wall.updatePosition(delta * collisionTime);
 
            // 충돌이 1보다 작다면 뭔가 충돌이 있던거니 멈추고
            if (collisionTime < 1) {
                // stop both box and wall
                this.box.stopMoving();
                this.wall.stopMoving();
            }
        }
         
        // Arcade physics collider
        this.physics.world.collide(this.arcadeBox, this.arcadeWall, (body1: GameObject, body2: GameObject) => {
             
            // 2개의 body를 정지시킴
            let b1: Phaser.Physics.Arcade.Sprite = body1 as Phaser.Physics.Arcade.Sprite;
            let b2: Phaser.Physics.Arcade.Sprite = body2 as Phaser.Physics.Arcade.Sprite
            b1.setVelocity(0, 0);
            b2.setVelocity(0, 0)
        });
        
        
        // update box position, checking for wall collision
        //this.box.updatePosition(delta, this.wall);
         
        // Arcade physics collider
        //this.physics.world.collide(this.arcadeBox, this.arcadeWall);
    }

    fireBullets(): void 
    {
        this.box.setPosition(20, 128);
        this.wall.setPosition(780, 128);
        this.arcadeBox.setPosition(20, 288);
        this.arcadeWall.setPosition(780, 288);

        this.arcadeBox.setVelocity(this.projectileSpeed, 0);
        this.box.setVelocity(this.projectileSpeed, 0);

        this.arcadeWall.setVelocity(this.wallSpeed, 0);
        this.wall.setVelocity(this.wallSpeed, 0);
    }
}