import Sat from 'sat';
import type { GameState } from '@/constants';
import { EventNames, AwardNames, AwardInfos } from '@/constants';
import type { AwardObjectType } from './types';
import type { AwardSpritePool } from './AwardSpritePool';
import type { AwardSprite } from './AwardSprite';
import { eventService } from '@/pitaya';
import type { Container } from 'pixi.js';
import { gameStateService } from '@/services/gameStateService';
import { debug } from '@/services';

export class AwardProp {
  state: AwardObjectType;
  pool: AwardSpritePool;
  sprite: AwardSprite | null;
  co: Sat.Circle;
  collisionResult: Sat.Response;
  realX: number;
  collectSprite?: AwardSprite | null;
  collision = false;
  collecting = false;
  collected = false;

  constructor(state: AwardObjectType, spritePool: AwardSpritePool) {
    this.state = state;
    // console.log('AwardProps -> constructor -> state', state);
    this.state.awardType = this.state.awardType || AwardNames.MonedaD;
    this.sprite = null;
    this.pool = spritePool;

    const award = AwardInfos[this.state.awardType];
    this.co = new Sat.Circle(
      new Sat.Vector(state.x + award.width / 2, state.y + award.height / 2),
      award.width / 2
    );
    this.collisionResult = new Sat.Response();
    this.realX = state.x + state.width / 2;
  }

  publish(eventName: string, args?: unknown) {
    eventService.publish(eventName, args);
  }
  create() {}
  checkCollision(gameState: GameState) {
    if (!this.sprite) {
      return false;
    }
    let parentPivotX = gameState.world.pivotX;

    this.co.pos.x = this.realX - parentPivotX;
    let isHit = Sat.testPolygonCircle(gameState.character.box, this.co, this.collisionResult);
    if (isHit) {
      this.collision = true;
      this.publish(EventNames.Award, this.sprite.data);
      // console.log('碰上小苹果了');
    }
    return isHit;
  }
  clearCollected() {
    if (this.collectSprite?.parent) {
      this.collectSprite.parent.removeChild(this.collectSprite);
      this.pool.return(this.collectSprite, AwardNames.Collected);
      this.collectSprite = null;
      this.collecting = false;
      this.collected = true;
    }
  }
  reset() {
    this.collecting = false;
    this.collected = false;
    this.collision = false;

    if (this.sprite?.parent) {
      this.sprite.parent.removeChild(this.sprite);
      this.pool.return(this.sprite, this.state.awardType);
    }
    this.sprite = null;
  }
  clear(parent: Container) {
    if (this.sprite) {
      let x = this.sprite.x;
      let y = this.sprite.y;
      parent.removeChild(this.sprite);
      this.pool.return(this.sprite, this.state.awardType);
      this.sprite = null;
      /**/
      this.collecting = true;
      // 播放一个动画
      this.collectSprite = this.pool.get(AwardNames.Collected);
      this.collectSprite.loop = false;
      this.collectSprite.x = x;
      this.collectSprite.y = y;
      this.collectSprite.onComplete = this.clearCollected.bind(this);
      this.collectSprite.gotoAndPlay(0);
      parent.addChild(this.collectSprite);
    }
  }
  update(_delta: number, parent: Container) {
    const gameState = gameStateService.state;

    // 该道具已经被收集
    if (this.collected) {
      return true;
    }
    // 正在播放手机动画
    if (this.collecting) {
      if (this.collectSprite) {
        this.collectSprite.x = this.state.x - gameState.world.pivotX;
        this.collectSprite.y = this.state.y;
      }
      return false;
    }
    // 刚刚碰撞
    if (this.collision) {
      this.clear(parent);
      return false;
    }

    // 判断当前位置是否在屏幕内
    const rx = this.state.x - gameState.world.pivotX;

    if (rx > -50 && rx < gameState.world.screenWidth + 50) {
      if (this.checkCollision(gameState)) {
        return false;
      }
      if (!this.sprite) {
        this.sprite = this.pool.get(this.state.awardType);
        if (!this.sprite) {
          debug.warn('没有空余的了？');
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
