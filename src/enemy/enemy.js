import Sat from 'Sat';
import PubSub from 'pubsub-js';
import { EventNames, EnemyInfos, CharacterMode } from '../constants';
import anime from 'animejs';
import utils from '../utils';

export class Enemy {
    constructor(state, pool) {
        this.state = state;

        this.state.enemyType = this.state.enemyType || Object.keys(EnemyInfos)[0];
        this.sprite = null;
        this.pool = pool;
        this.instance = EnemyInfos[this.state.enemyType];

        this.state.enemyState = this.instance.initState;
        this.v = new Sat.Box(new Sat.Vector(state.x, state.y), this.instance.width * 0.9, this.instance.height * 0.8).toPolygon();
        //console.log(new Sat.Box(state.x, state.y, this.instance.width, this.instance.height));
        this.state.offsetX = this.state.width;
        this.state.vx = 0;
        this.state.step = utils.randomFloat(0.3, 0.8);
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
        if (!this.sprite || this.state.collision || gameState.character.invincible) {
            return;
        }
        this.v.pos.x = this.sprite.x - this.instance.width / 2;
        let isHit = Sat.testPolygonPolygon(gameState.characterBox, this.v, this.collisionResult);
        if (isHit) {
            let overlap = this.collisionResult.overlapV;
            /* //不设置从上部碰撞就可以踩死怪物
            if (overlap.x == 0 && overlap.x == 0 && overlap.y > 0) {
                //console.log('Enemy -> checkCollision -> overlap', overlap);
                gameState.character.vy = gameState.world.gravity; //碰撞后重置加速度
                this.publish(EventNames.HitEnemy, this.state, this.gameState);
                this.state.collision = true;
            } else*/ {
                gameState.character.health -= 1;
                //console.log('Enemy -> checkCollision ->  gameState.character.health', gameState.character.health);
                gameState.character.invincible = true;
                gameState.character.mode = CharacterMode.Hit;
                this.publish(EventNames.BeHit, this.state, this.gameState);
            }

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
    clear() {
        if (this.sprite != null) {
            //parent.removeChild(this.sprite);
            if (this.state.collision) {
                this.state.collecting = true;
                //console.log(this.sprite.x, this.state.x);
                anime({
                    targets: this.sprite,
                    x: this.sprite.x + 50,
                    y: this.sprite.y + 150,
                    rotation: 2 * Math.PI,
                    //easing: 'easeInQuint',
                    duration: 8000,
                    complete: this.clearCollected.bind(this),
                });
            } else {
                this.sprite.parent.removeChild(this.sprite);
                this.pool.return(this.sprite, this.state.enemyType);
                this.sprite = null;
            }
        }
    }
    update(_, gameState, parent) {
        //该怪物已经被收集
        if (this.state.collected) {
            return true;
        }
        //正在播放手机动画,
        if (this.state.collecting) {
            return false;
        }
        //人物无敌状态不和怪物碰撞
        if (this.state.collision) {
            if (this.sprite != null) {
                this.sprite.x = this.state.x - gameState.world.pivotX + this.state.vx;
            }
            setTimeout(() => {
                this.clear(parent);
            });
            return false;
        }

        let rx = this.state.x - gameState.world.pivotX;
        if (rx > -this.state.offsetX - 50 && rx < gameState.world.screenWidth + this.state.offsetX + 50) {
            if (this.checkCollision(gameState)) {
                return false;
            }
            if (this.sprite == null) {
                //console.log('创建怪物');
                this.sprite = this.pool.get(this.state.enemyType);
                this.sprite.y = this.state.y + this.instance.height * 0.5;
                this.sprite.anchor.set(0.5, 0.5);
                this.sprite.scale.set(-0.8, 0.8);
                if (this.sprite == null) {
                    return false;
                }
                //处理状态播放状态
                this.sprite.playAnimation(this.instance.states[1]);
                parent.addChild(this.sprite);
            }

            this.sprite.x = this.state.x - gameState.world.pivotX + this.state.vx;
            this.state.vx += this.state.step;
            if (this.state.vx >= this.state.offsetX) {
                this.state.step *= -1;
                this.sprite.scale.x = 0.8;
            } else if (this.state.vx <= 0) {
                this.state.step *= -1;
                this.sprite.scale.x = -0.8;
            }
        } else {
            this.clear(parent);
        }
        return false;
    }
}
