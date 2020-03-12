import Sat from 'Sat';
import PubSub from 'pubsub-js';
import { EventNames, EnemyInfos, EnemyState, CharacterMode } from '../constants';
import anime from 'animejs';

export class Enemy {
    constructor(state, pool) {
        this.state = state;

        this.state.enemyType = this.state.enemyType || Object.keys(EnemyInfos)[0];
        this.sprite = null;
        this.pool = pool;
        this.instance = EnemyInfos[this.state.enemyType];

        this.state.enemyState = this.instance.initState;
        this.v = new Sat.Box(new Sat.Vector(state.x, state.y), this.instance.width * 0.8, this.instance.height * 0.8).toPolygon();
        //console.log(new Sat.Box(state.x, state.y, this.instance.width, this.instance.height));
        this.collisionResult = new Sat.Response();
        this.vpx = state.x;
    }
    subscribe(...args) {
        PubSub.subscribe(...args);
    }
    publish(...args) {
        PubSub.publish(...args);
    }
    checkCollision(gameState) {
        let parentPivotX = gameState.world.pivotX;
        this.v.pos.x = this.vpx - parentPivotX;
        let isHit = Sat.testPolygonPolygon(gameState.characterBox, this.v, this.collisionResult);
        if (isHit) {
            let overlap = this.collisionResult.overlapV;
            if (overlap.x == 0 && overlap.y > 0) {
                gameState.character.vy = gameState.world.gravity; //碰撞后重置加速度
                this.publish(EventNames.HitEnemy, this.state, this.gameState);
            } else {
                gameState.character.health -= 1;
                gameState.character.invincible = true;
                gameState.character.mode = CharacterMode.Hit;
                this.publish(EventNames.BeHit, this.state, this.gameState);
            }
            this.state.collision = true;

            //console.log('碰上小苹果了');
            this.collisionResult.clear();
        }
    }
    clearCollected() {
        if (this.sprite && this.sprite.parent) {
            this.sprite.parent.removeChild(this.sprite);
            this.pool.return(this.sprite, this.state.enemyType);
            this.sprite = null;
        }
        this.state.collecting = false;
        this.state.collected = true;
    }
    clear(parent) {
        if (this.sprite != null) {
            let x = this.sprite.x;
            let y = this.sprite.y;
            //parent.removeChild(this.sprite);
            this.state.collecting = true;
            //this.sprite.loop = true;
            //this.sprite.playAnimation(this.instance.states[EnemyState.Hit]);
            //this.sprite.gotoAndPlay(0);
            this.sprite.anchor.set(0.5, 0.5);
            this.sprite.x += this.sprite.width * 0.5;
            this.sprite.y += this.sprite.height * 0.7;
            anime({
                targets: this.sprite,
                x: this.sprite.x + 50,
                y: this.sprite.y + 150,
                rotation: {
                    value: 2 * Math.PI,
                    duration: 300,
                    delay: 200,
                },
                easing: 'easeInQuint',
                duration: 600,
                complete: this.clearCollected.bind(this),
            });
        }
    }
    update(_, gameState, parent) {
        //该怪物已经被收集
        if (this.state.collected) {
            return true;
        }
        if (this.state.collecting) {
            return false;
        }
        //正在播放手机动画, 任务无敌状态不和怪物碰撞
        if (gameState.character.invincible) {
            if (this.sprite != null) {
                this.sprite.x = this.state.x - gameState.world.pivotX;
                this.sprite.y = this.state.y;
            }
            return false;
        }
        //刚刚碰撞
        if (this.state.collision) {
            this.clear(parent);
            return false;
        }

        let rx = this.state.x - gameState.world.pivotX;
        if (rx > -50 && rx < gameState.world.screenWidth + 50) {
            if (this.checkCollision(gameState)) {
                return false;
            }
            if (this.sprite == null) {
                //console.log('创建怪物');
                this.sprite = this.pool.get(this.state.enemyType);
                this.sprite.scale.set(0.8, 0.8);
                if (this.sprite == null) {
                    return false;
                }
                //处理状态播放状态
                this.sprite.playAnimation(this.instance.states[this.state.enemyState]);
                parent.addChild(this.sprite);
            }
            this.sprite.x = this.state.x - gameState.world.pivotX;
            this.sprite.y = this.state.y;
        } else {
            this.clear(parent);
        }
        return false;
    }
}
