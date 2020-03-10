import { CharacterDirections, CharacterMode, World } from '../constants';

export class Keyboard {
    constructor(initState) {
        this.gameState = initState;
        this.keyboardState = {
            Space: false,
            ArrowRight: false,
            ArrowLeft: false,
            ArrowDown: false,
            ArrowUp: false,
        };

        this.keyCodes = Object.keys(this.keyboardState);
    }

    pause() {
        if (this.onKeyUp) {
            document.removeEventListener('keyup', this.onKeyUp);
            this.onKeyUp = null;
        }
        if (this.onKeyDown) {
            document.removeEventListener('keydown', this.onKeyDown);
            this.onKeyDown = null;
        }
    }
    resume() {
        console.log('keyborad resume');
        this.onKeyUp = e => {
            this.keyCodes.forEach(code => {
                if (e.code === code) {
                    this.keyboardState[code] = false;
                }
            });
        };

        this.onKeyDown = e => {
            this.keyCodes.forEach(code => {
                if (e.code === code) {
                    this.keyboardState[code] = true;
                }
            });
        };
        document.addEventListener('keyup', this.onKeyUp);
        document.addEventListener('keydown', this.onKeyDown);
    }

    update(delta, gameState) {
        this.gameState = gameState;

        let jumping = false;
        let moving = false;
        let onTheGrand = false;
        let moveDirection = 0;
        //是否在移动
        moving = this.keyboardState.ArrowLeft || this.keyboardState.ArrowRight;

        if (this.keyboardState.ArrowLeft) {
            moveDirection = -1;
            gameState.character.direction = CharacterDirections.Left;
        }
        if (this.keyboardState.ArrowRight) {
            moveDirection = 1;
            gameState.character.direction = CharacterDirections.Right;
        }
        //是否已经落在地面
        onTheGrand = gameState.collision.collision && gameState.collision.y > 0;

        if (onTheGrand) {
            this.gameState.character.jumpType = 0;
        }
        if (this.keyboardState.Space) {
            if (onTheGrand) {
                console.log('onTheGrand');
                this.gameState.character.jumpType = 1;
                this.gameState.character.vy = this.gameState.world.maxJumpSpeed;
            } else {
                if (this.gameState.character.jumpType != 2) {
                    //处理二段跳的逻辑
                }
            }
        } else {
            if (onTheGrand) {
                this.gameState.character.vy = 0;
            }
        }

        jumping = this.gameState.character.jumpType > 0;

        //无时无刻不受重力影响
        this.gameState.character.vy += delta * this.gameState.world.gravity;
        console.log('Keyboard -> update ->  this.gameState.character.vy', this.gameState.character.vy);
        this.gameState.character.vx = moving ? moveDirection * this.gameState.world.moveSpeed : 0;

        if (jumping) {
            gameState.character.mode = CharacterMode.Jump;
        } else if (!onTheGrand) {
            gameState.character.mode = CharacterMode.Fall;
        } else if (moving) {
            gameState.character.mode = CharacterMode.Run;
        } else {
            gameState.character.mode = CharacterMode.Idle;
        }
    }
}
