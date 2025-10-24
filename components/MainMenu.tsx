'use client';

import { useGameStore } from '@/store/gameStore';

export default function MainMenu() {
  const { gameMode, setGameMode, resetGame } = useGameStore();

  if (gameMode !== 'menu') return null;

  const handleModeSelect = (mode: 'local' | 'ai' | 'online' | 'puzzle') => {
    resetGame();
    setGameMode(mode);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-100 dark:bg-stone-900 p-4">
      <div className="bg-white dark:bg-stone-800 rounded-lg shadow-2xl p-12 max-w-2xl w-full border border-stone-200 dark:border-stone-700">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-serif font-light text-stone-800 dark:text-stone-100 mb-3">
            Chess
          </h1>
          <p className="text-stone-600 dark:text-stone-400 text-lg font-light">
            Play • Learn • Master
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Play vs AI */}
          <button
            onClick={() => handleModeSelect('ai')}
            className="group bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-800 text-stone-800 dark:text-stone-100 rounded-lg p-8 hover:border-amber-400 dark:hover:border-amber-600 transition-all hover:shadow-lg"
          >
            <div className="text-5xl mb-4">♔</div>
            <h2 className="text-2xl font-serif font-light mb-2">vs Computer</h2>
            <p className="text-stone-600 dark:text-stone-400 text-sm font-light">
              Challenge the engine
            </p>
          </button>

          {/* Play vs Friend */}
          <button
            onClick={() => handleModeSelect('local')}
            className="group bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-200 dark:border-emerald-800 text-stone-800 dark:text-stone-100 rounded-lg p-8 hover:border-emerald-400 dark:hover:border-emerald-600 transition-all hover:shadow-lg"
          >
            <div className="text-5xl mb-4">♚</div>
            <h2 className="text-2xl font-serif font-light mb-2">vs Friend</h2>
            <p className="text-stone-600 dark:text-stone-400 text-sm font-light">
              Play locally
            </p>
          </button>

          {/* Play Online */}
          <button
            onClick={() => handleModeSelect('online')}
            className="group bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 text-stone-800 dark:text-stone-100 rounded-lg p-8 hover:border-blue-400 dark:hover:border-blue-600 transition-all hover:shadow-lg"
          >
            <div className="text-5xl mb-4">♕</div>
            <h2 className="text-2xl font-serif font-light mb-2">Online</h2>
            <p className="text-stone-600 dark:text-stone-400 text-sm font-light">
              Find an opponent
            </p>
          </button>

          {/* Puzzle Mode */}
          <button
            onClick={() => handleModeSelect('puzzle')}
            className="group bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-200 dark:border-purple-800 text-stone-800 dark:text-stone-100 rounded-lg p-8 hover:border-purple-400 dark:hover:border-purple-600 transition-all hover:shadow-lg"
          >
            <div className="text-5xl mb-4">♗</div>
            <h2 className="text-2xl font-serif font-light mb-2">Puzzles</h2>
            <p className="text-stone-600 dark:text-stone-400 text-sm font-light">
              Practice tactics
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
