import Sat from 'Sat';
import PubSub from 'pubsub-js';
import { EventNames, AwardNames, AwardSize } from '../constants';
export class AwardProps {
    constructor(state, spritePool) {
        this.state = state;
        //console.log('AwardProps -> constructor -> state', state);
        this.state.awardType = this.state.awardType || AwardNames.MonedaD;
        this.sprite = null;
        this.pool = spritePool;
        this.v = new Sat.Circle(new Sat.Vector(state.x + AwardSize.Width / 2, state.y + AwardSize.Height / 2), AwardSize.Width / 2);
        this.collisionResult = new Sat.Response();
        this.vpx = state.x + state.width / 2;
    }

    publish(...args) {
        PubSub.publish(...args);
    }
    create() {}
    checkCollision(gameState) {
        if (!this.sprite) {
            return;
        }
        let parentPivotX = gameState.world.pivotX;

        this.v.pos.x = this.vpx - parentPivotX;
        let isHit = Sat.testPolygonCircle(gameState.characterBox, this.v, this.collisionResult);
        if (isHit) {
            this.state.collision = true;
            this.publish(EventNames.Award, this.state, this.gameState);
            //console.log('碰上小苹果了');
        }
    }
    clearCollected() {
        if (this.collectSprite && this.collectSprite.parent) {
            this.collectSprite.parent.removeChild(this.sprite);
            this.pool.return(this.collectSprite, AwardNames.Collected);
            this.collectSprite = null;
            this.state.collecting = false;
            this.state.collected = true;
        }
    }
    reset() {
        this.state.collecting = false;
        this.state.collected = false;
        this.state.collision = false;
        if (this.sprite != null && this.sprite.parent) {
            this.sprite.parent.removeChild(this.sprite);
            this.pool.return(this.sprite, this.state.awardType);
        }
        this.sprite = null;
    }
    clear(parent) {
        if (this.sprite != null) {
            let x = this.sprite.x;
            let y = this.sprite.y;
            parent.removeChild(this.sprite);
            this.pool.return(this.sprite, this.state.awardType);
            this.sprite = null;
            /**/
            this.state.collecting = true;
            //播放一个动画
            this.collectSprite = this.pool.get(AwardNames.Collected);
            this.collectSprite.loop = false;
            this.collectSprite.x = x;
            this.collectSprite.y = y;
            this.collectSprite.onComplete = this.clearCollected.bind(this);
            this.collectSprite.gotoAndPlay(0);
            parent.addChild(this.collectSprite);
        }
    }
    update(delta, gameState, parent) {
        //该道具已经被收集
        if (this.state.collected) {
            return true;
        }
        //正在播放手机动画
        if (this.state.collecting) {
            if (this.collectSprite != null) {
                this.collectSprite.x = this.state.x - gameState.world.pivotX;
                this.collectSprite.y = this.state.y;
            }
            return false;
        }
        //刚刚碰撞
        if (this.state.collision) {
            this.clear(parent);
            return false;
        }

        //判断当前位置是否在屏幕内
        let rx = this.state.x - gameState.world.pivotX;
        if (rx > -50 && rx < gameState.world.screenWidth + 50) {
            if (this.checkCollision(gameState)) {
                return false;
            }
            if (this.sprite == null) {
                //console.log('创建apple奖励');
                this.sprite = this.pool.get(this.state.awardType);
                if (this.sprite == null) {
                    console.warn('没有空余的了？');
                    return false;
                }
                this.sprite.play();
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
