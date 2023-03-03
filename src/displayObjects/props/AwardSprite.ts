import type { AwardOptions } from '@/constants';

import { StatesAnimatedSprite } from '@/pitaya';

export class AwardSprite extends StatesAnimatedSprite {
  data: AwardOptions;
  constructor(award: AwardOptions) {
    super(award.texture, award.states, award.initState);
    this.data = award;
    this.animationSpeed = award.animationSpeed;
  }
}
