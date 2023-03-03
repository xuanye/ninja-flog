import { Container } from 'pixi.js';
import type { Loader } from 'pixi.js';
import type { IApplication, ISynchronizable, ResizeOptions } from './types';
import type { IApplicationOptions } from './Application';

import type { EventHandler } from './eventService';
import { eventService } from './eventService';
import { debug } from '@/modules/debug';

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
  syncItems: ISynchronizable[]; // 需要同步的元素
  paused = false;
  state!: ISceneState;

  constructor(app: IApplication) {
    super();
    this.app = app;
    this.loader = app.loader;
    this.syncItems = [];
    this.initState();
    this.preload();
  }

  // ---------------------
  // 发布/订阅模式的简单封装
  // ---------------------
  subscribe(eventName: string, handler: EventHandler<unknown>) {
    eventService.subscribe(eventName, handler);
  }
  publish(eventName: string, args?: unknown) {
    return eventService.publish(eventName, args);
  }
  unsubscribe(eventName: string, handler: EventHandler<unknown>) {
    return eventService.unsubscribe(eventName, handler);
  }

  initState() {
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
  resume(args?: unknown) {
    // 显示的方法
    this.visible = true;
    this.paused = false;
    if (this.syncItems) {
      this.syncItems.forEach((item: ISynchronizable) => {
        if (item?.resume) {
          item.resume(args);
        }
      });
    }
  }
  pause() {
    this.visible = false;
    this.paused = true;
    if (this.syncItems) {
      this.syncItems.forEach((item) => {
        if (item?.pause) {
          item.pause();
        }
      });
    }
  }

  isPaused() {
    return this.paused;
  }

  /**
   * 注册需要同步的元素，该元素必须有update方法
   * @param {Object} item  需要同步的元素，该元素必须有update方法
   */
  sync(component: ISynchronizable) {
    this.syncItems.push(component);
  }
  cancelSync(component: ISynchronizable) {
    const index = this.syncItems.indexOf(component);
    if (index > -1) {
      this.syncItems.splice(index, 1);
    }
  }
  update(delta: number) {
    if (this.syncItems) {
      this.syncItems.forEach((item) => {
        if (item) {
          if (item._update) {
            item._update(delta);
          } else if (item.update) {
            item.update(delta);
          }
        }
      });
    }
  }
  onResize(_options: ResizeOptions): void {}

  create() {
    debug.warn('Scene Created');
  }
}

export type SceneType = typeof Scene;
