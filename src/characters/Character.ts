import type { GameState } from '@/constants';
import { CharacterDirections } from '@/constants';
import { WorldStatus } from '@/constants';
import { CharacterMode, EventNames, JumpType } from '@/constants';
import type { AnimateStates } from '@/pitaya';
import { StatesAnimatedSprite, eventService } from '@/pitaya';
import type { EventHandler } from '@/pitaya';
import type { CharacterState } from './types';
import { gameStateService } from '@/services/gameStateService';
import { debug } from '@/services';
// import { Graphics } from 'pixi.js';

interface Vector {
  vx: number;
  vy: number;
}
export class Character extends StatesAnimatedSprite {
  modeNames: string[];
  mode = CharacterMode.Idle;
  direction = CharacterDirections.None;
  characterName = '';
  constructor(baseTextureName: string, states: AnimateStates, state: CharacterState) {
    const modeNames: string[] = [];
    Object.keys(states).forEach((name) => {
      modeNames.push(name);
    });

    super(baseTextureName, states, state.mode);

    this.modeNames = modeNames;
    this.init(state);
  }
  init(state: CharacterState) {
    this.anchor.set(0.5, 0.5);
    this.x = state.startX;
    this.y = state.startY;
    // console.log('Character -> init -> initGameState', initGameState);
    this.animationSpeed = 0.15;
    this.playState(state.mode);

    /*

    const area = gameStateService.state.character.effectiveArea;
    let g = new Graphics();
    g.lineStyle(2, 0x00aabb);
    g.drawRect(area[0], area[1], area[2], area[3]);

    this.addChild(g);

    */

    // this.createParticle();
  }

  playStateIndex(modeIndex: number) {
    const name = this.modeNames[modeIndex];

    this.playState(name);
  }
  playDeadState(gameState: GameState) {
    this.playStateIndex(CharacterMode.Hit);
    setTimeout(() => {
      this.visible = false;
    }, 1000);
    this.publish(EventNames.HeroDied, gameState);
  }

  // ---------------------
  // 发布/订阅模式的简单封装
  // ---------------------
  subscribe(eventName: string, handler: EventHandler<unknown>) {
    // TODO:订阅事件
    eventService.subscribe(eventName, handler);
  }
  publish(eventName: string, args?: unknown) {
    return eventService.publish(eventName, args);
  }
  unsubscribe(eventName: string, handler: EventHandler<unknown>) {
    return eventService.unsubscribe(eventName, handler);
  }

  /**
   * AnimatedSprite 中已经有了update方法所以这里只能改名了
   * @param {*} _
   * @param {*} gameState
   */
  _update(_: number) {
    const gameState = gameStateService.state;

    if (!this.checkWorldStatus(gameState)) {
      debug.log('check world status fail');
      return;
    }

    const { vx, vy } = this.getVector(gameState);

    const { collision, character, world } = gameState;
    this.y += vy;

    if (vx > 0) {
      if (this.x + vx > 200) {
        world.pivotOffsetX = this.x + vx - 201; // 201 是用于修正碰撞
        // 场景尽头
        if (world.pivotX + world.pivotOffsetX + world.screenWidth > world.width) {
          world.pivotOffsetX = world.width - world.screenWidth - world.pivotX;
        }
        this.x += vx - world.pivotOffsetX;
      } else {
        this.x += vx;
      }
    } else if (vx < 0) {
      if (this.x + vx < 200) {
        world.pivotOffsetX = vx;
        if (world.pivotOffsetX + world.pivotX <= 0) {
          world.pivotOffsetX = 0 - world.pivotX;
          this.x += vx - world.pivotOffsetX;
        }
      } else {
        this.x += vx;
      }
    } else {
      world.pivotOffsetX = 0;
    }

    if (this.x + this.width >= world.screenWidth) {
      this.x = world.screenWidth - this.width;
    }
    if (this.x < 0) {
      this.x = 0;
    }
    if (this.direction !== character.direction) {
      this.direction = character.direction;
      this.scale.x = character.direction ? Number(character.direction) : 1;
    }

    // 设置角色状态
    if (character.jumpType === JumpType.DoubleJump) {
      character.mode = CharacterMode.DoubleJump;
    } else if (character.jumpType === JumpType.Jump) {
      character.mode = CharacterMode.Jump;
    } else if (!character.onTheGround && collision.y > 1) {
      character.mode = CharacterMode.Fall;
    } else if (character.moving) {
      character.mode = CharacterMode.Run;
    } else {
      character.mode = CharacterMode.Idle;
    }

    if (this.mode !== character.mode) {
      this.mode = character.mode;
      this.playStateIndex(this.mode);
    }

    if (this.y > world.screenHeight) {
      character.health = 0;
    }

    character.x = this.x;
    character.y = this.y;
  }
  private checkWorldStatus(gameState: GameState) {
    const { character, collision, world } = gameState;

    if (!character || !collision) {
      return false;
    }
    if (world.status === WorldStatus.ArrivalTerminal) {
      this.publish(EventNames.ArrivalTerminal, gameState);
      world.status = WorldStatus.End;
    }
    if (character.isDead || world.status === WorldStatus.End) {
      return false;
    }
    if (character.health <= 0) {
      world.pivotOffsetX = 0;
      character.isDead = true;
      this.playDeadState(gameState);
      return false;
    }
    return true;
  }
  private getVector(gameState: GameState): Vector {
    const { collision, character } = gameState;

    let vx = 0;
    let vy = 0;
    if (collision.collision) {
      vx = character.vx - collision.x;
      vy = character.vy - collision.y;

      vx = vx > 0 ? Math.floor(vx) : Math.ceil(vx);
      vy = vy > 0 ? Math.floor(vy) : Math.ceil(vy);

      if (vx !== 0) {
        // console.log('update -> vx', collision, vx);
        // this.x += vx;
      }
      if (vy !== 0) {
        // console.log('update ->vy', vy);
        // this.y += vy;
      }
    } else {
      // console.log('===>', character.vx, character.vy);
      vx = character.vx;
      vy = character.vy;
      // this.x += character.vx;
      // this.y += character.vy;
    }

    return { vx, vy };
  }
}
