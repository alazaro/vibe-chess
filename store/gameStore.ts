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
  moveCounter: number; // Used to trigger effects when moves are made
  lastLocalMove: { from: string; to: string; promotion?: string } | null; // Last move made locally

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
  updateGameFromFen: (fen: string, moveNotation?: string) => void;
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
  const history = game.history({ verbose: true });
  const moveHistory: MoveHistoryItem[] = [];

  // If history is empty (e.g., game created from FEN), return empty array
  if (history.length === 0) {
    return moveHistory;
  }

  // Process moves in pairs (white + black)
  for (let i = 0; i < history.length; i += 2) {
    const moveNumber = Math.floor(i / 2) + 1;
    const whiteMove = history[i];
    const blackMove = history[i + 1];

    // Get the FEN after the black move (or white move if no black move)
    // We can get this from the move's 'after' field or from the current position
    const fen = blackMove ? blackMove.after : whiteMove.after;

    moveHistory.push({
      moveNumber,
      white: whiteMove.san,
      black: blackMove?.san,
      fen: fen,
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
  moveCounter: 0,
  lastLocalMove: null,

  // Actions
  setGameMode: (mode) => set({ gameMode: mode }),

  setBoardTheme: (theme) => set({ boardTheme: theme }),

  setAIDifficulty: (difficulty) => set({ aiDifficulty: difficulty }),

  makeMove: (from, to, promotion = 'q') => {
    const { game, gameMode, playerColor } = get();

    // In online mode, validate that the player can only move their own pieces
    if (gameMode === 'online' && playerColor) {
      const piece = game.get(from);
      if (!piece || piece.color !== playerColor || game.turn() !== playerColor) {
        console.log('Move rejected: not your piece or not your turn');
        return false;
      }
    }

    try {
      const move = game.move({
        from,
        to,
        promotion,
      });

      if (move) {
        const gameStatus = updateGameStatus(game);
        const newFen = game.fen();

        // In online mode, append to existing history instead of rebuilding
        let moveHistory: MoveHistoryItem[];
        if (gameMode === 'online') {
          const { moveHistory: existingHistory } = get();
          moveHistory = [...existingHistory];

          const totalMoves = game.history().length;
          const moveNumber = Math.ceil(totalMoves / 2);
          const isWhiteMove = totalMoves % 2 === 1;

          if (isWhiteMove) {
            // White's move - create new entry
            moveHistory.push({
              moveNumber,
              white: move.san,
              black: undefined,
              fen: newFen,
            });
          } else {
            // Black's move - update last entry
            if (moveHistory.length > 0) {
              const lastEntry = moveHistory[moveHistory.length - 1];
              moveHistory[moveHistory.length - 1] = {
                ...lastEntry,
                black: move.san,
                fen: newFen,
              };
            } else {
              // Edge case: game started from custom position
              moveHistory.push({
                moveNumber,
                white: '',
                black: move.san,
                fen: newFen,
              });
            }
          }
        } else {
          // For non-online modes, rebuild history normally
          moveHistory = buildMoveHistory(game);
        }

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
          moveCounter: get().moveCounter + 1, // Increment to trigger effects
          lastLocalMove: { from, to, promotion }, // Store the move details
        });

        return true;
      }
    } catch (error) {
      console.error('Invalid move:', error);
    }

    return false;
  },

  selectSquare: (square) => {
    const { game, selectedSquare, gameMode, playerColor } = get();

    if (!square) {
      set({ selectedSquare: null, moveFrom: null, legalMoves: [] });
      return;
    }

    // In online mode, only allow selecting pieces of the player's color and when it's their turn
    if (gameMode === 'online' && playerColor) {
      const piece = game.get(square);

      // If selecting a piece (not moving), check if it's the player's piece and their turn
      if (!selectedSquare && piece) {
        if (piece.color !== playerColor || game.turn() !== playerColor) {
          return; // Ignore selection of opponent's pieces or when it's not player's turn
        }
      }

      // If trying to move, check if it's still the player's turn
      if (selectedSquare && game.turn() !== playerColor) {
        set({ selectedSquare: null, moveFrom: null, legalMoves: [] });
        return;
      }
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
      moveCounter: 0, // Reset move counter
      lastLocalMove: null, // Clear local move
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

  updateGameFromFen: (fen, moveNotation) => {
    const newGame = new Chess(fen);
    const gameStatus = updateGameStatus(newGame);

    // Get existing move history
    const { moveHistory: existingHistory } = get();
    let moveHistory = [...existingHistory];

    // If we have move notation, append it to history
    if (moveNotation) {
      const totalMoves = newGame.history().length;
      const moveNumber = Math.ceil(totalMoves / 2);
      const isWhiteMove = totalMoves % 2 === 1;

      if (isWhiteMove) {
        // White's move - create new entry
        moveHistory.push({
          moveNumber,
          white: moveNotation,
          black: undefined,
          fen: fen,
        });
      } else {
        // Black's move - update last entry
        if (moveHistory.length > 0) {
          const lastEntry = moveHistory[moveHistory.length - 1];
          moveHistory[moveHistory.length - 1] = {
            ...lastEntry,
            black: moveNotation,
            fen: fen,
          };
        } else {
          // Shouldn't happen, but handle edge case
          moveHistory.push({
            moveNumber,
            white: '',
            black: moveNotation,
            fen: fen,
          });
        }
      }
    }

    set({
      game: newGame,
      gameStatus,
      moveHistory,
      currentMoveIndex: moveHistory.length - 1,
      moveCounter: get().moveCounter + 1, // Increment to trigger effects
      lastLocalMove: null, // Clear local move when receiving from server
    });
  },
}));
