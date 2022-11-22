import Phaser from "phaser";
import InitPlayerAnimation from "../Animation/PlayerAnimation";
import { SessionInfo } from "../Network/Protocol";
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

    iceballAttack: PlayerAttack;
    
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
        this.init();
    }

    init(): void 
    {
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
        this.x = info.position.x;
        this.y = info.position.y;
        this.setFlipX(info.flipX);
        //나중에 공격모션시에는 여기에 별도 if문 필요
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

    update(time: number, delta: number): void 
    {
        if(this.cursorsKey == undefined) return;

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