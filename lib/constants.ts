export const boardThemes = {
  classic: {
    name: 'Classic',
    lightSquare: '#f0d9b5',
    darkSquare: '#b58863',
    selectedSquare: '#829769',
    legalMoveIndicator: 'rgba(0, 0, 0, 0.2)',
    checkSquare: '#e74c3c',
    lastMoveSquare: 'rgba(155, 199, 0, 0.4)',
  },
  modern: {
    name: 'Modern',
    lightSquare: '#eeeed2',
    darkSquare: '#769656',
    selectedSquare: '#baca44',
    legalMoveIndicator: 'rgba(0, 0, 0, 0.15)',
    checkSquare: '#e74c3c',
    lastMoveSquare: 'rgba(186, 202, 68, 0.5)',
  },
  minimalist: {
    name: 'Minimal',
    lightSquare: '#ffffff',
    darkSquare: '#4a4a4a',
    selectedSquare: '#6b6b6b',
    legalMoveIndicator: 'rgba(0, 0, 0, 0.1)',
    checkSquare: '#e74c3c',
    lastMoveSquare: 'rgba(0, 0, 0, 0.15)',
  },
};

export const aiDifficultySettings = {
  easy: {
    name: 'Easy',
    depth: 1,
    skillLevel: 1,
    thinkTime: 500,
  },
  medium: {
    name: 'Medium',
    depth: 8,
    skillLevel: 10,
    thinkTime: 1000,
  },
  hard: {
    name: 'Hard',
    depth: 15,
    skillLevel: 15,
    thinkTime: 2000,
  },
  expert: {
    name: 'Expert',
    depth: 20,
    skillLevel: 20,
    thinkTime: 3000,
  },
};
