import { debug } from '@/services/debug';
import type { Scene, SceneType } from './Scene';
import type { IApplication, ResizeOptions } from './types';

export class SceneManager {
  app: IApplication;
  scenes: Record<string, SceneType>;
  sceneInstances: Record<string, Scene>;
  activeScene?: Scene;

  constructor(app: IApplication) {
    this.scenes = {}; // 场景的类
    this.sceneInstances = {}; // 场景的实例
    this.app = app;
  }

  /**
   * 注册场景
   * @param {String} name 场景名称
   * @param {Scene} scene 场景对象
   */
  add(name: string, scene: SceneType) {
    if (this.scenes[name]) {
      debug.warn(`${name} scene has registered, please rename it`);
    }
    this.scenes[name] = scene;
  }
  onResize(options: ResizeOptions) {
    if (this.activeScene) {
      if (this.activeScene.onResize) {
        this.activeScene.onResize(options);
      }
    }
  }
  update(delta: number, ...args: any[]) {
    if (this.activeScene && !this.activeScene.isPaused()) {
      this.activeScene.update(delta, ...args);
    }
  }
  /**
   * 开始场景
   * @param {String} name 场景的名称
   * @param {*} args 场景init的参数
   */
  start(name: string, ...args: any[]) {
    setTimeout(() => {
      if (this.activeScene?.pause) {
        this.activeScene.pause();
      }

      const ActiveScene = this.scenes[name];

      if (!ActiveScene) throw new Error(`${name} scene is not exist`);

      let instance = this.sceneInstances[name];
      if (!instance) {
        instance = new ActiveScene(this.app);
        console.log('🚀 ~ SceneManager ~ setTimeout ~ instance:', instance);

        this.sceneInstances[name] = instance;
        if (instance.create) {
          instance.create.apply(instance);
        }
        this.app.stage.addChildAt(instance, 0);
      }

      if (instance.resume) {
        instance.resume(...args);
      }
    });
  }
}
