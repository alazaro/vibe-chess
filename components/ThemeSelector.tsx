'use client';

import { useGameStore } from '@/store/gameStore';
import type { BoardTheme } from '@/types';
import { boardThemes } from '@/lib/constants';

export default function ThemeSelector() {
  const { boardTheme, setBoardTheme, gameMode } = useGameStore();

  if (gameMode === 'menu') return null;

  return (
    <div className="flex gap-3 items-center justify-center">
      <span className="text-sm font-serif font-light text-stone-700 dark:text-stone-300">Theme:</span>
      <div className="flex gap-2">
        {(Object.keys(boardThemes) as BoardTheme[]).map((theme) => (
          <button
            key={theme}
            onClick={() => setBoardTheme(theme)}
            className={`px-4 py-2 rounded text-sm font-light transition-all border-2 ${
              boardTheme === theme
                ? 'bg-amber-100 dark:bg-amber-900/30 border-amber-400 dark:border-amber-700 text-stone-800 dark:text-stone-100'
                : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-600 text-stone-700 dark:text-stone-300 hover:border-stone-300 dark:hover:border-stone-500'
            }`}
          >
            {boardThemes[theme].name}
          </button>
        ))}
      </div>
    </div>
  );
}
