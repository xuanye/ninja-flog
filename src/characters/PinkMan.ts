import type { GameState } from '@/constants';
import { TextureNames } from '@/constants';
import { Character } from './Character';

export class PinkMan extends Character {
  constructor(initState: GameState) {
    // console.log('NinjaFlog -> constructor -> resources', resources);

    super(
      TextureNames.pinkMan,
      {
        Idle: [14, 24], // 空闲状态
        Run: [26, 37], // 跑起来
        Jump: [25], // 跳跃
        DoubleJump: [0, 5], // 空中翻滚
        Fall: [13], // 下坠，
        Hit: [6, 12], // 被撞击了
        WalkJump: [38, 42], // 我都不知道干嘛
      },

      initState // 初始状态
    );
  }
}
