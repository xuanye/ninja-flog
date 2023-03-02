import { TextureNames } from '@/constants';
import { Character } from './Character';
import type { CharacterState } from './types';

export class NinjaFlog extends Character {
  constructor(initState: CharacterState) {
    super(
      TextureNames.ninjaFlog,
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
