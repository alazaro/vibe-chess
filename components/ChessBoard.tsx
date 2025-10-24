'use client';

import { useEffect, useState, useCallback } from 'react';
import { Chessboard } from 'react-chessboard';
import type { Square } from 'chess.js';
import { useGameStore } from '@/store/gameStore';
import { boardThemes } from '@/lib/constants';
import { stockfish } from '@/lib/stockfish';
import { aiDifficultySettings } from '@/lib/constants';

export default function ChessBoard() {
  const {
    game,
    gameMode,
    boardTheme,
    selectedSquare,
    legalMoves,
    makeMove,
    selectSquare,
    aiDifficulty,
    isAiThinking,
    playerColor,
    coachEnabled,
    setMoveEvaluation,
    hintMove,
    showHint,
  } = useGameStore();

  const [boardOrientation, setBoardOrientation] = useState<'white' | 'black'>('white');
  const [rightClickedSquares, setRightClickedSquares] = useState<Record<string, any>>({});
  const [moveSquares, setMoveSquares] = useState<Record<string, any>>({});
  const [optionSquares, setOptionSquares] = useState<Record<string, any>>({});

  // Initialize Stockfish on mount
  useEffect(() => {
    stockfish.init();
    return () => {
      stockfish.quit();
    };
  }, []);

  // Set board orientation for online games
  useEffect(() => {
    if (gameMode === 'online' && playerColor) {
      setBoardOrientation(playerColor === 'w' ? 'white' : 'black');
    } else {
      setBoardOrientation('white');
    }
  }, [gameMode, playerColor]);

  // AI move logic
  useEffect(() => {
    if (gameMode === 'ai' && game.turn() === 'b' && !game.isGameOver()) {
      const makeAiMove = async () => {
        const settings = aiDifficultySettings[aiDifficulty];
        stockfish.setSkillLevel(settings.skillLevel);

        // Add thinking delay
        await new Promise((resolve) => setTimeout(resolve, settings.thinkTime));

        try {
          const bestMove = await stockfish.getBestMove(game.fen(), settings.depth);

          if (bestMove) {
            const from = bestMove.substring(0, 2) as Square;
            const to = bestMove.substring(2, 4) as Square;
            const promotion = bestMove.length > 4 ? bestMove[4] : undefined;

            makeMove(from, to, promotion);
          }
        } catch (error) {
          console.error('AI move error:', error);
        }
      };

      makeAiMove();
    }
  }, [game, gameMode, aiDifficulty, makeMove]);

  // Coach mode evaluation
  useEffect(() => {
    if (coachEnabled && game.history().length > 0) {
      const evaluateLastMove = async () => {
        try {
          const lastMove = game.history({ verbose: true }).pop();
          if (!lastMove) return;

          // Get the position before the move
          const tempGame = new (game.constructor as any)();
          const moves = game.history();
          moves.pop(); // Remove last move

          for (const move of moves) {
            tempGame.move(move);
          }

          const previousFen = tempGame.fen();

          // Get best move from that position
          const bestMove = await stockfish.getBestMove(previousFen, 15);
          const currentEval = await stockfish.evaluatePosition(game.fen(), 15);

          let classification: any = 'good';
          const evalValue = currentEval.type === 'mate' ?
            (currentEval.value > 0 ? 100 : -100) :
            currentEval.value;

          const yourMoveStr = `${lastMove.from}${lastMove.to}${lastMove.promotion || ''}`;

          if (yourMoveStr === bestMove) {
            classification = 'excellent';
          } else if (Math.abs(evalValue) < 0.5) {
            classification = 'good';
          } else if (Math.abs(evalValue) < 1.5) {
            classification = 'inaccuracy';
          } else if (Math.abs(evalValue) < 3) {
            classification = 'mistake';
          } else {
            classification = 'blunder';
          }

          setMoveEvaluation({
            classification,
            evaluation: evalValue,
            bestMove: `${bestMove.substring(0, 2)}-${bestMove.substring(2, 4)}`,
            yourMove: `${lastMove.from}-${lastMove.to}`,
          });
        } catch (error) {
          console.error('Coach evaluation error:', error);
        }
      };

      evaluateLastMove();
    }
  }, [game.history().length, coachEnabled, setMoveEvaluation]);

  // Handle piece drop
  const onPieceDrop = useCallback(
    ({ sourceSquare, targetSquare }: any) => {
      try {
        // Check if it's a pawn promotion
        const piece = game.get(sourceSquare);
        const isPromotion =
          piece?.type === 'p' &&
          ((piece.color === 'w' && targetSquare[1] === '8') ||
            (piece.color === 'b' && targetSquare[1] === '1'));

        const moved = makeMove(
          sourceSquare,
          targetSquare,
          isPromotion ? 'q' : undefined
        );

        return moved;
      } catch (error) {
        return false;
      }
    },
    [game, makeMove]
  );

  // Handle square click
  const onSquareClickHandler = useCallback(
    ({ square }: any) => {
      selectSquare(square);
    },
    [selectSquare]
  );

  // Handle square right click
  const onSquareRightClickHandler = useCallback(({ square }: any) => {
    setRightClickedSquares((prev) => {
      const newSquares = { ...prev };
      if (newSquares[square]) {
        delete newSquares[square];
      } else {
        newSquares[square] = { backgroundColor: 'rgba(255, 0, 0, 0.4)' };
      }
      return newSquares;
    });
  }, []);

  // Update move squares for last move highlighting
  useEffect(() => {
    const history = game.history({ verbose: true });
    if (history.length > 0) {
      const lastMove = history[history.length - 1];
      setMoveSquares({
        [lastMove.from]: { backgroundColor: boardThemes[boardTheme].lastMoveSquare },
        [lastMove.to]: { backgroundColor: boardThemes[boardTheme].lastMoveSquare },
      });
    } else {
      setMoveSquares({});
    }
  }, [game, boardTheme]);

  // Update option squares for legal moves
  useEffect(() => {
    const squares: Record<string, any> = {};

    if (selectedSquare) {
      squares[selectedSquare] = {
        backgroundColor: boardThemes[boardTheme].selectedSquare,
      };
    }

    legalMoves.forEach((square) => {
      squares[square] = {
        background: `radial-gradient(circle, ${boardThemes[boardTheme].legalMoveIndicator} 25%, transparent 25%)`,
        borderRadius: '50%',
      };
    });

    // Show hint if enabled
    if (showHint && hintMove) {
      const from = hintMove.substring(0, 2);
      const to = hintMove.substring(3, 5);
      squares[from] = {
        backgroundColor: 'rgba(128, 0, 128, 0.4)',
      };
      squares[to] = {
        backgroundColor: 'rgba(128, 0, 128, 0.6)',
      };
    }

    setOptionSquares(squares);
  }, [selectedSquare, legalMoves, boardTheme, showHint, hintMove]);

  // Check highlighting
  useEffect(() => {
    if (game.isCheck()) {
      const kingSquare = game
        .board()
        .flat()
        .find((square) => square?.type === 'k' && square?.color === game.turn())?.square;

      if (kingSquare) {
        setMoveSquares((prev) => ({
          ...prev,
          [kingSquare]: { backgroundColor: boardThemes[boardTheme].checkSquare },
        }));
      }
    }
  }, [game, boardTheme]);

  const theme = boardThemes[boardTheme];

  const customSquareStyles = {
    ...moveSquares,
    ...optionSquares,
    ...rightClickedSquares,
  };

  return (
    <div className="w-full max-w-[600px] mx-auto">
      <Chessboard
        options={{
          id: 'main-board',
          position: game.fen(),
          onPieceDrop: onPieceDrop,
          onSquareClick: onSquareClickHandler,
          onSquareRightClick: onSquareRightClickHandler,
          boardOrientation: boardOrientation,
          boardStyle: {
            borderRadius: '4px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
          darkSquareStyle: { backgroundColor: theme.darkSquare },
          lightSquareStyle: { backgroundColor: theme.lightSquare },
          squareStyles: customSquareStyles,
          allowDragging: !game.isGameOver() && !isAiThinking,
        }}
      />
    </div>
  );
}
