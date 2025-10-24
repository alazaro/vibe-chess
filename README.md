# Chess Master - The Ultimate Web Chess ApplicationThis is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).



A comprehensive, modern web application for playing, learning, and practicing chess. Built with Next.js, TypeScript, and featuring Stockfish AI integration.## Getting Started



![Chess Master](https://img.shields.io/badge/chess-master-blue)First, run the development server:

![Next.js](https://img.shields.io/badge/Next.js-16.0-black)

![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)```bash

npm run dev

## 🎯 Features# or

yarn dev

### Core Gameplay# or

- **Full Chess Rules Implementation**: Complete support for all standard chess rules including:pnpm dev

  - Standard piece movements (Pawn, Rook, Knight, Bishop, Queen, King)# or

  - Special moves: Castling (kingside & queenside), En Passant, Pawn Promotionbun dev

  - Check, Checkmate, Stalemate detection```

  - Draw conditions (50-move rule, threefold repetition, insufficient material)

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Game Modes

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

#### 🤖 Play vs AI

- Integrated Stockfish chess engineThis project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

- 4 difficulty levels: Easy, Medium, Hard, Expert

- Adjustable engine depth and skill level## Learn More

- Natural thinking delays for realistic gameplay

To learn more about Next.js, take a look at the following resources:

#### 👥 Play vs Friend (Local)

- Hot-seat multiplayer on the same device- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.

- Turn-based gameplay- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

- Full move validation

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

#### 🌐 Play Online

- Real-time multiplayer with WebSocket (Socket.io)## Deploy on Vercel

- Automatic matchmaking system

- Server-authoritative game stateThe easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

- Disconnect handling

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

#### 🧩 Puzzle Mode
- Curated tactical puzzles
- Multiple difficulty levels (Beginner to Master)
- Immediate feedback on moves
- Progress tracking

### Learning Tools

#### ♟️ Chess Coach Mode
- Real-time move analysis powered by Stockfish
- Move classification: Excellent, Good, Inaccuracy, Mistake, Blunder
- Best move suggestions
- Position evaluation
- **Hint System**: Get the best move highlighted on the board

### User Interface

#### 🎨 Customizable Themes
- **Classic Wood**: Traditional chess board appearance
- **Modern Blue**: Contemporary clean design
- **Minimalist**: Simple black and white aesthetic

#### 📜 Move History
- Scrollable panel with all moves in Standard Algebraic Notation
- Click any move to view board state at that point
- Real-time updates

#### ✨ Visual Feedback
- Highlighted legal moves when piece selected
- Last move highlighting
- Check indicator
- Right-click to mark squares
- Smooth drag-and-drop or click-to-move

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd chess
```

2. Install dependencies:
```bash
pnpm install
```

3. Run the development server:
```bash
# Run both the Next.js app and Socket.io server
pnpm dev:all

# Or run separately:
# Terminal 1: Next.js app
pnpm dev

# Terminal 2: Socket.io server (for online play)
pnpm server
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
pnpm build
pnpm start
```

## 🎮 How to Play

### Playing a Game
1. **Choose Your Mode** from the main menu
2. **Select Pieces** by clicking or dragging
3. **Make Moves** by dragging to the target square or clicking twice
4. **View Move History** in the right panel
5. **Enable Coach Mode** for real-time feedback (AI and Local modes)

### Using the Chess Coach
1. Toggle "Coach Mode" in the game controls
2. Make your move
3. See instant analysis:
   - Move quality (Excellent → Blunder)
   - Best move alternative
   - Position evaluation
4. Click "Show Hint" to see the best move highlighted

### Solving Puzzles
1. Select "Puzzle Mode" from the menu
2. Read the puzzle description
3. Find and play the winning sequence
4. Get immediate feedback on each move
5. Try "Reset Puzzle" or "Next Puzzle"

### Playing Online
1. Click "Play Online" from the menu
2. Wait for matchmaking
3. You'll be assigned White or Black
4. Play your moves when it's your turn
5. Game ends on checkmate, stalemate, or disconnect

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 16, React 19, TypeScript
- **State Management**: Zustand
- **Chess Logic**: chess.js
- **Chess UI**: react-chessboard
- **AI Engine**: Stockfish.js (Web Worker)
- **Multiplayer**: Socket.io
- **Styling**: Tailwind CSS 4

### Project Structure
```
chess/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Main page component
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ChessBoard.tsx    # Main board component
│   ├── MoveHistory.tsx   # Move history panel
│   ├── CoachPanel.tsx    # Chess coach feedback
│   ├── GameControls.tsx  # Game control buttons
│   ├── MainMenu.tsx      # Main menu
│   ├── PuzzleMode.tsx    # Puzzle mode UI
│   ├── OnlineGame.tsx    # Online multiplayer UI
│   └── ...
├── store/                 # State management
│   └── gameStore.ts      # Zustand game state
├── lib/                   # Utilities and logic
│   ├── stockfish.ts      # Stockfish worker wrapper
│   ├── puzzles.ts        # Puzzle database
│   └── constants.ts      # App constants
├── types/                 # TypeScript types
│   └── index.ts
├── public/               # Static assets
│   └── stockfish.js     # Stockfish worker
└── server.ts            # Socket.io multiplayer server
```

## 🎯 Features Checklist

- ✅ Full chess rules implementation
- ✅ Multiple game modes (AI, Local, Online, Puzzle)
- ✅ Stockfish AI with 4 difficulty levels
- ✅ Real-time online multiplayer
- ✅ Chess Coach mode with move analysis
- ✅ Hint system
- ✅ Puzzle mode with 10+ puzzles
- ✅ 3 customizable board themes
- ✅ Move history with playback
- ✅ Drag-and-drop and click-to-move
- ✅ Visual feedback (highlights, check indicator)
- ✅ Game status notifications
- ✅ Responsive design

## 🔧 Configuration

### AI Difficulty Settings
Edit `lib/constants.ts` to adjust AI difficulty parameters:
```typescript
export const aiDifficultySettings = {
  easy: { depth: 1, skillLevel: 1, thinkTime: 500 },
  medium: { depth: 8, skillLevel: 10, thinkTime: 1000 },
  hard: { depth: 15, skillLevel: 15, thinkTime: 2000 },
  expert: { depth: 20, skillLevel: 20, thinkTime: 3000 },
};
```

### Board Themes
Customize themes in `lib/constants.ts`:
```typescript
export const boardThemes = {
  classic: {
    lightSquare: '#f0d9b5',
    darkSquare: '#b58863',
    // ...
  },
  // Add your own themes
};
```

### Adding Puzzles
Add new puzzles in `lib/puzzles.ts`:
```typescript
export const chessPuzzles: ChessPuzzle[] = [
  {
    id: 'puzzle-x',
    fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    moves: ['e2e4', 'e7e5'],
    description: 'Your puzzle description',
    difficulty: 'beginner',
  },
];
```

## 🐛 Known Issues

- Stockfish loading requires CDN access (online connection needed)
- Online multiplayer requires the Socket.io server running on port 3001
- Mobile touch support can be improved

## 🚀 Future Enhancements

- [ ] Move sound effects
- [ ] Game analysis/review mode
- [ ] Player ratings (ELO system)
- [ ] Opening book/database
- [ ] Save/load games (PGN support)
- [ ] Time controls (blitz, rapid, classical)
- [ ] User accounts and profiles
- [ ] Tournament mode
- [ ] Mobile app version

## 📝 License

MIT License - feel free to use this project for learning or building your own chess application!

## 🙏 Acknowledgments

- [chess.js](https://github.com/jhlywa/chess.js) - Chess logic
- [react-chessboard](https://github.com/Clariity/react-chessboard) - Chess UI
- [Stockfish](https://stockfishchess.org/) - Chess engine
- [Next.js](https://nextjs.org/) - React framework
- [Socket.io](https://socket.io/) - Real-time communication

## 🎮 Development Commands

```bash
# Development
pnpm dev          # Start Next.js dev server
pnpm server       # Start Socket.io server
pnpm dev:all      # Start both servers

# Build
pnpm build        # Build for production
pnpm start        # Start production server

# Code Quality
pnpm lint         # Run Biome linter
pnpm format       # Format code with Biome
```

---

**Enjoy playing chess! ♔♛♚♕**
