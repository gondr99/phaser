import Phaser from "phaser";

const config = {
  type: Phaser.AUTO, //default is webgl
  width:800,
  height:600,
  physics:{
    // Arcade Physics 플러그인이 물리엔진의 역할
    default:'arcade',
    
    //기본 중력적용 및 아케이드 피직스 엔진에 여러가지 적용
    arcade:{
      gravity: {x:0, y:400},
      debug:true,
    }
  },
  scene: {
    preload: Preload,
    create: Create,
    update: Update
  }
}

const VELOCITY = 200;
const FLAPPOWER = 250;
let bird = null;
const {width:WIDTH, height:HEIGHT} = config;
const initBirdPosition = {x:WIDTH * 0.1, y:HEIGHT * 0.5};


function Preload()  //시작전 로드
{
//여기서 this는 Scene 객체다.
  this.load.image('sky', 'assets/sky.png');
  this.load.image('bird', 'assets/bird.png');
}

function Create()  //awake
{
  //debugger - 이거 쓰면 중단점 설정임
  
  // x, y, key, frame x, y는 중심점이다.
  //let img = this.add.image(width / 2, height / 2, 'sky', 1);
  let img = this.add.image(0, 0, 'sky');
  img.setOrigin(0,0);

  // physics를 붙이면 피직스 오브젝트가 됨.
  bird = this.physics.add.sprite(initBirdPosition.x, initBirdPosition.y, 'bird');//.setOrigin(0,0);
  //https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Sprite.html

  //bird.body.gravity.y = 200; 
  //200픽셀 / 초의 속도로 중력적용, 기본중력 적용후 이것도 하면 2배로 된다.

  this.input.on('pointerdown', ()=>{
    console.log("press mouse button");
  });

  //https://photonstorm.github.io/phaser3-docs/Phaser.Input.Keyboard.html
  this.input.keyboard.on('keydown_SPACE', Flap);
  
}


// 새의 y포지션을 체크해서 뒤진거를 체크
function Update(time, delta)
{
  if(bird.y > HEIGHT - bird.height * 0.5 || bird.y < 0 + bird.height * 0.5)
  {
    GameOver();
  }
}

function GameOver()
{
  RestartPlayerPosition();
}

function RestartPlayerPosition()
{
  bird.x = initBirdPosition.x;
  bird.y = initBirdPosition.y;
  bird.body.velocity.y = 0; 
}

function Flap()
{
  bird.body.velocity.y = -FLAPPOWER;
}

new Phaser.Game(config);