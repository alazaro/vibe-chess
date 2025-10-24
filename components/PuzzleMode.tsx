'use client';

import { useState, useEffect } from 'react';
import { Chess } from 'chess.js';
import type { Square } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { useGameStore } from '@/store/gameStore';
import { chessPuzzles } from '@/lib/puzzles';
import type { ChessPuzzle } from '@/types';

export default function PuzzleMode() {
  const { gameMode, setGameMode, boardTheme } = useGameStore();
  const [currentPuzzle, setCurrentPuzzle] = useState<ChessPuzzle | null>(null);
  const [puzzleGame, setPuzzleGame] = useState<Chess>(new Chess());
  const [moveIndex, setMoveIndex] = useState(0);
  const [status, setStatus] = useState<'playing' | 'correct' | 'wrong'>('playing');
  const [message, setMessage] = useState('');
  const [showSolution, setShowSolution] = useState(false);

  useEffect(() => {
    if (gameMode === 'puzzle' && !currentPuzzle) {
      loadRandomPuzzle();
    }
  }, [gameMode]);

  const loadRandomPuzzle = () => {
    const puzzle = chessPuzzles[Math.floor(Math.random() * chessPuzzles.length)];
    const game = new Chess(puzzle.fen);
    setPuzzleGame(game);
    setCurrentPuzzle(puzzle);
    setMoveIndex(0);
    setStatus('playing');
    setMessage(puzzle.description);
    setShowSolution(false);
  };

  const handlePieceDrop = ({ sourceSquare, targetSquare }: any): boolean => {
    if (!currentPuzzle || status !== 'playing') return false;

    // If piece dropped on same square, don't count as a move
    if (sourceSquare === targetSquare) {
      return false;
    }

    const expectedMove = currentPuzzle.moves[moveIndex];
    const userMove = `${sourceSquare}${targetSquare}`;

    // Check if the move matches the expected move
    if (userMove === expectedMove.substring(0, 4)) {
      try {
        const promotion = expectedMove.length > 4 ? expectedMove[4] : undefined;
        const move = puzzleGame.move({
          from: sourceSquare,
          to: targetSquare,
          promotion,
        });

        if (move) {
          const newGame = new Chess(puzzleGame.fen());
          setPuzzleGame(newGame);
          const newMoveIndex = moveIndex + 1;
          setMoveIndex(newMoveIndex);

          // Check if puzzle is complete
          if (newMoveIndex >= currentPuzzle.moves.length) {
            setStatus('correct');
            setMessage('🎉 Puzzle solved! Great job!');
          } else {
            setMessage('✓ Correct! Continue...');

            // Automatically play opponent's response after a short delay
            setTimeout(() => {
              if (newMoveIndex < currentPuzzle.moves.length) {
                const opponentMove = currentPuzzle.moves[newMoveIndex];
                const from = opponentMove.substring(0, 2) as Square;
                const to = opponentMove.substring(2, 4) as Square;
                const promo = opponentMove.length > 4 ? opponentMove[4] : undefined;

                try {
                  newGame.move({ from, to, promotion: promo });
                  setPuzzleGame(new Chess(newGame.fen()));
                  setMoveIndex(newMoveIndex + 1);

                  // Check if that was the last move
                  if (newMoveIndex + 1 >= currentPuzzle.moves.length) {
                    setStatus('correct');
                    setMessage('🎉 Puzzle solved! Great job!');
                  }
                } catch (error) {
                  console.error('Error playing opponent move:', error);
                }
              }
            }, 500);
          }
          return true;
        }
      } catch (error) {
        setStatus('wrong');
        setMessage('❌ Incorrect move. Try again!');
        return false;
      }
    }

    setStatus('wrong');
    setMessage('❌ Incorrect move. Try again!');
    return false;
  };

  const handleReset = () => {
    if (currentPuzzle) {
      const game = new Chess(currentPuzzle.fen);
      setPuzzleGame(game);
      setMoveIndex(0);
      setStatus('playing');
      setMessage(currentPuzzle.description);
      setShowSolution(false);
    }
  };

  const handleNewPuzzle = () => {
    loadRandomPuzzle();
  };

  const handleBackToMenu = () => {
    setCurrentPuzzle(null);
    setGameMode('menu');
  };

  const toggleSolution = () => {
    setShowSolution(!showSolution);
  };

  // Convert move notation to readable format (e.g., "e2e4" -> "e2-e4")
  const formatMove = (move: string) => {
    return `${move.substring(0, 2)}-${move.substring(2, 4)}${move.length > 4 ? '=' + move[4].toUpperCase() : ''}`;
  };

  if (gameMode !== 'puzzle') return null;

  const getStatusColor = () => {
    switch (status) {
      case 'correct':
        return 'bg-emerald-100 dark:bg-emerald-900/30 border-emerald-400 dark:border-emerald-700 text-stone-800 dark:text-stone-100';
      case 'wrong':
        return 'bg-red-100 dark:bg-red-900/30 border-red-400 dark:border-red-700 text-stone-800 dark:text-stone-100';
      default:
        return 'bg-blue-100 dark:bg-blue-900/30 border-blue-400 dark:border-blue-700 text-stone-800 dark:text-stone-100';
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-900 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-stone-50 dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 rounded-lg shadow-2xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-serif font-light text-stone-800 dark:text-stone-100">
              Puzzles
            </h1>
            <button
              onClick={handleBackToMenu}
              className="px-4 py-2 bg-stone-200 dark:bg-stone-700 border-2 border-stone-300 dark:border-stone-600 text-stone-700 dark:text-stone-300 rounded font-light hover:bg-stone-300 dark:hover:bg-stone-600 transition-colors"
            >
              Menu
            </button>
          </div>

          {currentPuzzle && (
            <>
              {/* Status Message */}
              <div className={`${getStatusColor()} border-2 px-6 py-4 rounded shadow mb-6`}>
                <p className="text-lg font-serif font-light text-center">{message}</p>
              </div>

              {/* Puzzle Info */}
              <div className="mb-6 p-4 bg-white dark:bg-stone-700/50 border border-stone-200 dark:border-stone-600 rounded">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-light text-stone-600 dark:text-stone-400">Difficulty</p>
                    <p className="text-lg font-serif text-stone-800 dark:text-stone-100 capitalize">
                      {currentPuzzle.difficulty}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-light text-stone-600 dark:text-stone-400">Progress</p>
                    <p className="text-lg font-serif text-stone-800 dark:text-stone-100">
                      {moveIndex} / {currentPuzzle.moves.length}
                    </p>
                  </div>
                </div>
              </div>

              {/* Chessboard */}
              <div className="mb-6">
                <Chessboard
                  options={{
                    id: 'puzzle-board',
                    position: puzzleGame.fen(),
                    onPieceDrop: handlePieceDrop,
                    boardOrientation: 'white',
                    allowDragging: status === 'playing',
                  }}
                />
              </div>

              {/* Solution Display */}
              {showSolution && (
                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-300 dark:border-blue-700 rounded">
                  <h3 className="text-lg font-serif font-medium text-stone-800 dark:text-stone-100 mb-2">
                    Solution
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {currentPuzzle.moves.map((move, index) => (
                      <span
                        key={index}
                        className={`px-3 py-1 rounded text-sm font-light ${
                          index < moveIndex
                            ? 'bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100'
                            : 'bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300'
                        }`}
                      >
                        {index + 1}. {formatMove(move)}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Controls */}
              <div className="flex gap-3 mb-3">
                <button
                  onClick={handleReset}
                  className="flex-1 px-4 py-3 bg-amber-100 dark:bg-amber-900/30 border-2 border-amber-400 dark:border-amber-700 text-stone-800 dark:text-stone-100 rounded font-light hover:bg-amber-200 dark:hover:bg-amber-900/40 transition-colors"
                >
                  Reset
                </button>
                <button
                  onClick={handleNewPuzzle}
                  className="flex-1 px-4 py-3 bg-emerald-100 dark:bg-emerald-900/30 border-2 border-emerald-400 dark:border-emerald-700 text-stone-800 dark:text-stone-100 rounded font-light hover:bg-emerald-200 dark:hover:bg-emerald-900/40 transition-colors"
                >
                  Next Puzzle
                </button>
              </div>

              {/* Solution Toggle Button */}
              <button
                onClick={toggleSolution}
                className="w-full px-4 py-3 bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-400 dark:border-blue-700 text-stone-800 dark:text-stone-100 rounded font-light hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-colors"
              >
                {showSolution ? '🔒 Hide Solution' : '💡 Show Solution'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
