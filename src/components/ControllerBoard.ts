import type { IComponentOptions } from '@/pitaya';
import { Component } from '@/pitaya';
import { CharacterDirections, JumpType } from '@/constants';

import type { IController, BoardState, BoardStateName } from './types';
import { gameStateService } from '@/services/gameStateService';
// import { debug } from '@/services';

export class ControllerBoard extends Component implements IController {
  name: string;

  boardState: BoardState;
  constructor(options: IComponentOptions) {
    super(options);
    this.name = 'controller-board';
    this.boardState = {
      jump: false,
      arrowRight: false,
      arrowLeft: false,
      jumpTime: 0,
    };
  }

  stateOn(stateName: BoardStateName) {
    this.boardState[stateName] = true;
  }
  stateOff(stateName: BoardStateName) {
    this.boardState[stateName] = false;
  }
  update(delta: number) {
    const gameState = gameStateService.state;
    // 角色死亡了
    if (gameState.character.health <= 0) {
      return;
    }
    const moving = this.boardState.arrowLeft || this.boardState.arrowRight;

    if (this.boardState.arrowLeft) {
      gameStateService.setCharacterDirection(CharacterDirections.Left);
    } else if (this.boardState.arrowRight) {
      gameStateService.setCharacterDirection(CharacterDirections.Right);
    }
    // 是否已经落在地面
    const onTheGround = gameStateService.isOnTheGround();

    if (onTheGround) {
      gameState.character.jumpType = JumpType.Nope;
    }
    if (this.boardState.jump) {
      if (onTheGround) {
        gameStateService.setJumpAction(JumpType.Jump);
        // debug.log('Jump,type=', JumpType.Jump);
      } else if (gameState.character.jumpType !== JumpType.DoubleJump) {
        // 处理二段跳的逻辑,
        gameStateService.setJumpAction(JumpType.DoubleJump);
        // debug.log('Jump,type=', JumpType.DoubleJump);
      }
      this.boardState.jump = false;
    }
    // 顶部碰头
    if (gameStateService.isHitHead()) {
      gameStateService.resetVectorY();
    }

    // 无时无刻不受重力影响
    if (!onTheGround) {
      gameState.character.vy += delta * gameState.world.gravity;
    }

    // X轴上动能
    gameState.character.vx = moving ? gameState.character.direction * gameState.world.moveSpeed : 0;
    gameState.character.moving = moving;
    gameState.character.onTheGround = onTheGround;
    // console.log('=========>', gameState);
  }
  pause() {}
  resume(_args: unknown) {}
}
