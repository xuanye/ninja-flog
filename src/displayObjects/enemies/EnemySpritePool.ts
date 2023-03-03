import { EnemyInfos } from '@/constants';
import { EnemySprite } from './EnemySprite';

export class EnemySpritePool {
  pools: Record<string, EnemySprite[]>;
  constructor() {
    this.pools = {};

    this.init();
  }

  init() {
    Object.keys(EnemyInfos).forEach((name) => {
      this.pools[name] = [];

      this.prepareSprite(name, 20);
    });
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
    const enemy = EnemyInfos[name];
    // 创建动画精灵
    return new EnemySprite(enemy);
  }
  get(name: string) {
    if (typeof this.pools[name] === 'undefined') {
      throw new Error('怪物类型不存在' + name);
    }
    // console.log('借用');
    let sprite = this.pools[name].shift();
    if (!sprite) {
      // console.log('金币不够');
      return this.createProxy(name);
    }
    return sprite;
  }

  return(sprite: EnemySprite, name: string) {
    if (!this.pools[name]) {
      throw new Error('怪物类型不存在');
    }
    // console.log('金币归还', name);
    this.pools[name].push(sprite);
  }
}
