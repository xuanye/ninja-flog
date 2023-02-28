import { utils } from 'pixi.js';

import { Application } from '@/pitaya';
import scenes from './scenes';
import { stateService, StateNames } from '@/services/stateService';

import type { IApplicationOptions } from '@/pitaya';
import { debug } from './services/debug';
import { Assets, EventNames } from './constants';
import { ChooseScene } from './scenes/ChooseScene';

export class App extends Application {
  constructor(options: IApplicationOptions) {
    super(options);

    document.body.appendChild(this.view);
    this.options = { ...options };
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
  init() {
    // 注册场景
    this.addScenes(scenes);

    stateService.subscribe(this.onTransition.bind(this));

    this.subscribe(EventNames.LoadCompleted, () => {
      stateService.send(StateNames.CHOOSE);
    });
  }

  preload() {
    this.doLoad();
  }
  doLoad() {
    this.loader.add(Assets.loading);
    this.loader.load(() => {
      debug.log('Load completed');
      // 跳转到Load界面
      stateService.send(StateNames.LOAD);
    });
  }
  detectOrient(): void {}

  // ------------------------
  // 状态机的事件
  // -----------------------
  onTransition(state: { value: string }) {
    // TODO: 事件处理
    if (state.value !== StateNames.NONE) {
      debug.log(`状态机事件:${state.value}`);

      if (state.value === StateNames.CHOOSE) {
        const choose = new ChooseScene(this);

        choose.create();
        choose.resume();
        this.stage.removeChildAt(0);
        this.stage.addChildAt(choose, 0);
      } else {
        this.startScene(state.value);
      }
    }
  }
}
