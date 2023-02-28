import type { Loader, Container } from 'pixi.js';

export interface IApplication {
  options: any;
  loader: Loader;
  stage: Container;
}

export interface IComponent {
  update: (delta: number, ...arg: any[]) => void;
}

export interface ResizeOptions {
  width: number;
  height: number;
  realWidth: number;
  realHeight: number;
}
