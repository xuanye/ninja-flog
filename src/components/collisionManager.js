import PubSub from 'pubsub-js';
import Sat from 'sat';
import { CollisionType } from '../constants';
/**
 * 游戏的碰撞管理器
 */
export class CollisionManager {
    constructor() {
        this.paused = true;
        this.parentPivotX = 0;
        this.collisionObjects = [];
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
        console.log(Sat);
        this.paused = false;
    }

    addObjects(obj) {
        obj.getGlobalPosition = () => {
            return { x: this.parentPivotX + obj.x, y: obj.y };
        };
        obj.circular = obj.diameter = obj.ellipse;
        obj.parent = this;
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
        this.collisionObjects.forEach(obj => {
            //处理主角和每个物体的碰撞情况
            //console.log(collision);
        });
    }
}
