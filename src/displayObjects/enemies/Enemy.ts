import Sat from 'sat';
import { eventService } from '@/pitaya';
import type { EnemyOptions, GameState } from '@/constants';
import { EnumEnemyState } from '@/constants';
import { EventNames, EnemyInfos, EnemyNames } from '@/constants';
import type { EnemyObjectType } from './types';
import type { EnemySpritePool } from './EnemySpritePool';
import type { EnemySprite } from './EnemySprite';
import utils from '@/modules/utils';
import type { Container } from 'pixi.js';
import { gameStateService } from '@/services/gameStateService';
// import anime from 'animejs';

export class Enemy {
  state: EnemyObjectType;
  pool: EnemySpritePool;
  sprite: EnemySprite | null;
  co: Sat.Polygon;
  offsetX: number;
  collisionResult: Sat.Response;
  step: number;
  realX: number;
  enemyOptions: EnemyOptions;
  collision = false;
  vx = 0;
  collecting = false;
  collected = false;

  constructor(state: EnemyObjectType, pool: EnemySpritePool) {
    this.state = state;

    this.state.enemyType = this.state.enemyType || EnemyNames.AngryPig;
    this.sprite = null;
    this.pool = pool;

    const enemy = EnemyInfos[this.state.enemyType];
    this.enemyOptions = enemy;
    this.co = new Sat.Box(
      new Sat.Vector(state.x, state.y),
      enemy.width * 0.9,
      enemy.height * 0.8
    ).toPolygon();

    this.offsetX = this.state.width;
    this.vx = 0;
    this.step = utils.randomFloat(0.3, 0.8);
    this.collisionResult = new Sat.Response();
    this.realX = state.x;
  }
  publish(eventName: string, args?: unknown) {
    eventService.publish(eventName, args);
  }
  checkCollision(gameState: GameState) {
    if (!this.sprite || this.collision || gameState.character.invincible) {
      return false;
    }
    this.co.pos.x = this.sprite.x - this.enemyOptions.width / 2;
    const isHit = Sat.testPolygonPolygon(gameState.character.box, this.co, this.collisionResult);
    if (isHit && (this.collisionResult.overlapV.x !== 0 || this.collisionResult.overlapV.y !== 0)) {
      /* const overlap = this.collisionResult.overlapV;
      //不设置从上部碰撞就可以踩死怪物
            if (overlap.x == 0 && overlap.x == 0 && overlap.y > 0) {
                //console.log('Enemy -> checkCollision -> overlap', overlap);
                gameState.character.vy = gameState.world.gravity; //碰撞后重置加速度
                this.publish(EventNames.HitEnemy, this.state, this.gameState);
                this.state.collision = true;
            } else {

      } */
      gameStateService.setCharacterHit();
      this.publish(EventNames.BeHit, this.state);
      this.collisionResult.clear();
    }
    return isHit;
  }
  clearCollected() {
    if (this.sprite?.parent) {
      this.sprite.parent.removeChild(this.sprite);
      this.pool.return(this.sprite, this.state.enemyType);
      this.sprite = null;
    }
    this.collecting = false;
    this.collected = true;
  }
  clear() {
    if (this.sprite) {
      // parent.removeChild(this.sprite);
      if (this.collision) {
        this.collecting = true;
        // console.log(this.sprite.x, this.state.x);
        this.checkCollision(gameStateService.state);
        /*
        anime({
          targets: this.sprite,
          x: this.sprite.x + 50,
          y: this.sprite.y + 150,
          rotation: 2 * Math.PI,
          // easing: 'easeInQuint',
          duration: 8000,
          complete: this.clearCollected.bind(this),
        });
        */
      } else {
        this.sprite.parent.removeChild(this.sprite);
        this.pool.return(this.sprite, this.state.enemyType);
        this.sprite = null;
      }
    }
  }
  update(_: number, parent: Container) {
    // 该怪物已经被收集
    if (this.collected) {
      return true;
    }
    // 正在播放手机动画,
    if (this.collecting) {
      return false;
    }
    const gameState = gameStateService.state;

    // 人物无敌状态不和怪物碰撞
    if (this.collision) {
      if (this.sprite) {
        this.sprite.x = this.state.x - gameState.world.pivotX + this.vx;
      }
      setTimeout(() => {
        this.clear();
      });
      return false;
    }

    let rx = this.state.x - gameState.world.pivotX;
    if (rx > -this.offsetX - 50 && rx < gameState.world.screenWidth + this.offsetX + 50) {
      if (this.checkCollision(gameState)) {
        return false;
      }
      if (!this.sprite) {
        this.sprite = this.pool.get(this.state.enemyType);
        this.sprite.y = this.state.y + this.enemyOptions.height * 0.5;
        this.sprite.anchor.set(0.5, 0.5);
        this.sprite.scale.set(-0.8, 0.8);
        if (!this.sprite) {
          return false;
        }

        // 处理状态播放状态
        this.sprite.playState(EnumEnemyState.Run);
        parent.addChild(this.sprite);
      }

      this.sprite.x = this.state.x - gameState.world.pivotX + this.vx;
      this.vx += this.step;
      if (this.vx >= this.offsetX) {
        this.step *= -1;
        this.sprite.scale.x = 0.8;
      } else if (this.vx <= 0) {
        this.step *= -1;
        this.sprite.scale.x = -0.8;
      }
    } else {
      this.clear();
    }
    return false;
  }
}
