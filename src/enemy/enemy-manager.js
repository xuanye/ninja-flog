import { Enemy } from './enemy';
import { EnemySpritePool } from './enemy-pool';

export class EnemyManager {
    constructor(container) {
        this.container = container;

        this.enemies = [];
        this.pool = new EnemySpritePool();
        this.paused = true;
    }
    createEnemy(obj) {
        let enemy = new Enemy(obj, this.pool);
        this.enemies.push(enemy);
    }
    pause() {
        this.paused = true;
    }
    resume() {
        this.paused = false;
    }
    update(delta, gameState) {
        if (this.paused) {
            return;
        }
        if (this.enemies) {
            this.enemies.forEach(a => {
                if (a && a.update && typeof a.update == 'function') {
                    a.update.call(a, delta, gameState, this.container);
                }
            });
        }
    }
}
