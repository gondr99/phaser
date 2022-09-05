import { PhysicsBox } from "./PhysicsBox";
import Vector2 = Phaser.Math.Vector2;
import Line = Phaser.Geom.Line;
import Rectangle = Phaser.Geom.Rectangle;

export class PhaserSweptAABB 
{         
    checkCollisionTime(s1:PhysicsBox, s2: PhysicsBox, time:number ): number 
    { 
        //2개의 스피드 벡터를 뺄셈하여 상대적인 속도를 구한다.
        let relativeSpeed: Vector2 = new Vector2(s1.velocity.x, s1.velocity.y).subtract(new Vector2(s2.velocity.x, s2.velocity.y));
 
        //let relativeSpeed: Vector2 = s1.velocity.subtract(s2.velocity);  //이렇게 코딩하면 s1벡터가 변해버린다.
        //이동 라인을 구함.         
        let movementLine: Line = new Line(s1.x, s1.y, 
                s1.x + relativeSpeed.x * (time / 1000), 
                s1.y + relativeSpeed.y * (time / 1000));
        //상대속도로 이동하여 충돌 계산.


        let minkowskiRectangle: Rectangle = this.minkowskiSum(s1, s2);
        
        let intersectionPoints: Phaser.Geom.Point[] = [];

        Phaser.Geom.Intersects.GetLineToRectangle(movementLine, minkowskiRectangle, intersectionPoints);
 
        // 충돌지점의 길이에 따라 
        switch (intersectionPoints.length) {
            case 0:
                return 1;
                break;
            case 1:
                //충돌지점까지의 새로운 라인을 그리고
                let collisionLine: Line = new Line(s1.x, s1.y, intersectionPoints[0].x, intersectionPoints[0].y);
                // 충돌라인과 이동라인간의 비율을 계산해서 리턴
                return Phaser.Geom.Line.Length(collisionLine) / Phaser.Geom.Line.Length(movementLine);
            default:
                //2개이상 충돌시에
                let minDistance: number = Infinity;
                let minIndex: number = 0;
 
                // 모든 교점을 찾아서 
                for (let i: number = 0; i < intersectionPoints.length; i ++) {
                    let distance: number = Phaser.Math.Distance.Between(s1.x, s2.y, intersectionPoints[i].x, intersectionPoints[i].y);
                     
                    if (distance < minDistance) {
                        minIndex = i;
                        minDistance = distance;
                    } 
                }
 
                // 가장 작은 충돌라인 알아내고
                let collisionLine2: Line = new Line(s1.x, s1.y, intersectionPoints[minIndex].x, intersectionPoints[minIndex].y);
                return Line.Length(collisionLine2) / Phaser.Geom.Line.Length(movementLine);
        }
    }


    minkowskiSum(s1:PhysicsBox, s2:PhysicsBox) : Rectangle
    {
        //바운딩 박스 구하기
        let s1Bounds : Rectangle = s1.getBounds();
        let s2Bounds : Rectangle = s2.getBounds();

        //새로운 사각형의 구성요소 구하기
        let left: number = s2Bounds.left - s1.width / 2;
        let top: number = s2Bounds.top - s1.height / 2;
        let width: number = s2.width + s1.width;
        let height: number = s2.height + s1.height;

        return new Rectangle(left, top, width, height);
    }
}