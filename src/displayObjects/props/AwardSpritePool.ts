import { AwardInfos } from '@/constants';
import { AwardSprite } from './AwardSprite';

export class AwardSpritePool {
  pools: Record<string, AwardSprite[]>;
  constructor() {
    this.pools = {};

    this.init();
  }

  init() {
    Object.keys(AwardInfos).forEach((name) => {
      this.pools[name] = [];

      this.prepareSprite(name, 20);
    });
    // console.log(this.pools);
  }
  prepareSprite(name: string, count: number) {
    for (let i = 0; i < count; i++) {
      this.pools[name].push(this.createProxy(name));
    }
  }
  createProxy(name: string) {
    if (typeof this.pools[name] === 'undefined') {
      throw new Error('奖励类型不存在' + name);
    } else {
      return this.createSprite(name);
    }
  }
  createSprite(name: string) {
    // console.log('AwardSpritePool -> createSprite -> TextureNames.Award[name]', name, TextureNames.Award[name]);
    const award = AwardInfos[name];
    // 创建动画精灵
    return new AwardSprite(award);
  }
  get(name: string) {
    if (typeof this.pools[name] === 'undefined') {
      throw new Error('奖励类型不存在' + name);
    }
    // console.log('借用');
    let sprite = this.pools[name].shift();
    if (!sprite) {
      // console.log('金币不够');
      return this.createProxy(name);
    }
    return sprite;
  }

  return(sprite: AwardSprite, name: string) {
    if (!this.pools[name]) {
      throw new Error('奖励类型不存在');
    }
    // console.log('金币归还', name);
    this.pools[name].push(sprite);
  }
}
