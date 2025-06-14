import React, { useState } from 'react';
import './styles.css';

export default function App() {
  const [target, setTarget] = useState(() => Math.floor(Math.random() * 100) + 1);
  const [guess, setGuess] = useState('');
  const [feedback, setFeedback] = useState('Make your guess!');
  const [attempts, setAttempts] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  const sendToGameLab = (data: any) => {
    if (typeof window.sendDataToGameLab === 'function') {
      window.sendDataToGameLab(data);
    }
  };

  const handleGuess = () => {
    const numGuess = parseInt(guess, 10);
    if (isNaN(numGuess)) {
      setFeedback('Please enter a valid number.');
      return;
    }
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    let result: string;
    if (numGuess < target) {
      result = 'Too low!';
      setFeedback(result);
    } else if (numGuess > target) {
      result = 'Too high!';
      setFeedback(result);
    } else {
      result = 'Correct! You guessed the number!';
      setFeedback(result);
      setGameWon(true);
      sendToGameLab({ event: 'gameWon', target, attempts: newAttempts, timestamp: new Date().toISOString() });
    }

    sendToGameLab({ event: 'guess', guess: numGuess, result, attempts: newAttempts, timestamp: new Date().toISOString() });
    setGuess('');
  };

  const handleReset = () => {
    const newTarget = Math.floor(Math.random() * 100) + 1;
    setTarget(newTarget);
    setGuess('');
    setFeedback('Make your guess!');
    setAttempts(0);
    setGameWon(false);
    sendToGameLab({ event: 'reset', timestamp: new Date().toISOString() });
  };

  return (
    <div className="App">
      <h1>Number Guessing Game</h1>
      <p>Guess a number between 1 and 100.</p>
      <div className="game-controls">
        <input
          type="number"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          disabled={gameWon}
          placeholder="Enter your guess"
        />
        <button onClick={handleGuess} disabled={gameWon}>
          Guess
        </button>
        <button onClick={handleReset}>
          Reset
        </button>
      </div>
      <p className="feedback">{feedback}</p>
      <p>Attempts: {attempts}</p>
    </div>
  );
}