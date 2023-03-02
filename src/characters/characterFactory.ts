import { VirtualGuy } from './VirtualGuy';
import type { CharacterTypeName } from '@/constants';
import { CharacterType } from '@/constants';
import { NinjaFlog } from './NinjaFlog';
import { PinkMan } from './PinkMan';
import { MaskDude } from './MaskDude';
import type { Character } from './Character';
import type { CharacterState } from './types';

export const characterFactory = {
  create(name: CharacterTypeName, state: CharacterState) {
    let charSprite: Character;

    switch (name) {
      case CharacterType.NinjaFlog:
        charSprite = new NinjaFlog(state);
        break;
      case CharacterType.PinkMan:
        charSprite = new PinkMan(state);
        break;
      case CharacterType.MaskDude:
        charSprite = new MaskDude(state);
        break;
      case CharacterType.VirtualGuy:
      default:
        charSprite = new VirtualGuy(state);
        break;
    }
    charSprite.characterName = name;
    return charSprite;
  },
};
