import { NinjaFlog } from './ninja-flog';
import { MaskDude } from './mask-dude';
import { PinkMan } from './pink-man';
import { VirtualGuy } from './virtual-guy';
import { Character } from './character';

Character.create = function(name, gameState) {
    let charSprite;

    switch (name) {
        case 'mask-dude':
            charSprite = new MaskDude(gameState);
            charSprite.characterName = name;
            break;
        case 'pink-man':
            charSprite = new PinkMan(gameState);
            charSprite.characterName = name;
            break;
        case 'virtual-guy':
            charSprite = new VirtualGuy(gameState);
            charSprite.characterName = name;
            break;
        case 'ninja-flog':
        default:
            charSprite = new NinjaFlog(gameState);
            charSprite.characterName = 'ninja-flog';
            break;
    }
    return charSprite;
};
export default Character;
