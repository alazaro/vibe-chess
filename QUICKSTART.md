# Quick Start Guide

## Running the Application

### Option 1: Run Everything (Recommended)
```bash
pnpm dev:all
```
This starts both the Next.js app and the Socket.io server for online multiplayer.

### Option 2: Run Separately

**Terminal 1 - Next.js App:**
```bash
pnpm dev
```
Access at: http://localhost:3000

**Terminal 2 - Multiplayer Server (Optional):**
```bash
pnpm server
```
Server runs on: http://localhost:3001

## What You Can Do

1. **Play vs AI** - Challenge Stockfish with 4 difficulty levels
2. **Play vs Friend** - Local multiplayer on same device
3. **Play Online** - Real-time multiplayer (requires server running)
4. **Solve Puzzles** - Practice tactics with 10+ curated puzzles
5. **Enable Coach** - Get real-time move analysis and hints

## Testing the Features

### Test AI Mode
1. Click "Play vs AI"
2. Select difficulty (start with Easy)
3. Make a move as White
4. Watch the AI respond

### Test Coach Mode
1. Start any game (AI or Local)
2. Click "Coach: OFF" to enable
3. Make a move
4. See analysis appear in Coach panel
5. Click "Show Hint" for best move suggestion

### Test Puzzle Mode
1. Click "Puzzle Mode"
2. Read the puzzle description
3. Try to solve it
4. Get instant feedback

### Test Online Mode
1. Make sure server is running (`pnpm server`)
2. Click "Play Online"
3. Click "Find Match"
4. Open another browser tab and do the same
5. Both players get matched and play

## Customization

### Change Board Theme
While in a game, select from:
- Classic Wood
- Modern Blue
- Minimalist

### Adjust AI Difficulty
In AI mode, switch between:
- Easy (beginner)
- Medium (intermediate)
- Hard (advanced)
- Expert (master level)

## Troubleshooting

### Port Already in Use
If port 3000 is in use, Next.js will automatically use 3001 or another available port.

### Online Mode Not Working
Make sure the Socket.io server is running with `pnpm server` on port 3001.

### Stockfish Not Loading
The app loads Stockfish from CDN. Check your internet connection.

## Next Steps

- Explore different game modes
- Try solving all puzzles
- Experiment with coach mode
- Challenge the AI on expert difficulty
- Play online with friends

Enjoy! ♔♚
