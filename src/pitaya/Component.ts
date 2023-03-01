import { Container } from 'pixi.js';
import type { IComponent, ResizeOptions } from './types';
import type { EventHandler } from './eventService';
import { eventService } from './eventService';

export class Component extends Container implements IComponent {
  constructor() {
    super();
    this.init();
  }
  init() {}
  create() {}

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

  update(_delta: number, ..._args: any[]) {}
  onResize(_options: ResizeOptions): void {}
}
