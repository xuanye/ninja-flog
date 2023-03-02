import type { IApplicationOptions as IPIXIApplicationOptions } from 'pixi.js';
import { Application as PIXIApplication } from 'pixi.js';
import type { IApplication, IComponent } from './types';
import type { SceneType } from './Scene';
import { SceneManager } from './SceneManager';
import type { EventHandler } from './eventService';
import { eventService } from './eventService';

export interface IApplicationOptions extends IPIXIApplicationOptions {
  screenWidth: number;
  screenHeight: number;
  designWidth: number;
  designHeight: number;
}

export class Application extends PIXIApplication implements IApplication, IComponent {
  sceneManager: SceneManager;
  constructor(public options: IApplicationOptions) {
    super(options);
    this.sceneManager = new SceneManager(this);
    // TODO:状态机

    this.init();
    this.preload();
    // 游戏主循环
    this.ticker.add(this.update.bind(this));
  }

  /**
   * 主事件循环中
   */
  update(delta: number) {
    // 调用场景的刷新
    this.sceneManager.update(delta);
  }

  /**
   * 添加场景
   * @param name 场景名称
   * @param sceneType 场景类型
   * @returns 返回应用程序本身
   */
  protected addScene(name: string, sceneType: SceneType): Application {
    this.sceneManager.add(name, sceneType);
    return this;
  }

  /**
   * 批量添加场景
   * @param scenes
   */
  protected addScenes(scenes: Record<string, SceneType>) {
    Object.keys(scenes).forEach((sceneName) => {
      this.addScene(sceneName, scenes[sceneName]);
    });
  }
  /**
   * 开始某个场景
   * @param {String} name 场景的名称
   * @param {*} args 场景init的参数
   */
  protected startScene(name: string) {
    this.sceneManager.start(name);
  }

  // ---------------------
  // 发布/订阅模式的简单封装
  // ---------------------
  protected subscribe(eventName: string, handler: EventHandler<unknown>) {
    // TODO:订阅事件
    eventService.subscribe(eventName, handler);
  }
  protected publish(eventName: string, args?: unknown) {
    return eventService.publish(eventName, args);
  }
  protected unsubscribe(eventName: string, handler: EventHandler<unknown>) {
    return eventService.unsubscribe(eventName, handler);
  }

  /**
   * 初始化方法
   */
  protected init() {}
  /**
   * 预加载资源需要重新这个方法
   */
  protected preload() {}
}
