import Sat from 'sat';
import type { IComponentOptions } from '@/pitaya';
import { Component } from '@/pitaya';
import { gameStateService } from '@/services';

export interface Point {
  x: number;
  y: number;
}

export interface CollisionObject {
  ellipse?: boolean;
  polygon?: Point[];
  width: number;
  height: number;
  x: number;
  y: number;
  realX: number;
  item?: Sat.Circle | Sat.Polygon | Sat.Box;
}
/**
 * 游戏的碰撞管理器
 */
export class CollisionManager extends Component {
  paused = true;
  parentPivotX = 0;
  collisionResult = new Sat.Response();
  collisionObjects: CollisionObject[];
  constructor(options: IComponentOptions) {
    super(options);

    this.collisionObjects = [];
  }

  pause() {
    this.paused = true;
  }
  resume() {
    // console.log(Sat);
    this.paused = false;
  }

  addObjects(obj: CollisionObject) {
    if (obj.ellipse) {
      // 圆
      obj.item = new Sat.Circle(
        new Sat.Vector(obj.x + obj.width / 2, obj.y + obj.width / 2),
        obj.width / 2
      );
      obj.realX = obj.x + obj.width / 2;
    } else if (obj.polygon) {
      // 多边形
      obj.item = new Sat.Polygon(
        new Sat.Vector(obj.x, obj.y),
        obj.polygon.map((point) => {
          return new Sat.Vector(point.x, point.y);
        })
      );
      obj.realX = obj.x;
    } else {
      // 正方形
      obj.item = new Sat.Box(new Sat.Vector(obj.x, obj.y), obj.width, obj.height).toPolygon();
      obj.realX = obj.x;
    }
    this.collisionObjects.push(obj);
  }
  /*
  test(gameState, obj) {
    if (!gameState.character.sprite) {
      return;
    }
    obj.getGlobalPosition = () => {
      return { x: this.parentPivotX + obj.x, y: obj.y };
    };
    obj.circular = obj.diameter = obj.ellipse;
    obj.parent = this;
    this.parentPivotX = gameState.world.pivotX;
  }
  */
  /**
   * 处理每一帧的碰撞状态
   * @param {*} _delta
   */
  update(_delta: number) {
    if (this.paused) {
      return;
    }

    const gameState = gameStateService.state;

    this.parentPivotX = gameState.world.pivotX;

    const anchorOffsetX = gameState.character.sprite.width * gameState.character.sprite.anchor.x;
    const anchorOffsetY = gameState.character.sprite.height * gameState.character.sprite.anchor.y;

    if (!gameState.character.box) {
      gameStateService.setCharacterBox(
        new Sat.Box(
          new Sat.Vector(
            gameState.character.x - anchorOffsetX + gameState.character.effectiveArea[0],
            gameState.character.y - anchorOffsetY + gameState.character.effectiveArea[1]
          ),
          gameState.character.effectiveArea[2],
          gameState.character.effectiveArea[3]
        ).toPolygon()
      );
    }
    const x =
      gameState.character.x -
      anchorOffsetX +
      gameState.character.vx +
      gameState.character.effectiveArea[0];
    const y =
      gameState.character.y -
      anchorOffsetY +
      gameState.character.vy +
      gameState.character.effectiveArea[1];

    gameStateService.resetCharacterPos(x, y);
    gameStateService.resetCollision();

    this.collisionObjects.forEach((obj) => {
      // 处理主角和每个物体的碰撞情况
      obj.item!.pos.x = obj.realX - this.parentPivotX;

      let collision = false;
      if (obj.ellipse) {
        // 圆形，椭圆形
        collision = Sat.testPolygonCircle(
          gameState.character.box,
          obj.item as Sat.Circle,
          this.collisionResult
        );
      } else {
        collision = Sat.testPolygonPolygon(
          gameState.character.box,
          obj.item as Sat.Polygon,
          this.collisionResult
        );
      }
      if (collision) {
        console.log('🚀 ~ collision:', collision, this.collisionResult.overlapV);
        gameStateService.setCollision(
          true,
          this.collisionResult.overlapV.x,
          this.collisionResult.overlapV.y
        );
      }
      this.collisionResult.clear();
    });
  }
}
