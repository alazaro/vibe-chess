'use client';

import { useEffect, useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { io, Socket } from 'socket.io-client';
import type { Square } from 'chess.js';

let socket: Socket | null = null;

export default function OnlineGame() {
  const {
    gameMode,
    setPlayerColor,
    setOnlineGameId,
    setIsSearchingForMatch,
    isSearchingForMatch,
    onlineGameId,
    playerColor,
    game,
    makeMove,
    updateGameFromFen,
    resetGame,
    moveCounter,
    lastLocalMove, // Get the last move made locally
  } = useGameStore();

  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');

  useEffect(() => {
    if (gameMode === 'online') {
      // Initialize socket connection
      if (!socket) {
        socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001');

        socket.on('connect', () => {
          setConnectionStatus('connected');
        });

        socket.on('disconnect', () => {
          setConnectionStatus('disconnected');
        });

        socket.on('matchFound', ({ gameId, color }: { gameId: string; color: 'w' | 'b' }) => {
          setOnlineGameId(gameId);
          setPlayerColor(color);
          setIsSearchingForMatch(false);
          resetGame();
        });

        socket.on('moveMade', ({ fen, move }: { fen: string; move: string }) => {
          console.log('Received move from server:', move, 'FEN:', fen);
          updateGameFromFen(fen, move);
        });

        socket.on('gameOver', ({ reason }: { reason: string }) => {
          alert(`Game Over: ${reason}`);
        });

        socket.on('opponentDisconnected', () => {
          alert('Your opponent disconnected. You win!');
          setOnlineGameId(null);
          setPlayerColor(null);
        });
      }
    }

    return () => {
      if (socket && gameMode !== 'online') {
        socket.disconnect();
        socket = null;
      }
    };
  }, [gameMode]);

  const handleFindMatch = () => {
    if (socket) {
      socket.emit('findMatch');
      setIsSearchingForMatch(true);
    }
  };

  const handleCancelSearch = () => {
    if (socket) {
      socket.emit('cancelSearch');
      setIsSearchingForMatch(false);
    }
  };

  // Send moves to server when made locally
  useEffect(() => {
    console.log('Move effect triggered:', {
      onlineGameId,
      hasSocket: !!socket,
      moveCounter,
      playerColor,
      currentTurn: game.turn(),
      lastLocalMove
    });

    if (!onlineGameId || !socket || !playerColor) {
      console.log('Skipping - missing required values');
      return;
    }

    // Only send if we have a local move to send
    if (lastLocalMove) {
      console.log('✓ Sending move to server:', lastLocalMove);
      socket.emit('makeMove', {
        gameId: onlineGameId,
        move: lastLocalMove,
      });
    } else {
      console.log('✗ No local move to send (move was from server)');
    }
  }, [moveCounter]); // Trigger on moveCounter change

  if (connectionStatus === 'connecting') {
    return (
      <div className="text-center py-8">
        <p className="text-stone-800 dark:text-stone-100 text-lg font-light">Connecting to server...</p>
      </div>
    );
  }

  if (connectionStatus === 'disconnected') {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 dark:text-red-400 text-lg font-light">Disconnected from server</p>
        <p className="text-stone-600 dark:text-stone-400 text-sm mt-2 font-light">Please check if the server is running on port 3001</p>
      </div>
    );
  }

  if (!onlineGameId) {
    return (
      <div className="text-center py-8">
        {isSearchingForMatch ? (
          <div>
            <p className="text-stone-800 dark:text-stone-100 text-lg font-light mb-4">Searching for opponent...</p>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-400 dark:border-stone-600 mx-auto mb-4"></div>
            <button
              onClick={handleCancelSearch}
              className="px-6 py-3 bg-red-100 dark:bg-red-900/30 border-2 border-red-400 dark:border-red-700 text-stone-800 dark:text-stone-100 rounded font-light hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors"
            >
              Cancel Search
            </button>
          </div>
        ) : (
          <button
            onClick={handleFindMatch}
            className="px-8 py-4 bg-emerald-100 dark:bg-emerald-900/30 border-2 border-emerald-400 dark:border-emerald-700 text-stone-800 dark:text-stone-100 rounded text-xl font-light hover:bg-emerald-200 dark:hover:bg-emerald-900/40 transition-colors"
          >
            Find Match
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="text-center py-4">
      <p className="text-stone-800 dark:text-stone-100 text-lg font-serif font-light">
        Playing as {playerColor === 'w' ? 'White ♔' : 'Black ♚'}
      </p>
      <p className="text-stone-600 dark:text-stone-400 text-sm font-light">Game ID: {onlineGameId}</p>
    </div>
  );
}
