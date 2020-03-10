import PubSub from 'pubsub-js';
import Sat from 'Sat';
/**
 * 游戏的碰撞管理器
 */
export class CollisionManager {
    constructor() {
        this.paused = true;
        this.parentPivotX = 0;
        this.collisionObjects = [];
        this.collisionResult = new Sat.Response();
    }
    subscribe(...args) {
        PubSub.subscribe(...args);
    }
    publish(...args) {
        PubSub.publish(...args);
    }
    pause() {
        this.paused = true;
    }
    resume() {
        //console.log(Sat);
        this.paused = false;
    }

    addObjects(obj) {
        if (obj.ellipse) {
            //圆
            obj.v = new Sat.Circle(new Sat.Vector(obj.x + obj.width / 2, obj.y + obj.width / 2), obj.width / 2);
            obj.vpx = obj.x + obj.width / 2;
        } else if (obj.polygon) {
            //多边形
            obj.v = new Sat.Polygon(
                new Sat.Vector(obj.x, obj.y),
                obj.polygon.map(point => {
                    return new Sat.Vector(point.x, point.y);
                })
            );
            obj.vpx = obj.x;
        } else {
            //正方形
            obj.v = new Sat.Box(new Sat.Vector(obj.x, obj.y), obj.width, obj.height).toPolygon();
            obj.vpx = obj.x;
        }
        this.collisionObjects.push(obj);
    }
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
    /**
     * 处理每一帧的碰撞状态
     * @param {*} delta
     * @param {*} gameState
     */
    update(delta, gameState) {
        if (this.paused) {
            return;
        }

        this.parentPivotX = gameState.world.pivotX;

        let anchorOffsetX = gameState.character.sprite.width * gameState.character.sprite.anchor.x;
        let anchorOffsetY = gameState.character.sprite.height * gameState.character.sprite.anchor.y;

        if (!this.characterBox) {
            this.characterBox = new Sat.Box(
                new Sat.Vector(gameState.character.sprite.x - anchorOffsetX, gameState.character.sprite.y - anchorOffsetY),
                gameState.character.sprite.width - 6,
                gameState.character.sprite.height
            ).toPolygon();
        }
        this.characterBox.pos.x = gameState.character.sprite.x - anchorOffsetX + gameState.character.vx;
        this.characterBox.pos.y = gameState.character.sprite.y - anchorOffsetY + gameState.character.vy;

        gameState.collision.x = 0;
        gameState.collision.y = 0;
        gameState.collision.collision = false;

        this.collisionObjects.forEach(obj => {
            //处理主角和每个物体的碰撞情况
            obj.v.pos.x = obj.vpx - this.parentPivotX;
            let collision = false;
            if (obj.ellipse) {
                //圆形，椭圆形
                collision = Sat.testPolygonCircle(this.characterBox, obj.v, this.collisionResult);
            } else {
                collision = Sat.testPolygonPolygon(this.characterBox, obj.v, this.collisionResult);
            }
            if (collision) {
                gameState.collision.collision = true;
                //console.log(this.collisionResult.overlapV);
                if (this.collisionResult.overlapN.x != 0 && gameState.collision.x == 0) {
                    gameState.collision.x = this.collisionResult.overlapV.x;
                }
                if (this.collisionResult.overlapN.y != 0 && gameState.collision.y == 0) {
                    gameState.collision.y = this.collisionResult.overlapV.y;
                }
            }
            this.collisionResult.clear();
        });
    }
}
