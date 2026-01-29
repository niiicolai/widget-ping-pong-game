import type { GameDimensions } from './types';

export const GAME_CONFIG = {
  // Canvas dimensions
  CANVAS_WIDTH: 800,
  CANVAS_HEIGHT: 400,
  
  // Paddle settings
  PADDLE_WIDTH: 15,
  PADDLE_HEIGHT: 80,
  PADDLE_SPEED: 6,
  PADDLE_DISTANCE_FROM_EDGE: 20,
  
  // Ball settings
  BALL_RADIUS: 8,
  INITIAL_BALL_SPEED: 3,
  BALL_SPEED_INCREMENT: 1.1,
  MAX_BALL_SPEED: 12,
  
  // Game settings
  WINNING_SCORE: 5,
  AI_REACTION_TIME: 10,
  AI_ERROR_MARGIN: 30,
  
  // Colors
  COLORS: {
    BACKGROUND: '#0F172A',
    PADDLE_PLAYER1: '#3B82F6',
    PADDLE_PLAYER2: '#EF4444',
    BALL: '#FFFFFF',
    NET: '#475569',
    TEXT: '#E2E8F0',
  },
  
  // Difficulty settings
  DIFFICULTY: {
    easy: {
      aiSpeed: 3,
      aiErrorMargin: 50,
      ballSpeedMultiplier: 0.8,
    },
    medium: {
      aiSpeed: 5,
      aiErrorMargin: 30,
      ballSpeedMultiplier: 1.0,
    },
    hard: {
      aiSpeed: 7,
      aiErrorMargin: 15,
      ballSpeedMultiplier: 1.2,
    },
  },
  
  // Responsive scaling
  getResponsiveDimensions(): GameDimensions {
    if (typeof window === 'undefined') {
      return {
        width: this.CANVAS_WIDTH,
        height: this.CANVAS_HEIGHT,
      };
    }
    
    const maxWidth = Math.min(window.innerWidth - 40, this.CANVAS_WIDTH);
    const aspectRatio = this.CANVAS_HEIGHT / this.CANVAS_WIDTH;
    
    return {
      width: maxWidth,
      height: Math.floor(maxWidth * aspectRatio),
    };
  },
};