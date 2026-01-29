import { GAME_CONFIG } from './constants';
import type { Ball, Paddle, GameDimensions } from './types';

export class GameLogic {
  private dimensions: GameDimensions;

  constructor(dimensions: GameDimensions) {
    this.dimensions = dimensions;
  }

  // Initialize game objects
  createPaddles(): [Paddle, Paddle] {
    return [
      {
        x: GAME_CONFIG.PADDLE_DISTANCE_FROM_EDGE,
        y: this.dimensions.height / 2 - GAME_CONFIG.PADDLE_HEIGHT / 2,
        width: GAME_CONFIG.PADDLE_WIDTH,
        height: GAME_CONFIG.PADDLE_HEIGHT,
        speed: GAME_CONFIG.PADDLE_SPEED,
        score: 0,
        color: GAME_CONFIG.COLORS.PADDLE_PLAYER1,
      },
      {
        x: this.dimensions.width - GAME_CONFIG.PADDLE_DISTANCE_FROM_EDGE - GAME_CONFIG.PADDLE_WIDTH,
        y: this.dimensions.height / 2 - GAME_CONFIG.PADDLE_HEIGHT / 2,
        width: GAME_CONFIG.PADDLE_WIDTH,
        height: GAME_CONFIG.PADDLE_HEIGHT,
        speed: GAME_CONFIG.PADDLE_SPEED,
        score: 0,
        color: GAME_CONFIG.COLORS.PADDLE_PLAYER2,
      },
    ];
  }

  createBall(): Ball {
    const angle = (Math.random() * Math.PI / 2) - Math.PI / 4;
    const direction = Math.random() > 0.5 ? 1 : -1;
    
    return {
      x: this.dimensions.width / 2,
      y: this.dimensions.height / 2,
      radius: GAME_CONFIG.BALL_RADIUS,
      velocityX: direction * GAME_CONFIG.INITIAL_BALL_SPEED * Math.cos(angle),
      velocityY: GAME_CONFIG.INITIAL_BALL_SPEED * Math.sin(angle),
      speed: GAME_CONFIG.INITIAL_BALL_SPEED,
      color: GAME_CONFIG.COLORS.BALL,
    };
  }

  // Update paddle positions
  updatePaddlePosition(paddle: Paddle, direction: 'up' | 'down' | null): void {
    if (!direction) return;

    const moveAmount = paddle.speed * (direction === 'up' ? -1 : 1);
    paddle.y = Math.max(0, Math.min(this.dimensions.height - paddle.height, paddle.y + moveAmount));
  }

  // Update ball position
  updateBall(ball: Ball): void {
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
  }

  // Check ball collision with top/bottom walls
  checkWallCollision(ball: Ball): boolean {
    if (ball.y - ball.radius <= 0 || ball.y + ball.radius >= this.dimensions.height) {
      ball.velocityY = -ball.velocityY;
      return true;
    }
    return false;
  }

  // Check ball collision with paddle
  checkPaddleCollision(ball: Ball, paddle: Paddle): boolean {
    if (
      ball.x - ball.radius <= paddle.x + paddle.width &&
      ball.x + ball.radius >= paddle.x &&
      ball.y - ball.radius <= paddle.y + paddle.height &&
      ball.y + ball.radius >= paddle.y
    ) {
      // Calculate hit position (relative to paddle center)
      const paddleCenter = paddle.y + paddle.height / 2;
      const hitPosition = (ball.y - paddleCenter) / (paddle.height / 2);
      
      // Adjust ball angle based on hit position
      const angle = hitPosition * Math.PI / 4;
      const speed = Math.min(ball.speed * GAME_CONFIG.BALL_SPEED_INCREMENT, GAME_CONFIG.MAX_BALL_SPEED);
      
      ball.velocityX = -ball.velocityX;
      ball.velocityY = speed * Math.sin(angle);
      ball.speed = speed;
      
      return true;
    }
    return false;
  }

  // Check if ball is out of bounds (scored)
  checkBallScored(ball: Ball): 'player1' | 'player2' | null {
    if (ball.x - ball.radius <= 0) {
      return 'player2';
    }
    if (ball.x + ball.radius >= this.dimensions.width) {
      return 'player1';
    }
    return null;
  }

  // Reset ball to center
  resetBall(ball: Ball): void {
    ball.x = this.dimensions.width / 2;
    ball.y = this.dimensions.height / 2;
    ball.velocityX = (Math.random() > 0.5 ? 1 : -1) * GAME_CONFIG.INITIAL_BALL_SPEED;
    ball.velocityY = (Math.random() * Math.PI / 2 - Math.PI / 4) * GAME_CONFIG.INITIAL_BALL_SPEED;
    ball.speed = GAME_CONFIG.INITIAL_BALL_SPEED;
  }

  // Draw game objects on canvas
  drawNet(ctx: CanvasRenderingContext2D): void {
    ctx.strokeStyle = GAME_CONFIG.COLORS.NET;
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 15]);
    ctx.beginPath();
    ctx.moveTo(this.dimensions.width / 2, 0);
    ctx.lineTo(this.dimensions.width / 2, this.dimensions.height);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  drawPaddle(ctx: CanvasRenderingContext2D, paddle: Paddle): void {
    ctx.fillStyle = paddle.color;
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
  }

  drawBall(ctx: CanvasRenderingContext2D, ball: Ball): void {
    ctx.fillStyle = ball.color;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  drawScore(ctx: CanvasRenderingContext2D, player1Score: number, player2Score: number): void {
    ctx.fillStyle = GAME_CONFIG.COLORS.TEXT;
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    
    // Player 1 score
    ctx.fillText(player1Score.toString(), this.dimensions.width / 4, 60);
    
    // Player 2 score
    ctx.fillText(player2Score.toString(), (3 * this.dimensions.width) / 4, 60);
  }

  // Update dimensions for responsive design
  updateDimensions(dimensions: GameDimensions): void {
    this.dimensions = dimensions;
  }
}