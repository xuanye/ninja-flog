import { CharacterDirections, CharacterMode } from '../constants';

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

        //处理角色移动
        if (this.keyboardState.ArrowLeft && !this.keyboardState.ArrowRight) {
            gameState.character.direction = CharacterDirections.Left;
            gameState.character.vx = -1;
            gameState.character.mode = CharacterMode.Run;
        } else if (!this.keyboardState.ArrowLeft && this.keyboardState.ArrowRight) {
            gameState.character.direction = CharacterDirections.Right;
            gameState.character.vx = 1;
            gameState.character.mode = CharacterMode.Run;
        } else {
            gameState.character.vx = 0;
            gameState.character.mode = CharacterMode.Idle;
        }

        if (this.keyboardState.ArrowDown) {
            gameState.character.vy = 1;
        }
        if (this.keyboardState.ArrowUp) {
            gameState.character.vy = -1;
        }
        return;
        gameState.character.jump--;
        if (gameState.character.jump < 0) {
            gameState.character.jump = 0;
        }
        //处理角色跳跃
        if (this.keyboardState.Space) {
            if (gameState.character.jumpType == 0) {
                //当前不在跳的状态
                gameState.character.jumpType = 1; //设置跳起状态
                //如果在跑，那就设置跑跳，否则就是一般的跳
                gameState.character.mode = gameState.character.mode == CharacterMode.Run ? CharacterMode.WalkJump : CharacterMode.Jump;
                //跳跃演绎的帧数
                gameState.character.jump = 35;
                //每帧跳跃的高度，注意这里是负数
                gameState.character.vy = -1;
            } else if (gameState.character.jumpType == 1) {
                //当前已经在跳跃状态了
                gameState.character.jump += 10; //再加10;
                //设置二级跳状态
                gameState.character.mode = CharacterMode.DoubleJump;
                gameState.character.jumpType = 2;
            } else {
                //已经在二级跳状态
            }
        }

        if (gameState.character.jump == 0) {
            gameState.character.jumpType = 0;
            //gameState.character.vy = 1;
            //测试代码
            if (this.keyboardState.ArrowDown) {
                //console.log('Keyboard -> update -> this.keyboardState.ArrowDown', this.keyboardState.ArrowDown);
                gameState.character.mode = CharacterMode.Fall;
                gameState.character.vy = 1;
            }
        }
    }
}
