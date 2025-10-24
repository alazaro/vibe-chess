'use client';

import MainMenu from '@/components/MainMenu';
import PuzzleMode from '@/components/PuzzleMode';
import ChessBoard from '@/components/ChessBoard';
import MoveHistory from '@/components/MoveHistory';
import CoachPanel from '@/components/CoachPanel';
import GameStatus from '@/components/GameStatus';
import GameControls from '@/components/GameControls';
import ThemeSelector from '@/components/ThemeSelector';
import OnlineGame from '@/components/OnlineGame';
import { useGameStore } from '@/store/gameStore';

export default function Home() {
  const { gameMode } = useGameStore();

  // Show main menu
  if (gameMode === 'menu') {
    return <MainMenu />;
  }

  // Show puzzle mode
  if (gameMode === 'puzzle') {
    return <PuzzleMode />;
  }

  // Show main game interface (local, ai, online, coach modes)
  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-light text-stone-800 dark:text-stone-100 text-center mb-6">
            Chess
          </h1>
          <ThemeSelector />
        </div>

        {/* Online Game Matchmaking */}
        {gameMode === 'online' && <OnlineGame />}

        {/* Main Game Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Controls and Coach */}
          <div className="space-y-6">
            <GameControls />
            {gameMode !== 'online' && <CoachPanel />}
          </div>

          {/* Center Column - Board */}
          <div className="space-y-6">
            <GameStatus />
            <ChessBoard />
          </div>

          {/* Right Column - Move History */}
          <div className="h-[600px]">
            <MoveHistory />
          </div>
        </div>
      </div>
    </div>
  );
}
