'use client';

import { useGameStore } from '@/store/gameStore';
import { boardThemes } from '@/lib/constants';

export default function MoveHistory() {
  const { moveHistory, currentMoveIndex, goToMove, gameMode } = useGameStore();

  if (gameMode === 'menu') return null;

  return (
    <div className="bg-stone-50 dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 rounded-lg shadow p-4 h-full overflow-y-auto">
      <h2 className="text-xl font-serif font-light mb-4 text-stone-800 dark:text-stone-100">Moves</h2>

      {moveHistory.length === 0 ? (
        <p className="text-stone-500 dark:text-stone-400 text-sm font-light">No moves yet</p>
      ) : (
        <div className="space-y-1">
          {moveHistory.map((move, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 p-2 rounded cursor-pointer transition-colors ${
                index === currentMoveIndex
                  ? 'bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800'
                  : 'hover:bg-stone-100 dark:hover:bg-stone-700/50'
              }`}
              onClick={() => goToMove(index)}
            >
              <span className="font-serif text-stone-600 dark:text-stone-400 w-8">
                {move.moveNumber}.
              </span>
              <div className="flex gap-4 flex-1">
                {move.white && (
                  <span className="font-mono text-sm text-stone-800 dark:text-stone-100 flex-1">
                    {move.white}
                  </span>
                )}
                {move.black && (
                  <span className="font-mono text-sm text-stone-800 dark:text-stone-100 flex-1">
                    {move.black}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
