import { Sprite } from 'pixi.js';
import type { IComponentOptions, ResizeOptions } from '@/pitaya';
import { ControllerBoard } from './ControllerBoard';
import { TextureNames } from '@/constants';
import { EnumBoardState } from './types';

export class ButtonController extends ControllerBoard {
  leftBtn?: Sprite;
  rightBtn?: Sprite;
  upBtn?: Sprite;
  constructor(options: IComponentOptions) {
    super(options);
    this.name = 'button-controller';
  }
  create() {
    // console.log('ControllerBoard -> create -> TextureNames.Controller.left', TextureNames.Controller.Left);
    this.leftBtn = Sprite.from(TextureNames.Controller.Left);
    // this.leftBtn.scale.set(0.5, 0.5);
    this.leftBtn.x = 50;
    this.leftBtn.y = this.state.screenHeight - this.leftBtn.height - 20;
    this.rightBtn = Sprite.from(TextureNames.Controller.Right);
    // this.rightBtn.scale.set(0.5, 0.5);
    this.rightBtn.x = this.leftBtn.x + this.leftBtn.width + 20;
    this.rightBtn.y = this.leftBtn.y;
    this.upBtn = Sprite.from(TextureNames.Controller.Up);
    // this.upBtn.scale.set(0.5, 0.5);
    this.upBtn.y = this.leftBtn.y - 30;
    this.upBtn.x = this.state.screenWidth - this.upBtn.width - 50;

    this.leftBtn.alpha = 0.6;
    this.rightBtn.alpha = 0.6;
    this.upBtn.alpha = 0.6;
    this.leftBtn.interactive = true;
    this.leftBtn.buttonMode = true;
    this.rightBtn.interactive = true;
    this.rightBtn.buttonMode = true;
    this.upBtn.interactive = true;
    this.upBtn.buttonMode = true;

    this.leftBtn.on('pointerdown', this.stateOn.bind(this, EnumBoardState.ArrowLeft));
    this.leftBtn.on('pointerup', this.stateOff.bind(this, EnumBoardState.ArrowLeft));
    this.leftBtn.on('pointerout', this.stateOff.bind(this, EnumBoardState.ArrowLeft));
    this.leftBtn.on('pointerupoutside', this.stateOff.bind(this, EnumBoardState.ArrowLeft));

    this.rightBtn.on('pointerdown', this.stateOn.bind(this, EnumBoardState.ArrowRight));
    this.rightBtn.on('pointerup', this.stateOff.bind(this, EnumBoardState.ArrowRight));
    this.rightBtn.on('pointerout', this.stateOff.bind(this, EnumBoardState.ArrowRight));
    this.rightBtn.on('pointerupoutside', this.stateOff.bind(this, EnumBoardState.ArrowRight));

    this.upBtn.on('pointertap', this.stateOn.bind(this, EnumBoardState.Jump));

    this.addChild(this.leftBtn, this.rightBtn, this.upBtn);
  }

  /**
   * 场景挂起时取消事件注册
   */
  pause() {}

  /**
   * 场景恢复时，重新注册事件
   */
  resume() {}
  onResize({ realWidth, realHeight }: ResizeOptions) {
    if (this.leftBtn && this.rightBtn && this.upBtn) {
      this.leftBtn.x = 50;
      this.leftBtn.y = realHeight - this.leftBtn.height - 20;
      this.rightBtn.x = this.leftBtn.x + this.leftBtn.width + 20;
      this.rightBtn.y = this.leftBtn.y;
      this.upBtn.y = this.leftBtn.y - 30;
      this.upBtn.x = realWidth - this.upBtn.width - 50;
    }
  }
}
