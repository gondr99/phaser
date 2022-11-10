import Phaser from 'phaser';
import CollideableObject from './CollideableObject';
import InitPlayerAnimation from './Animations/PlayerAnimation'


//export type ArcadeSpriteWithBody = Phaser.Physics.Arcade.Sprite & {body: Phaser.Physics.Arcade.Body};

export default class Player extends CollideableObject
{
    speed:number;
    jumpPower:number;
    cursorsKey : Phaser.Types.Input.Keyboard.CursorKeys;
    dynamicBody : Phaser.Physics.Arcade.Body;

    maxJumpCount:number = 2;
    currentJumpCount:number = 0;
    isGround:boolean = false;

    health:number;

    hasBeenHit: boolean = false; //맞았는지를 체크하는 불리언변수
    bouncePower:number = 250;

    constructor(scene:Phaser.Scene, x:number, y:number, key:string, speed:number, jumpPower:number, health:number)
    {
        super(scene, x, y, key);

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.speed = speed;
        this.jumpPower = jumpPower;
        this.health = health;
        this.dynamicBody = this.body as Phaser.Physics.Arcade.Body; //바디캐스팅을 통해 타입 재정의
        this.init();
    }

    init():void 
    {
        this.setOrigin(0.5, 1); //아래쪽 중앙에 잡아준다.
        this.cursorsKey = this.scene.input.keyboard.createCursorKeys();
        this.setCollideWorldBounds(true); //월드 경계선과 충돌하도록 처리

        InitPlayerAnimation(this.scene.anims); //애니메이션 초기화

        this.body.setSize(20, 36);

        this.initEvents();
    }

    initEvents(): void
    {
        //스프라이트는 업데이트가 없으니까 업데이트시에 이것도 실행해달라고 요청해야 함.
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    }

    move(direction:number) : void 
    {
        this.setVelocityX(direction * this.speed);
    }

    jump(): void{
        
        this.currentJumpCount++;
        if(this.isGround || this.currentJumpCount <= this.maxJumpCount ){
            this.setVelocityY(-this.jumpPower);
        }
    }

    takeHit(damage:number, dealer: Phaser.Types.Physics.Arcade.GameObjectWithBody): void 
    {
        if(this.hasBeenHit) return;

        this.hasBeenHit = true;
        let dir = new Phaser.Math.Vector2(this.body.x - dealer.body.x, this.body.y - dealer.body.y);
        dir = dir.normalize();
        dir.y = -1;
        this.bounceOff(dir);
        let tween = this.playDamageTweenAnimation();
        this.scene.time.delayedCall(1000, ()=> {
            this.hasBeenHit = false;
            tween.stop(0); //원래 상태로
        });
        // this.scene.time.addEvent({
        //     delay:1000,
        //     callback: () => {
        //         this.hasBeenHit = false;
        //     }
        // })
    }

    bounceOff(dir: Phaser.Math.Vector2) {
        this.setVelocity(dir.x * this.bouncePower, dir.y * this.bouncePower);
    }

    playDamageTweenAnimation(): Phaser.Tweens.Tween 
    {
        return this.scene.tweens.add({
            targets:this,
            duration:200,
            repeat:-1,
            alpha: 0.2,
            yoyo:true
        });
    }

    update(time: number, delta: number): void {
        if(this.hasBeenHit) {return;}
        const {left, right, space} = this.cursorsKey;
        const isSpaceJustDown :boolean = Phaser.Input.Keyboard.JustDown(space); //막 한번 눌린것만 체크
        this.isGround = this.dynamicBody.onFloor();

        if(left.isDown) {
            this.move(-1);
            this.setFlipX(true);
        }else if(right.isDown)
        {
            this.move(1);
            this.setFlipX(false);
        }else {
            this.move(0);
            //이미 재생중이면 재생하지 마라 옵션을 true로 설정
            this.play('idle', true);
        }

        if( isSpaceJustDown ) {
            this.jump();
        }

        if(this.isGround && this.body.velocity.y == 0){
            this.currentJumpCount = 0; //바닥에 닿아있다면 점프카운트를 0으로 만들어라.
        }

        if(this.isGround == true)
        {
            if(Math.abs( this.body.velocity.x )<= 0.1) 
            {
                this.play('idle', true);
            }else{
                this.play('run', true);
            }
        }else {
            this.play("jump", true);
        }
    }
}