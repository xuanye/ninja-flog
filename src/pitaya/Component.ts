import { Container } from 'pixi.js';
import type { IComponent, ResizeOptions } from './types';

export class Component extends Container implements IComponent {
  constructor() {
    super();
    this.init();
  }
  init() {}

  create() {}

  update(_delta: number, ..._args: any[]) {}
  onResize(_options: ResizeOptions): void {}
}
