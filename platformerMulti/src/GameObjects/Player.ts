import Phaser from "phaser";
import InitPlayerAnimation from "../Animation/PlayerAnimation";
import { CheckAnimationPlay } from "../Core/GameUtil";
import SocketManager from "../Core/SocketManager";
import { DeadInfo, Position, SessionInfo } from "../Network/Protocol";
import HealthBar from "./HealthBar";
import PlayerAttack from "./PlayerAttack";

export default class Player extends Phaser.Physics.Arcade.Sprite
{
    speed:number;
    jumpPower:number;
    cursorsKey: Phaser.Types.Input.Keyboard.CursorKeys;
    body: Phaser.Physics.Arcade.Body;

    //점프 관련된 변수들 선언
    isGround:boolean = false;
    maxJumpCount:number = 2;
    currentJumpCount:number = 0;

    //네트워크 관련 변수
    isRemote:boolean = false;
    id:string;

    waitingConfirm:number[] = []; //피격당한 투사체에게 피격확정을 받기까지 대기중

    iceballAttack: PlayerAttack;
    hasBeenHit:boolean = false; //피격중에는 다시 안맞게
    bouncePower:number = 250; //튕겨나가는 힘


    healthBar:HealthBar;

    maxHp:number = 10;
    hp:number = 10;
    
    isDead:boolean = false;

    constructor(scene: Phaser.Scene, x:number, y:number, 
        key:string, speed:number, jumpPower:number, isRemote:boolean, id:string)
    {
        super(scene, x, y, key);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.speed = speed;
        this.jumpPower = jumpPower;
        this.isRemote = isRemote; //원격 여부
        this.id = id;

        //공격 객체 할당
        this.iceballAttack = new PlayerAttack(this);
        
        this.init(20);//초기 HP할당

        this.healthBar = new HealthBar(scene, x - 32 * 0.5, y - 38 * 0.5 - 15,  32, 5, 2);
    }

    isWaitingForHitConfirm(projectileId:number) : boolean
    {
        return this.waitingConfirm.find(x => x == projectileId) != undefined;
    }

    addWaiting(projectileId:number): void 
    {
        this.waitingConfirm.push(projectileId);
    }

    removeWaiting(projectileId:number): void 
    {
        let idx = this.waitingConfirm.findIndex(x => x == projectileId);
        if(idx < 0) return;
        this.waitingConfirm.splice(idx, 1); //하나 잘라내기
    }

    //피격당했을 때
    takeHit(damage: number): void 
    {
        if(this.hasBeenHit || this.isDead) return;
        this.hasBeenHit = true;

        //여기에 데미지 처리 식 들어가야 한다.
        this.hp -= damage;
        if(this.hp <= 0) {
            this.hp = 0;
            this.setDead();
        }else {
            let tween = this.playDamageTweenAnimation();
            this.scene.time.delayedCall(1000, ()=> {
                this.hasBeenHit = false;
                tween.stop(0); //원래 상태로
            });
        }

        this.healthBar.setHealth(this.hp / this.maxHp);
    }

    setDead(): void 
    {
        console.log("dead");
        this.hasBeenHit = false;
        this.setTint(0xff0000);
        this.body.checkCollision.none = true;
        this.setCollideWorldBounds(false);
        
        this.isDead = true;
        //조종하고 있던 캐릭터면 
        if(this.isRemote == false)
        {
            this.setVelocity(0, -200);
            //2초 이후에 서버로 딜레이 콜을 날려서 해당 캐릭터를 지우고 카운트 다운 시작하도록
            this.scene.time.delayedCall(2000, () => {
                let info: DeadInfo = {playerId: this.id}
                this.setActive(false);
                this.setVisible(false);
                SocketManager.Instance.sendData("player_dead", info);
            });
        }
    }

    revive(position:Position): void 
    {
        this.setActive(true);
        this.setVisible(true);
        
        let {x, y} = position;
        this.body.reset(x, y);
        this.x = x;
        this.y = y;

        this.clearTint();
        this.body.checkCollision.none = false;
        this.setCollideWorldBounds(true);

        this.isDead = false;

        this.hp = this.maxHp;
        this.healthBar.setHealth(this.hp/ this.maxHp);

        console.log("개같이 부활!");
        
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

    init(maxHP:number): void 
    {
        this.maxHp = this.hp = maxHP;

        this.setCollideWorldBounds(true); //월드 경계선과 충돌
        InitPlayerAnimation(this.scene.anims); //플레이어 애니메이션을 만들어주고
        if(this.isRemote == false){
            this.cursorsKey = this.scene.input.keyboard.createCursorKeys();

            //직접 조종하는 캐릭터는 q키 바인드
            this.scene.input.keyboard.on("keydown-Q", this.fireIceball, this);

            this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
        }else {
            this.body.setAllowGravity(false); //원격 제어할꺼면 중력 해제. 포지션까지 제어할꺼니까
        }
    }

    //서버로 아이스볼을 발사할 것이라고 시그널 보내
    fireIceball(): void
    {
        this.iceballAttack.attemptAttack(); //공격시도 
    }

    //왼쪽 오른쪽 방향만 direction으로 받는다.
    move(direction: number): void{
        this.setVelocityX(direction * this.speed);
    }

    jump(): void {
        this.currentJumpCount++;
        if(this.isGround || this.currentJumpCount <= this.maxJumpCount)
        {
            this.setVelocityY(-this.jumpPower);
        }
    }

    setInfoSync(info: SessionInfo)
    {
        //console.log("sync");
        this.x = info.position.x;
        this.y = info.position.y;
        this.setFlipX(info.flipX);
        //나중에 공격모션시에는 여기에 별도 if문 필요

        if(CheckAnimationPlay(this.anims, "throw")) {
            return;
        }
        
        if(info.isMoving) {
            this.play("run", true);
        }else{
            this.play("idle", true);
        }
    }

    isMoving(): boolean 
    {
        return this.body.velocity.length() > 0.1;
    }

    preUpdate(time: number, delta: number): void {
        super.preUpdate(time, delta);
        this.healthBar.move(this.x - 32 * 0.5, this.y - 38 * 0.5 - 15);
    }

    update(time: number, delta: number): void 
    {
        if(this.hasBeenHit ) return;
        if(this.cursorsKey == undefined) return;
        if(this.isDead == true) return; //사망시에는 처리 안함.

        const {left, right, space} = this.cursorsKey;
        const isSpaceJustDown: boolean = Phaser.Input.Keyboard.JustDown(space);
        this.isGround = this.body.onFloor();

        if(left.isDown){
            this.move(-1);
            this.setFlipX(true);
        }else if(right.isDown)
        {
            this.move(1);
            this.setFlipX(false);
        }else {
            this.move(0);
        }

        if(isSpaceJustDown) {
            this.jump();
        }

        if(this.isGround && this.body.velocity.y == 0)
        {
            this.currentJumpCount = 0; //바닥에 닿으면 점프카운트 0으로 돌린다.
        }

        if(CheckAnimationPlay(this.anims, "throw")) {
            return;
        }

        if(this.isGround == true)
        {
            if(Math.abs(this.body.velocity.x) <= 0.1)
            {
                this.play("idle", true);
            }else{
                this.play("run", true);
            }
        }else {
            this.play("jump", true);
        }
    }
}