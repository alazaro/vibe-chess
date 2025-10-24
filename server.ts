import { createServer } from 'http';
import { Server } from 'socket.io';
import { Chess } from 'chess.js';

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

interface Player {
  id: string;
  color: 'w' | 'b';
}

interface Game {
  id: string;
  players: {
    white: Player;
    black: Player;
  };
  chess: Chess;
}

const waitingPlayers: string[] = [];
const games: Map<string, Game> = new Map();
const playerGames: Map<string, string> = new Map();

io.on('connection', (socket) => {
  console.log(`Player connected: ${socket.id}`);

  socket.on('findMatch', () => {
    console.log(`Player ${socket.id} looking for match`);

    if (waitingPlayers.length > 0) {
      // Match found
      const opponentId = waitingPlayers.shift()!;
      const gameId = `game-${Date.now()}`;

      // Randomly assign colors
      const player1Color = Math.random() < 0.5 ? 'w' : 'b';
      const player2Color = player1Color === 'w' ? 'b' : 'w';

      const game: Game = {
        id: gameId,
        players: {
          white: {
            id: player1Color === 'w' ? socket.id : opponentId,
            color: 'w',
          },
          black: {
            id: player1Color === 'b' ? socket.id : opponentId,
            color: 'b',
          },
        },
        chess: new Chess(),
      };

      games.set(gameId, game);
      playerGames.set(socket.id, gameId);
      playerGames.set(opponentId, gameId);

      // Notify both players
      io.to(socket.id).emit('matchFound', {
        gameId,
        color: player1Color,
      });

      io.to(opponentId).emit('matchFound', {
        gameId,
        color: player2Color,
      });

      console.log(`Match created: ${gameId} - ${socket.id} vs ${opponentId}`);
    } else {
      // Add to waiting list
      waitingPlayers.push(socket.id);
    }
  });

  socket.on('cancelSearch', () => {
    const index = waitingPlayers.indexOf(socket.id);
    if (index > -1) {
      waitingPlayers.splice(index, 1);
      console.log(`Player ${socket.id} cancelled search`);
    }
  });

  socket.on('makeMove', ({ gameId, move }) => {
    const game = games.get(gameId);
    if (!game) {
      console.log(`Game ${gameId} not found`);
      return;
    }

    try {
      // Validate it's the player's turn
      const currentTurn = game.chess.turn();
      const playerId = socket.id;
      const playerColor =
        game.players.white.id === playerId ? 'w' : game.players.black.id === playerId ? 'b' : null;

      if (playerColor !== currentTurn) {
        console.log(`Player ${playerId} tried to move out of turn (current turn: ${currentTurn}, player color: ${playerColor})`);
        return;
      }

      console.log(`Player ${playerId} (${playerColor}) making move:`, move);

      // Make the move
      const result = game.chess.move(move);
      if (result) {
        const newFen = game.chess.fen();
        console.log(`Move successful, new FEN: ${newFen}`);

        // Broadcast to both players with both FEN and move notation
        io.to(game.players.white.id).emit('moveMade', {
          fen: newFen,
          move: result.san, // Send move in SAN notation
        });
        io.to(game.players.black.id).emit('moveMade', {
          fen: newFen,
          move: result.san, // Send move in SAN notation
        });

        console.log(`Broadcasted move to both players`);

        // Check for game over
        if (game.chess.isGameOver()) {
          let reason = '';
          if (game.chess.isCheckmate()) {
            reason = `Checkmate! ${currentTurn === 'w' ? 'Black' : 'White'} wins!`;
          } else if (game.chess.isDraw()) {
            reason = 'Draw!';
          } else if (game.chess.isStalemate()) {
            reason = 'Stalemate!';
          }

          io.to(game.players.white.id).emit('gameOver', { reason });
          io.to(game.players.black.id).emit('gameOver', { reason });

          // Clean up
          games.delete(gameId);
          playerGames.delete(game.players.white.id);
          playerGames.delete(game.players.black.id);
        }
      } else {
        console.log(`Move failed: chess.js rejected the move`);
      }
    } catch (error) {
      console.error('Invalid move:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log(`Player disconnected: ${socket.id}`);

    // Remove from waiting list
    const waitingIndex = waitingPlayers.indexOf(socket.id);
    if (waitingIndex > -1) {
      waitingPlayers.splice(waitingIndex, 1);
    }

    // Handle game disconnect
    const gameId = playerGames.get(socket.id);
    if (gameId) {
      const game = games.get(gameId);
      if (game) {
        // Notify opponent
        const opponentId =
          game.players.white.id === socket.id ? game.players.black.id : game.players.white.id;
        io.to(opponentId).emit('opponentDisconnected');

        // Clean up
        games.delete(gameId);
        playerGames.delete(socket.id);
        playerGames.delete(opponentId);
      }
    }
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Chess multiplayer server running on port ${PORT}`);
});
