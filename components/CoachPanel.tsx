'use client';

import { useGameStore } from '@/store/gameStore';
import type { MoveEvaluation } from '@/types';

export default function CoachPanel() {
  const { coachEnabled, lastMoveEvaluation, showHint, hintMove } = useGameStore();

  if (!coachEnabled) return null;

  const getEvaluationColor = (classification: MoveEvaluation['classification']) => {
    switch (classification) {
      case 'excellent':
        return 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800';
      case 'good':
        return 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800';
      case 'inaccuracy':
        return 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800';
      case 'mistake':
        return 'text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/30 border-orange-200 dark:border-orange-800';
      case 'blunder':
        return 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800';
      default:
        return 'text-stone-700 dark:text-stone-400 bg-stone-50 dark:bg-stone-900/30 border-stone-200 dark:border-stone-800';
    }
  };

  return (
    <div className="bg-stone-50 dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 rounded-lg shadow p-4">
      <h2 className="text-xl font-serif font-light mb-4 text-stone-800 dark:text-stone-100">
        Analysis
      </h2>

      {lastMoveEvaluation ? (
        <div className={`p-4 rounded border-2 ${getEvaluationColor(lastMoveEvaluation.classification)}`}>
          <h3 className="font-serif font-light text-lg capitalize mb-3">{lastMoveEvaluation.classification}</h3>

          <div className="space-y-2 text-sm font-light">
            <div>
              <span className="font-serif">Your move:</span>
              <span className="ml-2 font-mono">{lastMoveEvaluation.yourMove}</span>
            </div>

            <div>
              <span className="font-serif">Best move:</span>
              <span className="ml-2 font-mono">{lastMoveEvaluation.bestMove}</span>
            </div>

            <div>
              <span className="font-serif">Evaluation:</span>
              <span className="ml-2">
                {lastMoveEvaluation.evaluation > 0 ? '+' : ''}
                {lastMoveEvaluation.evaluation.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-stone-500 dark:text-stone-400 text-sm font-light">Make a move to see analysis</p>
      )}

      {showHint && hintMove && (
        <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/30 rounded border-2 border-purple-200 dark:border-purple-800">
          <h3 className="font-serif font-light text-purple-800 dark:text-purple-300 mb-2">Hint</h3>
          <p className="text-sm font-light text-purple-700 dark:text-purple-400">
            Best move: <span className="font-mono">{hintMove}</span>
          </p>
        </div>
      )}
    </div>
  );
}
