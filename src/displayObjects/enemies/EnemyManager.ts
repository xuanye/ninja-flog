import type { Container } from 'pixi.js';
import type { ISynchronizable } from '@/pitaya';
import { Enemy } from './Enemy';
import { EnemySpritePool } from './EnemySpritePool';
import type { EnemyObjectType } from './types';

export class EnemyManager implements ISynchronizable {
  container: Container;
  enemies: Enemy[];
  spritePool: EnemySpritePool;
  paused: boolean;
  constructor(container: Container) {
    this.container = container;

    this.enemies = [];
    this.spritePool = new EnemySpritePool();
    this.paused = false;
  }
  createEnemy(obj: EnemyObjectType) {
    const enemy = new Enemy(obj, this.spritePool);
    this.enemies.push(enemy);
  }
  pause() {
    this.paused = true;
  }
  resume() {
    this.paused = false;
  }

  update(delta: number) {
    // console.log('------->', this.paused);
    if (this.paused) {
      return;
    }

    if (this.enemies) {
      // console.log('------->', this.enemies);
      this.enemies.forEach((a) => {
        a.update(delta, this.container);
      });
    }
  }
}
