import { useState, useEffect, useRef, useCallback } from 'react';
import { GAME_CONFIG } from '../game/constants';
import { GameLogic } from '../game/gameLogic';
import { ControlsManager } from '../game/controls';
import { AIManager } from '../game/aiManager';
import type { GameState, Ball, Paddle, GameDimensions } from '../game/types';

export default function PingPongGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLogicRef = useRef<GameLogic | null>(null);
  const controlsManagerRef = useRef<ControlsManager | null>(null);
  const aiManagerRef = useRef<AIManager | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const [dimensions, setDimensions] = useState<GameDimensions>(
    GAME_CONFIG.getResponsiveDimensions()
  );

  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    isPaused: false,
    isGameOver: false,
    winner: null,
    mode: 'single',
    difficulty: 'medium',
  });

  const [paddles, setPaddles] = useState<[Paddle, Paddle]>([
    { x: 0, y: 0, width: 0, height: 0, speed: 0, score: 0, color: '' },
    { x: 0, y: 0, width: 0, height: 0, speed: 0, score: 0, color: '' },
  ]);

  const [ball, setBall] = useState<Ball>({
    x: 0, y: 0, radius: 0, velocityX: 0, velocityY: 0, speed: 0, color: '',
  });

  // Initialize game
  useEffect(() => {
    if (canvasRef.current) {
      gameLogicRef.current = new GameLogic(dimensions);
      controlsManagerRef.current = new ControlsManager(canvasRef.current);
      aiManagerRef.current = new AIManager(gameState.difficulty);

      const [p1, p2] = gameLogicRef.current.createPaddles();
      const gameBall = gameLogicRef.current.createBall();

      setPaddles([p1, p2] as [Paddle, Paddle]);
      setBall(gameBall);
    }
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const newDimensions = GAME_CONFIG.getResponsiveDimensions();
      setDimensions(newDimensions);

      if (gameLogicRef.current) {
        gameLogicRef.current.updateDimensions(newDimensions);
        const [p1, p2] = gameLogicRef.current.createPaddles();
        setPaddles([p1, p2] as [Paddle, Paddle]);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Game loop
  const gameLoop = useCallback(() => {
    if (!canvasRef.current || !gameLogicRef.current || !controlsManagerRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = GAME_CONFIG.COLORS.BACKGROUND;
    ctx.fillRect(0, 0, dimensions.width, dimensions.height);

    // Draw net
    gameLogicRef.current.drawNet(ctx);

    // Update game state if playing and not paused
    if (gameState.isPlaying && !gameState.isPaused) {
      const controls = controlsManagerRef.current.getControls();

      // Update player 1 paddle
      const p1Direction = controls.player1.up ? 'up' : controls.player1.down ? 'down' : null;
      gameLogicRef.current.updatePaddlePosition(paddles[0], p1Direction);

      // Update player 2 or AI paddle
      let p2Direction: 'up' | 'down' | null = null;
      if (gameState.mode === 'multiplayer') {
        p2Direction = controls.player2.up ? 'up' : controls.player2.down ? 'down' : null;
      } else if (aiManagerRef.current) {
        p2Direction = aiManagerRef.current.updateAIPaddle(paddles[1], ball, dimensions);
      }
      gameLogicRef.current.updatePaddlePosition(paddles[1], p2Direction);

      // Update ball
      gameLogicRef.current.updateBall(ball);
      gameLogicRef.current.checkWallCollision(ball);

      // Check paddle collisions
      gameLogicRef.current.checkPaddleCollision(ball, paddles[0]);
      gameLogicRef.current.checkPaddleCollision(ball, paddles[1]);

      // Check for scoring
      const scorer = gameLogicRef.current.checkBallScored(ball);
      if (scorer) {
        const newPaddles: [Paddle, Paddle] = [...paddles] as [Paddle, Paddle];
        if (scorer === 'player1') {
          newPaddles[0].score++;
        } else {
          newPaddles[1].score++;
        }
        setPaddles(newPaddles);

        // Check for winner
        if (newPaddles[0].score >= GAME_CONFIG.WINNING_SCORE || newPaddles[1].score >= GAME_CONFIG.WINNING_SCORE) {
          setGameState(prev => ({
            ...prev,
            isGameOver: true,
            isPlaying: false,
            winner: newPaddles[0].score >= GAME_CONFIG.WINNING_SCORE ? 'player1' : 'player2',
          }));
        } else {
          gameLogicRef.current.resetBall(ball);
        }
      }

      setBall({ ...ball });
    }

    // Draw game objects
    gameLogicRef.current.drawPaddle(ctx, paddles[0]);
    gameLogicRef.current.drawPaddle(ctx, paddles[1]);
    gameLogicRef.current.drawBall(ctx, ball);
    gameLogicRef.current.drawScore(ctx, paddles[0].score, paddles[1].score);

    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, [gameState, dimensions, paddles, ball]);

  // Start/stop game loop
  useEffect(() => {
    if (gameState.isPlaying || ball.x !== 0) {
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameLoop, gameState.isPlaying, ball.x]);

  const startGame = () => {
    if (gameLogicRef.current) {
      const [p1, p2] = gameLogicRef.current.createPaddles();
      const gameBall = gameLogicRef.current.createBall();
      setPaddles([p1, p2] as [Paddle, Paddle]);
      setBall(gameBall);
      setGameState(prev => ({
        ...prev,
        isPlaying: true,
        isPaused: false,
        isGameOver: false,
        winner: null,
      }));
    }
  };

  const pauseGame = () => {
    setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  };

  const resetGame = () => {
    setGameState(prev => ({
      ...prev,
      isPlaying: false,
      isPaused: false,
      isGameOver: false,
      winner: null,
    }));
  };

  const setMode = (mode: 'single' | 'multiplayer') => {
    setGameState(prev => ({ ...prev, mode }));
    resetGame();
  };

  const setDifficulty = (difficulty: 'easy' | 'medium' | 'hard') => {
    setGameState(prev => ({ ...prev, difficulty }));
    if (aiManagerRef.current) {
      aiManagerRef.current.setDifficulty(difficulty);
    }
    resetGame();
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 p-6">
        <div className="mb-6">
          <div className='flex items-start justify-between gap-3 mb-2'>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Ping Pong Game
            </h2>


            {/* Instructions */}
            <div className="text-xs text-right text-gray-600 dark:text-gray-400">
              <p>Player 1 (Blue): W (up) / S (down)</p>
              <p>Player 2 (Red): Arrow Up / Arrow Down</p>
            </div>
          </div>

          {/* Game Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex gap-2">
              <button
                onClick={startGame}
                disabled={gameState.isPlaying && !gameState.isGameOver}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {gameState.isGameOver ? 'New Game' : gameState.isPlaying ? 'Playing' : 'Start Game'}
              </button>
              <button
                onClick={pauseGame}
                disabled={!gameState.isPlaying || gameState.isGameOver}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {gameState.isPaused ? 'Resume' : 'Pause'}
              </button>
              <button
                onClick={resetGame}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Reset
              </button>
            </div>

            <div className="flex gap-2">
              <select
                value={gameState.mode}
                onChange={(e) => setMode(e.target.value as 'single' | 'multiplayer')}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="single">Single Player</option>
                <option value="multiplayer">Multiplayer</option>
              </select>

              {gameState.mode === 'single' && (
                <select
                  value={gameState.difficulty}
                  onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              )}
            </div>
          </div>
        </div>

        {/* Game Canvas */}
        <div className="relative flex justify-center">
          <canvas
            ref={canvasRef}
            width={dimensions.width}
            height={dimensions.height}
            className="border-2 border-gray-300 dark:border-gray-600 rounded-lg max-w-full"
          />
        </div>

        {/* Game Over Overlay */}
        {gameState.isGameOver && (
          <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center rounded-lg" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
            <div className="text-center text-white">
              <h3 className="text-3xl font-bold mb-4">Game Over!</h3>
              <p className="text-xl mb-6">
                {gameState.winner === 'player1' ? 'Player 1' : 'Player 2'} Wins!
              </p>
              <button
                onClick={startGame}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}