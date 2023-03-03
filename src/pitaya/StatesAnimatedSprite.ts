import { debug } from '@/modules/debug';
import { AnimatedSprite, Texture } from 'pixi.js';

export type AnimateStates = Record<string, number[]>;

export class StatesAnimatedSprite extends AnimatedSprite {
  animatedStates: Record<string, Texture[]>;
  currentState?: string;
  constructor(frameBaseName: string, states: AnimateStates, initState: string) {
    const arrName = frameBaseName.split('.');
    const extName = arrName.pop();
    const baseName = arrName.pop();

    const animatedStates: Record<string, Texture[]> = {};
    const stateKeys = Object.keys(states);

    let myState;
    if (!initState || !states[initState]) {
      myState = stateKeys[0];
    } else {
      myState = initState;
    }

    Object.keys(states).forEach((key) => {
      const range = states[key];

      const textures = [];
      if (range.length === 1) {
        textures.push(Texture.from(`${baseName}${range[0]}.${extName}`));
      } else {
        for (let i = range[0], l = range[1]; i <= l; i++) {
          textures.push(Texture.from(`${baseName}${i}.${extName}`));
        }
      }

      animatedStates[key] = textures;
    });

    super(animatedStates[myState]);

    this.animatedStates = animatedStates;
    // this.currentState = myState;
  }
  playState(stateName: string) {
    if (stateName === this.currentState) {
      return;
    }
    if (this.animatedStates[stateName] && this.animatedStates[stateName].length > 0) {
      this.currentState = stateName;
      this.stop();
      this.textures = this.animatedStates[stateName];
      this.gotoAndPlay(0);
    } else {
      debug.log(this.animatedStates);
      debug.warn('stateName=' + stateName + ' is notfound');
    }
  }
}
