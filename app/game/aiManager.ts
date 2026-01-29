import { GAME_CONFIG } from '../game/constants';
import type { Ball, Paddle, GameDimensions } from '../game/types';

export class AIManager {
  private difficulty: 'easy' | 'medium' | 'hard';
  private reactionCounter: number = 0;
  private targetY: number = 0;

  constructor(difficulty: 'easy' | 'medium' | 'hard' = 'medium') {
    this.difficulty = difficulty;
  }

  updateAIPaddle(aiPaddle: Paddle, ball: Ball, dimensions: GameDimensions): 'up' | 'down' | null {
    const config = GAME_CONFIG.DIFFICULTY[this.difficulty];
    
    // Only react every few frames to simulate human reaction time
    this.reactionCounter++;
    if (this.reactionCounter < GAME_CONFIG.AI_REACTION_TIME - config.aiSpeed) {
      return null;
    }
    this.reactionCounter = 0;

    // Calculate ideal position with some error margin based on difficulty
    const paddleCenter = aiPaddle.y + aiPaddle.height / 2;
    const ballY = ball.y;
    const errorMargin = config.aiErrorMargin * (Math.random() - 0.5);
    const targetY = ballY + errorMargin;

    // Set target position with some smoothing
    this.targetY = targetY;

    // Determine movement direction
    const deltaY = this.targetY - paddleCenter;
    const deadZone = 5; // Don't move if close enough

    if (Math.abs(deltaY) < deadZone) {
      return null;
    }

    // Only move if ball is coming towards AI paddle
    if (ball.velocityX > 0) {
      return deltaY > 0 ? 'down' : 'up';
    }

    // If ball is moving away, slowly return to center
    const centerTarget = dimensions.height / 2;
    const centerDelta = centerTarget - paddleCenter;
    if (Math.abs(centerDelta) > deadZone) {
      return centerDelta > 0 ? 'down' : 'up';
    }

    return null;
  }

  setDifficulty(difficulty: 'easy' | 'medium' | 'hard'): void {
    this.difficulty = difficulty;
    this.reactionCounter = 0;
    this.targetY = 0;
  }

  getDifficulty(): 'easy' | 'medium' | 'hard' {
    return this.difficulty;
  }
}