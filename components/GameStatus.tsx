'use client';

import { useGameStore } from '@/store/gameStore';

export default function GameStatus() {
  const { gameStatus, gameMode } = useGameStore();

  if (gameMode === 'menu') return null;

  return (
    <div className="bg-stone-50 dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-100 px-6 py-4 rounded-lg shadow">
      <p className="text-lg font-serif font-light text-center">{gameStatus}</p>
    </div>
  );
}
