'use client';

import { useState, useEffect, useRef } from 'react';

const targetText = "The quick brown fox jumps over the lazy dog. This is a sample text for typing practice. Improve your speed and accuracy.";
const testDuration = 60; // seconds

export default function TypingTest() {
  const [userInput, setUserInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(testDuration);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isFinished) return;

    if (!isStarted) {
      setIsStarted(true);
      startTimer();
    }

    // Only allow printable characters, ignore backspace, enter, etc.
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
      const newInput = userInput + e.key;
      setUserInput(newInput);
      updateStats(newInput);

      if (newInput === targetText) {
        setIsFinished(true);
        if (timerRef.current) clearInterval(timerRef.current);
      }
    }
  };

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsFinished(true);
          updateStats(userInput);
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const updateStats = (input: string) => {
    if (input.length === 0) return;

    const timeElapsed = testDuration - timeLeft;
    const characters = input.length;
    const words = characters / 5;
    const calculatedWpm = timeElapsed > 0 ? Math.round(words / (timeElapsed / 60)) : 0;

    let correctChars = 0;
    for (let i = 0; i < input.length; i++) {
      if (input[i] === targetText[i]) correctChars++;
    }
    const calculatedAccuracy = Math.round((correctChars / characters) * 100);

    setWpm(calculatedWpm);
    setAccuracy(calculatedAccuracy);
  };

  const renderTargetText = () => {
    return targetText.split('').map((char, index) => {
      let className = '';
      if (index < userInput.length) {
        className = userInput[index] === char ? 'text-green-500' : 'text-red-500 bg-red-100';
      } else if (index === userInput.length) {
        className = 'bg-blue-200';
      }
      return (
        <span key={index} className={className}>
          {char}
        </span>
      );
    });
  };

  const resetTest = () => {
    setUserInput('');
    setTimeLeft(testDuration);
    setWpm(0);
    setAccuracy(0);
    setIsStarted(false);
    setIsFinished(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (inputRef.current) inputRef.current.focus();
  };

  const progress = (userInput.length / targetText.length) * 100;

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-center mb-8">Typing Speed Test</h1>

      <div className="mb-4">
        <div className="flex justify-between mb-2">
          <span>Time Left: {timeLeft}s</span>
          <span>Progress: {Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-4">
        <p className="text-lg leading-relaxed font-mono">
          {renderTargetText()}
        </p>
      </div>

      <input
        ref={inputRef}
        type="text"
        value=""
        onKeyDown={handleKeyDown}
        disabled={isFinished}
        className="w-full p-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 opacity-0 absolute pointer-events-none"
        placeholder=""
      />

      <div className="flex justify-between mt-4">
        <div>
          <p className="text-lg">WPM: <span className="font-bold">{wpm}</span></p>
        </div>
        <div>
          <p className="text-lg">Accuracy: <span className="font-bold">{accuracy}%</span></p>
        </div>
      </div>

      {isFinished && (
        <div className="mt-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Test Completed!</h2>
          <p className="text-lg mb-4">WPM: {wpm} | Accuracy: {accuracy}%</p>
          <button
            onClick={resetTest}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
