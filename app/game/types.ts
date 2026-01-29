export interface Ball {
  x: number;
  y: number;
  radius: number;
  velocityX: number;
  velocityY: number;
  speed: number;
  color: string;
}

export interface Paddle {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  score: number;
  color: string;
}

export interface GameState {
  isPlaying: boolean;
  isPaused: boolean;
  isGameOver: boolean;
  winner: 'player1' | 'player2' | 'ai' | null;
  mode: 'single' | 'multiplayer';
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Controls {
  player1: {
    up: boolean;
    down: boolean;
  };
  player2: {
    up: boolean;
    down: boolean;
  };
}

export interface HighScore {
  score: number;
  opponent: 'ai' | 'player';
  difficulty: 'easy' | 'medium' | 'hard';
  date: string;
}

export interface GameDimensions {
  width: number;
  height: number;
}