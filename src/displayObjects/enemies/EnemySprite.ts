import type { EnemyOptions } from '@/constants';

import { StatesAnimatedSprite } from '@/pitaya';

export class EnemySprite extends StatesAnimatedSprite {
  data: EnemyOptions;
  constructor(enemy: EnemyOptions) {
    super(enemy.texture, enemy.states, enemy.initState);
    this.data = enemy;
    this.animationSpeed = enemy.animationSpeed;
  }
}
