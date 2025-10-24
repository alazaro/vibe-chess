import type { ChessPuzzle } from '@/types';

// Curated chess puzzles for tactical training
export const chessPuzzles: ChessPuzzle[] = [
  {
    id: 'puzzle-1',
    fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4',
    moves: ['h5f7', 'e8f7', 'c4d5'], // Scholar's Mate setup
    description: 'White to move and win material',
    difficulty: 'beginner',
  },
  {
    id: 'puzzle-2',
    fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 5',
    moves: ['f3e5'], // Win the pawn
    description: 'White to move and win a pawn',
    difficulty: 'beginner',
  },
  {
    id: 'puzzle-3',
    fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq d3 0 3',
    moves: ['e5d4', 'f3d4', 'f8c5'], // Developing with threat
    description: 'Black to move and develop with a threat',
    difficulty: 'beginner',
  },
  {
    id: 'puzzle-4',
    fen: 'r2qkb1r/ppp2ppp/2n5/3np1N1/2B5/8/PPPP1PPP/RNBQK2R w KQkq - 0 8',
    moves: ['g5f7', 'e8f7', 'c4d5'], // Double attack
    description: 'White to move and win material with a double attack',
    difficulty: 'intermediate',
  },
  {
    id: 'puzzle-5',
    fen: 'r1bq1rk1/ppp2ppp/2np1n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQ1RK1 w - - 0 8',
    moves: ['c3d5', 'f6d5', 'c4d5'], // Exchange and win material
    description: 'White to move and win a piece',
    difficulty: 'intermediate',
  },
  {
    id: 'puzzle-6',
    fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 6 5',
    moves: ['f3e5', 'c6e5', 'd2d4'], // Central control
    description: 'White to move and dominate the center',
    difficulty: 'intermediate',
  },
  {
    id: 'puzzle-7',
    fen: 'r2qkb1r/ppp2ppp/2n2n2/3pp1B1/1bB1P3/2N2N2/PPPP1PPP/R2QK2R w KQkq - 1 7',
    moves: ['g5f6', 'd8f6', 'c3d5'], // Remove defender and attack
    description: 'White to move and fork the queen',
    difficulty: 'advanced',
  },
  {
    id: 'puzzle-8',
    fen: 'r1b2rk1/ppp1qppp/2np1n2/2b1p3/2B1P3/2NP1N1P/PPP1QPP1/R1B2RK1 b - - 0 10',
    moves: ['e7a3'], // Queen infiltration
    description: 'Black to move and create threats',
    difficulty: 'advanced',
  },
  {
    id: 'puzzle-9',
    fen: 'r1bqr1k1/ppp2ppp/2np1n2/2b1p3/2B1P3/2NP1N1P/PPP1QPP1/R1B2RK1 w - - 0 10',
    moves: ['c4f7', 'g8f7', 'e2e6'], // Sacrifice and attack
    description: 'White to move - sacrifice for a winning attack',
    difficulty: 'master',
  },
  {
    id: 'puzzle-10',
    fen: '2rq1rk1/pp3pbp/3p1np1/2pP4/2P1P3/2N2N2/PP2QPPP/3RR1K1 w - - 0 15',
    moves: ['e2h5', 'g6h5', 'e4e5'], // Opening files for attack
    description: 'White to move - exchange and create threats',
    difficulty: 'master',
  },
];

export const getPuzzleById = (id: string): ChessPuzzle | undefined => {
  return chessPuzzles.find((puzzle) => puzzle.id === id);
};

export const getPuzzlesByDifficulty = (difficulty: ChessPuzzle['difficulty']): ChessPuzzle[] => {
  return chessPuzzles.filter((puzzle) => puzzle.difficulty === difficulty);
};
