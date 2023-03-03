import type { Loader, Container } from 'pixi.js';

export interface IApplication {
  options: any;
  loader: Loader;
  stage: Container;
}

export interface ISynchronizable {
  update: (delta: number) => void;
  _update?: (delta: number) => void;
  pause?: () => void;
  resume?: (args: unknown) => void;
}

export interface ResizeOptions {
  width: number;
  height: number;
  realWidth: number;
  realHeight: number;
}
