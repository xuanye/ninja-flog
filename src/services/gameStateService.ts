import type { CharacterTypeName, GameState, CharacterDirections } from '@/constants';
import { WorldStatus } from '@/constants';
import { GameInitState, JumpType, World, CharacterMode } from '@/constants';

interface WorldSize {
  screenWidth: number;
  screenHeight: number;
  width: number;
  height: number;
}

class GameStateService {
  state: GameState;
  constructor(initState: GameState) {
    this.state = initState;
  }

  /**
   * 设置游戏角色
   * @param characterType 游戏角色名称
   */
  setCharacterType(characterType: CharacterTypeName) {
    this.state.character.characterType = characterType;
  }

  setWorldSize(worldSize: WorldSize) {
    this.state.world.screenHeight = worldSize.screenHeight;
    this.state.world.screenWidth = worldSize.screenWidth;
    this.state.world.height = worldSize.height;
    this.state.world.width = worldSize.width;

    this.state.world.startY = worldSize.screenHeight - worldSize.height;
  }

  /**
   * 初始化物理世界，重力，最大跳跃高度
   */
  initWorld() {
    const duration = World.JumpDuration;
    // 计算重力加速度 g =2*h / (t ^2)
    this.state.world.gravity =
      (2 * World.MaxJumpThreshold * World.Unit) / (((duration / 2) * duration) / 2);

    // 计算最大跳跃初始速度 v = gt ; 往上所以是负数
    this.state.world.maxJumpSpeed = (-this.state.world.gravity * duration) / 2;
    // 计算最小跳跃初始速度 v = gt = sqrt(2gh); 小跳还没做哦
    this.state.world.minJumpSpeed = -Math.sqrt(
      2 * this.state.world.gravity * World.MinJumpThreshold * World.Unit
    );

    // 计算二段跳的初始速度v = gt = sqrt(2gh);
    this.state.world.doubleJumpSpeed = -Math.sqrt(
      2 * this.state.world.gravity * World.DoubleJumpThreshold * World.Unit
    );

    // 计算基准地面Y坐标
    this.state.world.baseGroundY = this.state.world.screenHeight - World.groundHeight * World.Unit;
  }

  setCharacter(character: any) {
    this.state.character.sprite = character;
  }
  setCharacterHit() {
    this.state.character.health -= 1;
    this.state.character.invincible = true;
    this.state.character.mode = CharacterMode.Hit;
  }
  setCharacterDirection(direction: CharacterDirections) {
    this.state.character.direction = direction;
  }
  setCharacterPos(x: number, y: number) {
    this.state.character.x = x;
    this.state.character.y = y;
  }
  isOnTheGround() {
    return this.state.collision.collision && this.state.collision.y > 0;
  }
  isHitHead() {
    return this.state.collision.collision && this.state.collision.y < 0;
  }
  setJumpAction(jumpType: JumpType) {
    this.state.character.jumpType = jumpType;
    if (jumpType === JumpType.Jump) {
      this.state.character.vy = this.state.world.maxJumpSpeed;
    } else if (jumpType === JumpType.DoubleJump) {
      this.state.character.vy = this.state.world.doubleJumpSpeed;
    }
  }
  resetVectorY() {
    this.state.character.vy = 0;
  }
  setPivotX(value: number) {
    this.state.world.pivotX = value;
  }
  setCharacterBox(box: unknown) {
    this.state.character.box = box;
  }
  setCharacterMode(mode: CharacterMode) {
    this.state.character.mode = mode;
  }
  resetCharacterPos(x: number, y: number) {
    this.state.character.box.pos.x = x;
    this.state.character.box.pos.y = y;
  }
  resetCollision() {
    this.state.collision.collision = false;
    this.state.collision.x = 0;
    this.state.collision.y = 0;
  }
  setCollision(collision: boolean, vX: number, vY: number) {
    this.state.collision.collision = collision;

    if (vX !== 0 && this.state.collision.x === 0) {
      this.state.collision.x = vX;
    }
    if (vY !== 0 && this.state.collision.y === 0) {
      this.state.collision.y = vY;
    }
  }
  setWorldEndStatus() {
    this.state.world.status = WorldStatus.End;
  }
  deductHealth() {
    this.state.character.health = 0;
  }
  setHeroDied() {
    this.state.character.health = 0;
    this.state.world.pivotOffsetX = 0;
    this.state.character.isDead = true;
  }
  setPivotOffsetX(x: number) {
    this.state.world.pivotOffsetX = x;
  }
  gravityEffect(delta: number) {
    this.state.character.vy += delta * this.state.world.gravity;
  }
  setMoving(moving: boolean) {
    this.state.character.vx = moving
      ? this.state.character.direction * this.state.world.moveSpeed
      : 0;
    this.state.character.moving = moving;
  }
}

export const gameStateService = new GameStateService(GameInitState);
