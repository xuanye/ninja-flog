import type { Award } from '@/constants';

import { StatesAnimatedSprite } from '@/pitaya';

export class AwardSprite extends StatesAnimatedSprite {
  data: Award;
  constructor(award: Award) {
    super(award.texture, award.states, award.initState);
    this.data = award;
    this.animationSpeed = award.animationSpeed;
  }
}
