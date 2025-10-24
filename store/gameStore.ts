import { create } from 'zustand';
import { Chess } from 'chess.js';
import type { Square } from 'chess.js';
import type { GameMode, AIDifficulty, BoardTheme, MoveHistoryItem, MoveEvaluation } from '@/types';

interface GameState {
  // Core game state
  game: Chess;
  gameMode: GameMode;
  boardTheme: BoardTheme;

  // Game status
  selectedSquare: Square | null;
  moveFrom: Square | null;
  legalMoves: Square[];
  gameStatus: string;
  winner: 'white' | 'black' | 'draw' | null;

  // Move history
  moveHistory: MoveHistoryItem[];
  currentMoveIndex: number;

  // AI mode
  aiDifficulty: AIDifficulty;
  isAiThinking: boolean;

  // Coach mode
  coachEnabled: boolean;
  lastMoveEvaluation: MoveEvaluation | null;
  showHint: boolean;
  hintMove: string | null;

  // Online mode
  playerColor: 'w' | 'b' | null;
  onlineGameId: string | null;
  isSearchingForMatch: boolean;

  // Actions
  setGameMode: (mode: GameMode) => void;
  setBoardTheme: (theme: BoardTheme) => void;
  setAIDifficulty: (difficulty: AIDifficulty) => void;
  makeMove: (from: Square, to: Square, promotion?: string) => boolean;
  selectSquare: (square: Square | null) => void;
  resetGame: () => void;
  setCoachEnabled: (enabled: boolean) => void;
  setMoveEvaluation: (evaluation: MoveEvaluation | null) => void;
  setHintMove: (move: string | null) => void;
  setShowHint: (show: boolean) => void;
  goToMove: (index: number) => void;
  setPlayerColor: (color: 'w' | 'b' | null) => void;
  setOnlineGameId: (id: string | null) => void;
  setIsSearchingForMatch: (searching: boolean) => void;
  updateGameFromFen: (fen: string) => void;
}

const createNewGame = () => new Chess();

const updateGameStatus = (game: Chess): string => {
  if (game.isCheckmate()) {
    return game.turn() === 'w' ? 'Black wins by checkmate!' : 'White wins by checkmate!';
  }
  if (game.isStalemate()) {
    return 'Draw by stalemate';
  }
  if (game.isThreefoldRepetition()) {
    return 'Draw by threefold repetition';
  }
  if (game.isInsufficientMaterial()) {
    return 'Draw by insufficient material';
  }
  if (game.isDraw()) {
    return 'Draw';
  }
  if (game.isCheck()) {
    return game.turn() === 'w' ? 'White is in check' : 'Black is in check';
  }
  return game.turn() === 'w' ? "White's turn" : "Black's turn";
};

const buildMoveHistory = (game: Chess): MoveHistoryItem[] => {
  const history = game.history();
  const moveHistory: MoveHistoryItem[] = [];

  // Create a temporary game to track FENs
  const tempGame = new Chess();

  for (let i = 0; i < history.length; i += 2) {
    const moveNumber = Math.floor(i / 2) + 1;
    const whiteMove = history[i];
    const blackMove = history[i + 1];

    // Play white's move to get FEN
    tempGame.move(whiteMove);
    const whiteFen = tempGame.fen();

    // Play black's move if it exists
    let blackFen = whiteFen;
    if (blackMove) {
      tempGame.move(blackMove);
      blackFen = tempGame.fen();
    }

    moveHistory.push({
      moveNumber,
      white: whiteMove,
      black: blackMove,
      fen: blackFen, // Store FEN after both moves (or just white if no black move)
    });
  }

  return moveHistory;
};

export const useGameStore = create<GameState>((set, get) => ({
  // Initial state
  game: createNewGame(),
  gameMode: 'menu',
  boardTheme: 'classic',
  selectedSquare: null,
  moveFrom: null,
  legalMoves: [],
  gameStatus: "White's turn",
  winner: null,
  moveHistory: [],
  currentMoveIndex: -1,
  aiDifficulty: 'medium',
  isAiThinking: false,
  coachEnabled: false,
  lastMoveEvaluation: null,
  showHint: false,
  hintMove: null,
  playerColor: null,
  onlineGameId: null,
  isSearchingForMatch: false,

  // Actions
  setGameMode: (mode) => set({ gameMode: mode }),

  setBoardTheme: (theme) => set({ boardTheme: theme }),

  setAIDifficulty: (difficulty) => set({ aiDifficulty: difficulty }),

  makeMove: (from, to, promotion = 'q') => {
    const { game } = get();

    try {
      const move = game.move({
        from,
        to,
        promotion,
      });

      if (move) {
        const gameStatus = updateGameStatus(game);
        const moveHistory = buildMoveHistory(game);

        let winner: 'white' | 'black' | 'draw' | null = null;
        if (game.isCheckmate()) {
          winner = game.turn() === 'w' ? 'black' : 'white';
        } else if (game.isDraw() || game.isStalemate() || game.isThreefoldRepetition() || game.isInsufficientMaterial()) {
          winner = 'draw';
        }

        set({
          game: new Chess(game.fen()),
          gameStatus,
          winner,
          moveHistory,
          currentMoveIndex: moveHistory.length - 1,
          selectedSquare: null,
          moveFrom: null,
          legalMoves: [],
        });

        return true;
      }
    } catch (error) {
      console.error('Invalid move:', error);
    }

    return false;
  },

  selectSquare: (square) => {
    const { game, selectedSquare } = get();

    if (!square) {
      set({ selectedSquare: null, moveFrom: null, legalMoves: [] });
      return;
    }

    // If a square is already selected, try to move
    if (selectedSquare) {
      const moved = get().makeMove(selectedSquare, square);
      if (!moved) {
        // If move failed, select the new square
        const moves = game.moves({ square, verbose: true });
        const legalMoves = moves.map((move) => move.to);
        set({ selectedSquare: square, moveFrom: square, legalMoves });
      }
    } else {
      // Select the square and show legal moves
      const moves = game.moves({ square, verbose: true });
      const legalMoves = moves.map((move) => move.to);
      set({ selectedSquare: square, moveFrom: square, legalMoves });
    }
  },

  resetGame: () => {
    const newGame = createNewGame();
    set({
      game: newGame,
      selectedSquare: null,
      moveFrom: null,
      legalMoves: [],
      gameStatus: "White's turn",
      winner: null,
      moveHistory: [],
      currentMoveIndex: -1,
      isAiThinking: false,
      lastMoveEvaluation: null,
      showHint: false,
      hintMove: null,
    });
  },

  setCoachEnabled: (enabled) => set({ coachEnabled: enabled }),

  setMoveEvaluation: (evaluation) => set({ lastMoveEvaluation: evaluation }),

  setHintMove: (move) => set({ hintMove: move }),

  setShowHint: (show) => set({ showHint: show }),

  goToMove: (index) => {
    const { moveHistory } = get();
    if (index < 0 || index >= moveHistory.length) return;

    // Reconstruct the game up to this move
    const newGame = createNewGame();
    const moves = [];

    for (let i = 0; i <= index; i++) {
      const moveItem = moveHistory[i];
      if (moveItem.white) moves.push(moveItem.white);
      if (i === index && !moveItem.black) break;
      if (moveItem.black) moves.push(moveItem.black);
    }

    // Play through the moves
    for (const move of moves) {
      newGame.move(move);
    }

    set({
      game: new Chess(newGame.fen()),
      currentMoveIndex: index,
      gameStatus: updateGameStatus(newGame),
    });
  },

  setPlayerColor: (color) => set({ playerColor: color }),

  setOnlineGameId: (id) => set({ onlineGameId: id }),

  setIsSearchingForMatch: (searching) => set({ isSearchingForMatch: searching }),

  updateGameFromFen: (fen) => {
    const newGame = new Chess(fen);
    const gameStatus = updateGameStatus(newGame);
    const moveHistory = buildMoveHistory(newGame);

    set({
      game: newGame,
      gameStatus,
      moveHistory,
      currentMoveIndex: moveHistory.length - 1,
    });
  },
}));
