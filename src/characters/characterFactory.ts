import { VirtualGuy } from './VirtualGuy';
import type { GameState } from '@/constants';
import { NinjaFlog } from './NinjaFlog';
import { PinkMan } from './PinkMan';
import { MaskDude } from './MaskDude';

export const characterFactory = {
  create(name: string, gameState: GameState) {
    let charSprite;

    switch (name) {
      case 'ninja-flog':
        charSprite = new NinjaFlog(gameState);
        break;
      case 'pink-man':
        charSprite = new PinkMan(gameState);
        break;
      case 'mask-dude':
        charSprite = new MaskDude(gameState);
        break;
      case 'virtual-guy':
      default:
        charSprite = new VirtualGuy(gameState);
        break;
    }
    return charSprite;
  },
};
