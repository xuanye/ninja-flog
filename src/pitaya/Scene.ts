import { Container } from 'pixi.js';
import type { Loader } from 'pixi.js';
import type { IApplication, IComponent, ResizeOptions } from './types';
import type { IApplicationOptions } from './Application';

import type { EventHandler } from './eventService';
import { eventService } from './eventService';

export interface ISceneState extends IApplicationOptions {
  width: number;
  height: number;
  realWidth: number;
  realHeight: number;
}
/**
 * 场景基类
 */
export class Scene extends Container {
  app: IApplication; // 应用程序主题
  loader: Loader; // pixi的加载器
  syncItems: IComponent[]; // 需要同步的元素
  paused = false;
  state!: ISceneState;

  constructor(app: IApplication) {
    super();
    this.app = app;
    this.loader = app.loader;
    this.syncItems = [];
    this.init();
    this.preload();
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

  init() {
    this.state = { ...this.app.options };
    this.state.width = this.state.designWidth;
    this.state.height = this.state.designHeight;

    if (this.state.designWidth > this.state.designHeight) {
      this.state.realWidth = Math.max(this.state.screenWidth, this.state.screenHeight);
      this.state.realHeight = Math.min(this.state.screenWidth, this.state.screenHeight);
    } else {
      this.state.realWidth = Math.min(this.state.screenWidth, this.state.screenHeight);
      this.state.realHeight = Math.max(this.state.screenWidth, this.state.screenHeight);
    }
  }
  preload() {}
  resume(...args: any[]) {}
  pause() {}
  isPaused() {
    return this.paused;
  }
  create() {}
  /**
   * 注册需要同步的元素，该元素必须有update方法
   * @param {Object} item  需要同步的元素，该元素必须有update方法
   */
  sync(component: IComponent) {
    this.syncItems.push(component);
  }
  cancelSync() {}
  update(delta: number, ...args: any[]) {}
  onResize(options: ResizeOptions): void {}
}

export type SceneType = typeof Scene;
