class StockfishWorker {
  private worker: Worker | null = null;
  private isReady: boolean = false;
  private callbacks: Map<string, (data: any) => void> = new Map();

  init() {
    if (typeof window === 'undefined') return;

    try {
      // Use Stockfish from CDN
      this.worker = new Worker('/stockfish.js');

      this.worker.onmessage = (event) => {
        const message = event.data;

        if (message === 'readyok') {
          this.isReady = true;
        }

        // Handle different types of messages
        if (message.startsWith('bestmove')) {
          const callback = this.callbacks.get('bestmove');
          if (callback) {
            const match = message.match(/bestmove ([a-h][1-8][a-h][1-8][qrbn]?)/);
            if (match) {
              callback(match[1]);
            }
          }
        }

        if (message.startsWith('info') && message.includes('score')) {
          const callback = this.callbacks.get('evaluation');
          if (callback) {
            // Parse evaluation from info string
            const cpMatch = message.match(/score cp (-?\d+)/);
            const mateMatch = message.match(/score mate (-?\d+)/);

            if (cpMatch) {
              callback({ type: 'cp', value: parseInt(cpMatch[1]) / 100 });
            } else if (mateMatch) {
              callback({ type: 'mate', value: parseInt(mateMatch[1]) });
            }
          }
        }
      };

      // Initialize UCI
      this.sendCommand('uci');
      this.sendCommand('isready');
    } catch (error) {
      console.error('Failed to initialize Stockfish:', error);
    }
  }

  sendCommand(command: string) {
    if (this.worker) {
      this.worker.postMessage(command);
    }
  }

  async getBestMove(fen: string, depth: number = 15): Promise<string> {
    return new Promise((resolve) => {
      this.callbacks.set('bestmove', (move) => {
        this.callbacks.delete('bestmove');
        resolve(move);
      });

      this.sendCommand(`position fen ${fen}`);
      this.sendCommand(`go depth ${depth}`);
    });
  }

  async evaluatePosition(fen: string, depth: number = 15): Promise<{ type: string; value: number }> {
    return new Promise((resolve) => {
      let lastEval = { type: 'cp', value: 0 };

      this.callbacks.set('evaluation', (evaluation) => {
        lastEval = evaluation;
      });

      this.callbacks.set('bestmove', () => {
        this.callbacks.delete('evaluation');
        this.callbacks.delete('bestmove');
        resolve(lastEval);
      });

      this.sendCommand(`position fen ${fen}`);
      this.sendCommand(`go depth ${depth}`);
    });
  }

  setSkillLevel(level: number) {
    // Skill level from 0 to 20
    this.sendCommand(`setoption name Skill Level value ${level}`);
  }

  setDepth(depth: number) {
    this.sendCommand(`setoption name Depth value ${depth}`);
  }

  stop() {
    this.sendCommand('stop');
  }

  quit() {
    if (this.worker) {
      this.sendCommand('quit');
      this.worker.terminate();
      this.worker = null;
      this.isReady = false;
    }
  }
}

export const stockfish = new StockfishWorker();
