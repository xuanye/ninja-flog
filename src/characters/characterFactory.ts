import { VirtualGuy } from './VirtualGuy';

import type { GameState } from '@/constants';

export const create = function (name: string, gameState: GameState) {
  let charSprite;

  switch (name) {
    case 'virtual-guy':
      charSprite = new VirtualGuy(gameState);
      charSprite.characterName = name;
      break;
  }
  return charSprite;
};
