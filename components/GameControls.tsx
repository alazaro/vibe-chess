'use client';

import { useGameStore } from '@/store/gameStore';
import { aiDifficultySettings } from '@/lib/constants';
import { stockfish } from '@/lib/stockfish';
import type { AIDifficulty } from '@/types';

export default function GameControls() {
  const {
    gameMode,
    resetGame,
    setGameMode,
    coachEnabled,
    setCoachEnabled,
    setShowHint,
    showHint,
    setHintMove,
    game,
    aiDifficulty,
    setAIDifficulty,
  } = useGameStore();

  if (gameMode === 'menu') return null;

  const handleNewGame = () => {
    resetGame();
  };

  const handleBackToMenu = () => {
    resetGame();
    setGameMode('menu');
  };

  const handleGetHint = async () => {
    if (showHint) {
      setShowHint(false);
      setHintMove(null);
    } else {
      try {
        const bestMove = await stockfish.getBestMove(game.fen(), 15);
        setHintMove(bestMove);
        setShowHint(true);
      } catch (error) {
        console.error('Failed to get hint:', error);
      }
    }
  };

  const handleToggleCoach = () => {
    setCoachEnabled(!coachEnabled);
  };

  return (
    <div className="bg-stone-50 dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 rounded-lg shadow p-4">
      <h2 className="text-xl font-serif font-light mb-4 text-stone-800 dark:text-stone-100">Controls</h2>

      <div className="space-y-3">
        {/* AI Difficulty (only for AI mode) */}
        {gameMode === 'ai' && (
          <div className="space-y-2">
            <label className="block text-sm font-serif font-light text-stone-700 dark:text-stone-300">
              Difficulty
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(aiDifficultySettings) as AIDifficulty[]).map((difficulty) => (
                <button
                  key={difficulty}
                  onClick={() => setAIDifficulty(difficulty)}
                  className={`px-3 py-2 rounded text-sm font-light transition-all border-2 ${
                    aiDifficulty === difficulty
                      ? 'bg-amber-100 dark:bg-amber-900/30 border-amber-400 dark:border-amber-700 text-stone-800 dark:text-stone-100'
                      : 'bg-white dark:bg-stone-700 border-stone-200 dark:border-stone-600 text-stone-700 dark:text-stone-300 hover:border-stone-300 dark:hover:border-stone-500'
                  }`}
                >
                  {aiDifficultySettings[difficulty].name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Coach Mode Toggle */}
        {(gameMode === 'ai' || gameMode === 'local') && (
          <button
            onClick={handleToggleCoach}
            className={`w-full px-4 py-2 rounded font-light transition-all border-2 ${
              coachEnabled
                ? 'bg-purple-100 dark:bg-purple-900/30 border-purple-400 dark:border-purple-700 text-stone-800 dark:text-stone-100'
                : 'bg-white dark:bg-stone-700 border-stone-200 dark:border-stone-600 text-stone-700 dark:text-stone-300 hover:border-stone-300 dark:hover:border-stone-500'
            }`}
          >
            {coachEnabled ? 'Coach: ON' : 'Coach: OFF'}
          </button>
        )}

        {/* Hint Button */}
        {coachEnabled && (
          <button
            onClick={handleGetHint}
            className={`w-full px-4 py-2 rounded font-light transition-all border-2 ${
              showHint
                ? 'bg-amber-100 dark:bg-amber-900/30 border-amber-400 dark:border-amber-700 text-stone-800 dark:text-stone-100'
                : 'bg-white dark:bg-stone-700 border-stone-200 dark:border-stone-600 text-stone-700 dark:text-stone-300 hover:border-stone-300 dark:hover:border-stone-500'
            }`}
          >
            {showHint ? 'Hide Hint' : 'Show Hint'}
          </button>
        )}

        {/* New Game Button */}
        <button
          onClick={handleNewGame}
          className="w-full px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 border-2 border-emerald-400 dark:border-emerald-700 text-stone-800 dark:text-stone-100 rounded font-light hover:bg-emerald-200 dark:hover:bg-emerald-900/40 transition-colors"
        >
          New Game
        </button>

        {/* Back to Menu Button */}
        <button
          onClick={handleBackToMenu}
          className="w-full px-4 py-2 bg-stone-200 dark:bg-stone-700 border-2 border-stone-300 dark:border-stone-600 text-stone-700 dark:text-stone-300 rounded font-light hover:bg-stone-300 dark:hover:bg-stone-600 transition-colors"
        >
          Back to Menu
        </button>
      </div>
    </div>
  );
}
