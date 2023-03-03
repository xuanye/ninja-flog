import { utils } from 'pixi.js';

import { Application } from '@/pitaya';
import scenes from './scenes';
import { stateMachineService, StateNames } from '@/services/stateMachineService';

import type { IApplicationOptions } from '@/pitaya';
import { debug } from './modules/debug';
import { Assets, EventNames } from './constants';

export class App extends Application {
  constructor(options: IApplicationOptions) {
    super(options);

    document.body.appendChild(this.view);

    if (utils.isMobile.any) {
      this.detectOrient();
    } else {
      this.view.setAttribute('width', options.width + 'px');
      this.view.setAttribute('height', options.height + 'px');
    }

    /*
    if (import.meta.env.DEV) {
      import('stats.js').then(({ default: Stats }) => {
        const stats = new Stats();
        stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild(stats.dom);
      });
    }
    */

    /*
    this.sound = new Howl({
      src: [Assets.audios[0].url],
      preload: true,
      autoplay: true,
      loop: true,
      volume: 0.5,
    });
    */
  }

  load() {
    debug.log('Application starting');
    this.doLoad();
    debug.log('Application started');
  }

  protected init() {
    super.init();
    // 注册场景
    this.addScenes(scenes);

    stateMachineService.subscribe(this.onTransition.bind(this));

    this.subscribe(EventNames.LoadCompleted, () => {
      stateMachineService.send(StateNames.CHOOSE);
      // stateMachineService.send(StateNames.PALY);
    });

    // 选中角色后，去游戏场景
    this.subscribe(EventNames.ChooseCharacter, () => {
      stateMachineService.send(StateNames.PALY);
    });

    this.subscribe(EventNames.ToMenu, () => {
      stateMachineService.send(StateNames.MENU);
    });
    debug.log('Application initialization completed');
  }

  private doLoad() {
    debug.log('Assets loading');
    this.loader.add(Assets.loading);
    this.loader.load(() => {
      debug.log('Assets load completed');
      // 跳转到Load界面
      stateMachineService.send(StateNames.LOAD);
    });
  }

  private detectOrient() {}

  // ------------------------
  // 状态机的事件
  // -----------------------
  private onTransition(state: { value: string }) {
    if (state.value !== StateNames.NONE) {
      debug.log(`状态机事件:${state.value}`);

      this.startScene(state.value);
    }
  }
}
