import type { Container } from 'pixi.js';
import type { IComponent } from '@/pitaya';
import { AwardProp } from './AwardProp';
import { AwardSpritePool } from './AwardSpritePool';
import type { AwardObjectType } from './types';

export class AwardManager implements IComponent {
  container: Container;
  awards: AwardProp[];
  spritePool: AwardSpritePool;
  paused: boolean;
  constructor(container: Container) {
    this.container = container;

    this.awards = [];
    this.spritePool = new AwardSpritePool();
    this.paused = false;
  }
  createAward(obj: AwardObjectType) {
    const award = new AwardProp(obj, this.spritePool);
    this.awards.push(award);
  }
  pause() {
    this.paused = true;
  }
  resume() {
    this.paused = false;
  }
  reset() {
    if (this.awards) {
      this.awards.forEach((a) => {
        a.reset();
      });
    }
    // this.awards = [];
  }
  update(delta: number) {
    // console.log('------->', this.paused);
    if (this.paused) {
      return;
    }

    if (this.awards) {
      // console.log('------->', this.awards);
      this.awards.forEach((a) => {
        a.update(delta, this.container);
      });
    }
  }
}
