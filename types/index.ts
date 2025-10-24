import type { Square } from 'chess.js';

export type GameMode = 'menu' | 'local' | 'ai' | 'online' | 'puzzle' | 'coach';

export type AIDifficulty = 'easy' | 'medium' | 'hard' | 'expert';

export type BoardTheme = 'classic' | 'modern' | 'minimalist';

export interface MoveHistoryItem {
  moveNumber: number;
  white?: string;
  black?: string;
  fen: string;
}

export interface ChessPuzzle {
  id: string;
  fen: string;
  moves: string[];
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'master';
}

export interface MoveEvaluation {
  classification: 'excellent' | 'good' | 'inaccuracy' | 'mistake' | 'blunder';
  evaluation: number;
  bestMove: string;
  yourMove: string;
}

export interface OnlineGameState {
  gameId: string;
  players: {
    white: string;
    black: string;
  };
  currentTurn: 'w' | 'b';
  fen: string;
}
