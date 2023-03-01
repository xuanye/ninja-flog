import type { GameState } from '@/constants';
import { WorldStatus } from '@/constants';
import { CharacterMode, EventNames, CollisionThreshold, JumpType } from '@/constants';
import type { AnimateStates } from '@/pitaya';
import { StatesAnimatedSprite, eventService } from '@/pitaya';
import type { EventHandler } from '@/pitaya';

interface Vector {
  vx: number;
  vy: number;
}
export class Character extends StatesAnimatedSprite {
  modeNames: string[];
  mode = CharacterMode.Idle;
  characterName?: string;
  constructor(baseTextureName: string, states: AnimateStates, gameState: GameState) {
    const modeNames: string[] = [];
    Object.keys(states).forEach((name) => {
      modeNames.push(name);
    });
    super(baseTextureName, states, modeNames[gameState.character.mode]);

    this.modeNames = modeNames;
    this.init(gameState);
  }
  init(gameState: GameState) {
    this.x = gameState.character.x;
    this.y = gameState.character.y;
    // console.log('Character -> init -> initGameState', initGameState);
    this.animationSpeed = 0.3;
    this.playStateIndex(gameState.character.mode);

    /*
        let g = new Graphics();
        g.lineStyle(2, 0x00aabb);
        g.drawRect(0, 0, initGameState.character.area[0], initGameState.character.area[1]);

        this.addChild(g);
        */
    // this.createParticle();
  }

  playStateIndex(state: number) {
    let name = this.modeNames[state];
    // console.log('Character -> playStateIndex -> this.modeNames', this.modeNames);
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
  _update(_: number, gameState: GameState) {
    if (!this.checkWorldStatus(gameState)) {
      return;
    }
    const { vx, vy } = this.getVector(gameState);

    let { character, collision, world } = gameState;

    character.moving = true;
    this.y += vy;

    if (this.x <= 0) {
      character.health = 0;
    } else if (world.isEndPart) {
      this.x += gameState.world.moveSpeed;
      if (this.x > world.screenWidth - 80) {
        this.x = world.screenWidth - 80;
        character.moving = false;
        world.status = WorldStatus.ArrivalTerminal;
      }
    } else {
      this.x += vx;
    }

    // 设置角色状态
    if (character.jumpType === JumpType.DoubleJump) {
      character.mode = CharacterMode.DoubleJump;
    } else if (character.jumpType === JumpType.Jump) {
      character.mode = CharacterMode.Jump;
    } else if (character.jumpType === JumpType.Slide) {
      // 蹲
      character.mode = CharacterMode.Slide;
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
    let { character, collision, world } = gameState;

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
    return true;
  }
  private getVector(gameState: GameState): Vector {
    let { character, collision } = gameState;
    character.moving = character.vx > 0;
    let vx = 0;
    let vy = 0;

    // 碰撞补偿
    if (collision.collision) {
      // 碰撞设置了一个阈值
      if (collision.x !== 0 && collision.x > CollisionThreshold.x) {
        if (collision.y > 0 && collision.y < CollisionThreshold.y) {
          vx = this.x < character.startX ? 2 : 0;
        } else {
          vx = character.vx - collision.x;
        }
      } else {
        vx = this.x < character.startX ? 2 : 0;
      }

      vy = character.vy - collision.y;
      vx = vx > 0 ? Math.floor(vx) : Math.ceil(vx);
      vy = vy < 0 ? Math.floor(vy) : Math.ceil(vy);
    } else {
      vx = 0;
      vy = character.vy;
    }
    return { vx, vy };
  }
}
