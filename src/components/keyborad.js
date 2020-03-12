import { CharacterDirections, CharacterMode, World } from '../constants';

export class Keyboard {
    constructor() {
        this.keyboardState = {
            Space: false,
            ArrowRight: false,
            ArrowLeft: false,
            ArrowDown: false,
            ArrowUp: false,
            SpaceTime: 0,
        };

        this.keyCodes = Object.keys(this.keyboardState);
    }

    /**
     * 场景挂起时取消事件注册
     */
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
    /**
     * 场景恢复时，重新注册事件
     */
    resume() {
        //console.log('keyborad resume');
        this.onKeyUp = e => {
            this.keyCodes.forEach(code => {
                if (e.code === code) {
                    this.keyboardState[code] = false;
                }
                if (e.code == 'Space') {
                    //计算按了多少时间
                    //this.keyboardState.SpaceTime = +new Date() - this.keyboardState.SpaceTime;
                }
            });
        };

        this.onKeyDown = e => {
            this.keyCodes.forEach(code => {
                if (e.code === code) {
                    this.keyboardState[code] = true;
                }
                if (e.code == 'Space') {
                    //console.log('space down');
                    this.keyboardState.SpaceTime = +new Date();
                }
            });
        };
        document.addEventListener('keyup', this.onKeyUp);
        document.addEventListener('keydown', this.onKeyDown);
    }

    update(delta, gameState) {
        let moving = false;
        let onTheGrand = false;
        let moveDirection = 0;
        //是否在移动
        moving = this.keyboardState.ArrowLeft || this.keyboardState.ArrowRight;

        if (this.keyboardState.ArrowLeft) {
            moveDirection = CharacterDirections.Left;
            gameState.character.direction = CharacterDirections.Left;
        }
        if (this.keyboardState.ArrowRight) {
            moveDirection = CharacterDirections.Right;
            gameState.character.direction = CharacterDirections.Right;
        }
        //是否已经落在地面
        onTheGrand = gameState.collision.collision && gameState.collision.y > 0;

        if (onTheGrand) {
            gameState.character.jumpType = 0;
        }
        if (this.keyboardState.Space) {
            if (onTheGrand) {
                //console.log('onTheGrand');
                //console.log('Jump');
                gameState.character.jumpType = 1;
                gameState.character.vy = gameState.world.maxJumpSpeed;
                this.keyboardState.SpaceTime = 0; //这里处理过这次按键了
            } else {
                if (gameState.character.jumpType != 2 && this.keyboardState.SpaceTime > 0) {
                    //console.log('DoubleJump');
                    //处理二段跳的逻辑,
                    gameState.character.jumpType = 2;
                    gameState.character.vy = gameState.world.doubleJumpSpeed;
                }
            }
        } else {
            if (onTheGrand) {
                gameState.character.vy = 0;
            }
        }
        //顶部碰头
        if (gameState.collision.collision && gameState.collision.y < 0) {
            gameState.character.vy = 0;
        }

        //无时无刻不受重力影响
        gameState.character.vy += delta * gameState.world.gravity;

        if (!onTheGrand && gameState.character.vx != 0) {
            //角色在空中，并有初始速度，则继续沿抛物线前进
            //飘落的逻辑很诡异
            //moveDirection = gameState.character.direction;
        }
        //console.log('Keyboard -> update ->  gameState.character.vy', gameState.character.vy);
        gameState.character.vx = moveDirection * gameState.world.moveSpeed;

        //设置角色状态
        if (gameState.character.jumpType == 2) {
            gameState.character.mode = CharacterMode.DoubleJump;
        } else if (gameState.character.jumpType == 1) {
            gameState.character.mode = CharacterMode.Jump;
        } else if (!onTheGrand && gameState.collision.y > 1) {
            gameState.character.mode = CharacterMode.Fall;
        } else if (moving) {
            gameState.character.mode = CharacterMode.Run;
        } else {
            gameState.character.mode = CharacterMode.Idle;
        }
    }
}
