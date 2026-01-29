import type { Controls, GameDimensions } from './types';

export class ControlsManager {
  private controls: Controls = {
    player1: { up: false, down: false },
    player2: { up: false, down: false },
  };

  private canvas: HTMLCanvasElement | null = null;
  private touchStartY: number | null = null;
  private touchPlayer: 'player1' | 'player2' | null = null;

  constructor(canvas: HTMLCanvasElement | null = null) {
    this.canvas = canvas;
    this.setupKeyboardControls();
    this.setupTouchControls();
  }

  private setupKeyboardControls(): void {
    const handleKeyDown = (e: KeyboardEvent): void => {
      switch (e.key.toLowerCase()) {
        case 'w':
          this.controls.player1.up = true;
          e.preventDefault();
          break;
        case 's':
          this.controls.player1.down = true;
          e.preventDefault();
          break;
        case 'arrowup':
          this.controls.player2.up = true;
          e.preventDefault();
          break;
        case 'arrowdown':
          this.controls.player2.down = true;
          e.preventDefault();
          break;
        case ' ':
        case 'p':
          // Handle pause (will be managed by parent component)
          e.preventDefault();
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent): void => {
      switch (e.key.toLowerCase()) {
        case 'w':
          this.controls.player1.up = false;
          break;
        case 's':
          this.controls.player1.down = false;
          break;
        case 'arrowup':
          this.controls.player2.up = false;
          break;
        case 'arrowdown':
          this.controls.player2.down = false;
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
  }

  private setupTouchControls(): void {
    if (!this.canvas) return;

    const handleTouchStart = (e: TouchEvent): void => {
      e.preventDefault();
      const touch = e.touches[0];
      const rect = this.canvas!.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;

      this.touchStartY = y;
      this.touchPlayer = x < rect.width / 2 ? 'player1' : 'player2';
    };

    const handleTouchMove = (e: TouchEvent): void => {
      e.preventDefault();
      if (this.touchStartY === null || !this.touchPlayer) return;

      const touch = e.touches[0];
      const currentY = touch.clientY - (this.canvas!.getBoundingClientRect().top);
      const deltaY = currentY - this.touchStartY;

      if (this.touchPlayer === 'player1') {
        this.controls.player1.up = deltaY < -10;
        this.controls.player1.down = deltaY > 10;
      } else {
        this.controls.player2.up = deltaY < -10;
        this.controls.player2.down = deltaY > 10;
      }

      this.touchStartY = currentY;
    };

    const handleTouchEnd = (e: TouchEvent): void => {
      e.preventDefault();
      if (this.touchPlayer) {
        this.controls[this.touchPlayer].up = false;
        this.controls[this.touchPlayer].down = false;
      }
      this.touchStartY = null;
      this.touchPlayer = null;
    };

    // Mouse controls for desktop
    const handleMouseDown = (e: MouseEvent): void => {
      const rect = this.canvas!.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      this.touchStartY = y;
      this.touchPlayer = x < rect.width / 2 ? 'player1' : 'player2';
    };

    const handleMouseMove = (e: MouseEvent): void => {
      if (this.touchStartY === null || !this.touchPlayer) return;
      if (e.buttons !== 1) return; // Only if mouse button is pressed

      const rect = this.canvas!.getBoundingClientRect();
      const currentY = e.clientY - rect.top;
      const deltaY = currentY - this.touchStartY;

      if (this.touchPlayer === 'player1') {
        this.controls.player1.up = deltaY < -10;
        this.controls.player1.down = deltaY > 10;
      } else {
        this.controls.player2.up = deltaY < -10;
        this.controls.player2.down = deltaY > 10;
      }

      this.touchStartY = currentY;
    };

    const handleMouseUp = (e: MouseEvent): void => {
      if (this.touchPlayer) {
        this.controls[this.touchPlayer].up = false;
        this.controls[this.touchPlayer].down = false;
      }
      this.touchStartY = null;
      this.touchPlayer = null;
    };

    this.canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    this.canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    this.canvas.addEventListener('touchend', handleTouchEnd, { passive: false });
    this.canvas.addEventListener('mousedown', handleMouseDown);
    this.canvas.addEventListener('mousemove', handleMouseMove);
    this.canvas.addEventListener('mouseup', handleMouseUp);
    this.canvas.addEventListener('mouseleave', handleMouseUp);
  }

  getControls(): Controls {
    return this.controls;
  }

  resetControls(): void {
    this.controls = {
      player1: { up: false, down: false },
      player2: { up: false, down: false },
    };
  }

  cleanup(): void {
    // Note: In a real implementation, you'd want to store the event listeners
    // and remove them properly here to prevent memory leaks
    // This is a simplified version for demonstration
  }
}