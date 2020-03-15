import { AwardProps } from './award-prop';
import { AwardSpritePool } from './award-sprite-pool';
export class AwardManager {
    constructor(container) {
        this.container = container;

        this.awards = [];
        this.spritePool = new AwardSpritePool();
        this.paused = true;
    }
    createAward(obj) {
        let award = new AwardProps(obj, this.spritePool);
        this.awards.push(award);
    }
    pause() {
        this.paused = true;
    }
    resume() {
        this.paused = false;
    }
    reset() {
        if (this.awards) {
            this.awards.forEach(a => {
                if (a && a.reset && typeof a.reset == 'function') {
                    a.reset.call(a);
                }
            });
        }
    }
    update(delta, gameState) {
        if (this.paused) {
            return;
        }
        if (this.awards) {
            this.awards.forEach(a => {
                if (a && a.update && typeof a.update == 'function') {
                    a.update.call(a, delta, gameState, this.container);
                }
            });
        }
    }
}
