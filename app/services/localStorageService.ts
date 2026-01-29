import type { HighScore } from '../game/types';

const HIGH_SCORES_KEY = 'ping-pong-high-scores';
const MAX_HIGH_SCORES = 10;

export class LocalStorageService {
  // Get high scores from localStorage
  static getHighScores(): HighScore[] {
    try {
      const stored = localStorage.getItem(HIGH_SCORES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading high scores:', error);
      return [];
    }
  }

  // Save high score to localStorage
  static saveHighScore(score: number, opponent: 'ai' | 'player', difficulty: 'easy' | 'medium' | 'hard'): void {
    try {
      const highScores = this.getHighScores();
      const newHighScore: HighScore = {
        score,
        opponent,
        difficulty,
        date: new Date().toISOString(),
      };

      highScores.push(newHighScore);
      
      // Sort by score (descending) and keep only top scores
      highScores.sort((a, b) => b.score - a.score);
      highScores.splice(MAX_HIGH_SCORES);

      localStorage.setItem(HIGH_SCORES_KEY, JSON.stringify(highScores));
    } catch (error) {
      console.error('Error saving high score:', error);
    }
  }

  // Get high scores filtered by opponent and difficulty
  static getFilteredHighScores(opponent?: 'ai' | 'player', difficulty?: 'easy' | 'medium' | 'hard'): HighScore[] {
    const highScores = this.getHighScores();
    
    return highScores.filter(score => {
      if (opponent && score.opponent !== opponent) return false;
      if (difficulty && score.difficulty !== difficulty) return false;
      return true;
    });
  }

  // Clear all high scores
  static clearHighScores(): void {
    try {
      localStorage.removeItem(HIGH_SCORES_KEY);
    } catch (error) {
      console.error('Error clearing high scores:', error);
    }
  }

  // Get top score for specific category
  static getTopScore(opponent: 'ai' | 'player', difficulty: 'easy' | 'medium' | 'hard'): HighScore | null {
    const filtered = this.getFilteredHighScores(opponent, difficulty);
    return filtered.length > 0 ? filtered[0] : null;
  }
}