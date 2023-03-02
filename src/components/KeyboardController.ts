import type { IComponentOptions } from '@/pitaya';
import { ControllerBoard } from './ControllerBoard';
import type { BoardStateName } from './types';
import { EnumBoardState } from './types';

type KeyCode = 'Space' | 'ArrowRight' | 'ArrowLeft' | 'ArrowUp';
export class KeyboardController extends ControllerBoard {
  codeStateMap: Record<KeyCode, BoardStateName>;
  keyUpHandler?: (e: KeyboardEvent) => void;
  keyDownHandler?: (e: KeyboardEvent) => void;
  constructor(options: IComponentOptions) {
    super(options);
    this.codeStateMap = {
      Space: EnumBoardState.Jump,
      ArrowLeft: EnumBoardState.ArrowLeft,
      ArrowRight: EnumBoardState.ArrowRight,
      ArrowUp: EnumBoardState.Jump,
    };
  }

  create(): void {}

  /**
   * 场景挂起时取消事件注册
   */
  pause() {
    if (this.keyUpHandler) {
      document.removeEventListener('keyup', this.keyUpHandler);
      this.keyUpHandler = undefined;
    }
    if (this.keyDownHandler) {
      document.removeEventListener('keydown', this.keyDownHandler);
      this.keyDownHandler = undefined;
    }
  }
  onKeyUp(e: KeyboardEvent) {
    if (this.codeStateMap[e.code as KeyCode]) {
      this.boardState[this.codeStateMap[e.code as KeyCode]] = false;
    }
  }
  onKeyDown(e: KeyboardEvent) {
    if (this.codeStateMap[e.code as KeyCode]) {
      this.boardState[this.codeStateMap[e.code as KeyCode]] = true;
    }
  }
  /**
   * 场景恢复时，重新注册事件
   */
  resume() {
    this.keyUpHandler = this.onKeyUp.bind(this);
    this.keyDownHandler = this.onKeyDown.bind(this);
    document.addEventListener('keyup', this.keyUpHandler);
    document.addEventListener('keydown', this.keyDownHandler);
  }
}
