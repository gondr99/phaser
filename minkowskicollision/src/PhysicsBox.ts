export class PhysicsBox extends Phaser.GameObjects.Sprite {
    velocity: Phaser.Math.Vector2;

    constructor(scene:Phaser.Scene, x:number, y:number, key:string)
    {
        super(scene, x, y, key);
        scene.add.existing(this);

        this.velocity = new Phaser.Math.Vector2(0, 0);
    }

    setVelocity(x: number, y: number): void
    {
        this.velocity.x = x;
        this.velocity.y = y;
    }

    isMoving(): boolean 
    {
        return this.velocity.x != 0 || this.velocity.y != 0;
    }

    stopMoving(): void 
    {
        this.setVelocity(0, 0);
    }

    updatePosition(ms: number): void   //, obstacle: PhysicsBox
    {
        this.x += this.velocity.x * (ms / 1000);
        this.y += this.velocity.y * (ms / 1000);

        // // 진행방향으로 지금 지난 ms 만큼 이동거리를 라인으로 만든다.
        // let movementLine: Phaser.Geom.Line = new Phaser.Geom.Line(
        //             this.x, this.y, 
        //             this.x + this.velocity.x * (ms / 1000), 
        //             this.y + this.velocity.y * (ms / 1000));
         
        // //민코프스키 합을 이용해 사각형을 팽창시킨다.
        // let minkowskiRectangle: Phaser.Geom.Rectangle = this.minkowskiSum(obstacle);
 
        // // 팽창된 민코프스키 사각형과 이동라인간의 충돌 포인트를 저장할 Point 배열
        // let intersectionPoints: Phaser.Geom.Point[] = [];

        // //라인과 다각형이 만나는지 체크함
        // Phaser.Geom.Intersects.GetLineToRectangle(movementLine, minkowskiRectangle, intersectionPoints);

        // switch(intersectionPoints.length)
        // {
        //     //교점 없음 그냥 바디 이동시키면 돼
        //     case 0:
        //         this.x += this.velocity.x * (ms / 1000);
        //         this.y += this.velocity.y * (ms / 1000);
        //         break;
        //     //교점1개 : 충돌발생, 바디를 충돌 포인트로 이동시키고 정지
        //     case 1:
        //         this.x = intersectionPoints[0].x;
        //         this.y = intersectionPoints[0].y;
        //         this.setVelocity(0, 0);
        //         break;
        //     // 2 개 이상의 교점: 바디를 가장 가까운 교점으로 이동시키고 정지
        //     default:
        //         let minDistance: number = Infinity;
        //         let minIndex: number = 0;
 
        //         // 모든 교점을 루프 돌면서 가장 가까운걸 찾는다.
        //         for (let i: number = 0; i < intersectionPoints.length; i ++) {
        //             const p = intersectionPoints[i];
        //             // 바디와 지점간의 거리 구한다.
        //             let distance: number = Phaser.Math.Distance.Between(this.x, this.y, p.x, p.y);
        //             // 해당 거리가 최소거리보다 작다면 교체
        //             if (distance < minDistance) {
        //                 minIndex = i;
        //                 minDistance = distance;
        //             } 
        //         }
        //         this.x = intersectionPoints[minIndex].x;
        //         this.y = intersectionPoints[minIndex].y;
        //         this.setVelocity(0, 0);
        //         break;
        // }
    }

    //양측면 벡터를 합하여 박스를 팽창시킨다.
    minkowskiSum(box: PhysicsBox): Phaser.Geom.Rectangle 
    {
       let b1Bound = this.getBounds();
       let b2Bound = box.getBounds();
       
       //충돌을 체크할 box에 내 크기를 더해서 박스를 팽창시킨다.
       return new Phaser.Geom.Rectangle(
        b2Bound.left - b1Bound.width / 2, 
        b2Bound.top - b1Bound.height / 2, 
        b2Bound.width + b1Bound.width,
        b2Bound.height + b1Bound.height);
    }
}