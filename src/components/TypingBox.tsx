"use client";
import { generate as randomWords } from "random-words";
import { useState, useEffect, useRef, useMemo, createRef } from "react";
import TimeBox from "./TimeBox";
import { useTestModeContext } from "../context/TestModeContext";
import Result from "./Result";

const TypingBox = () => {
  const [wordsArray, setWordsArray] = useState<string[]>(() => {
    const words = randomWords(500);
    return Array.isArray(words) ? words : [words];
  });
  const { testTime } = useTestModeContext();
  const [countdown, setCountdown] = useState(testTime);
  const [timerStarted, setTimerStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);

  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);

  // Test Statistics
  const [correctChars, setCorrectChars] = useState(0);
  const [incorrectChars, setIncorrectChars] = useState(0);
  const [extraChars, setExtraChars] = useState(0);
  const [missedChars, setMissedChars] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [wpm, setWpm] = useState(0);

  const [graphData, setGraphData] = useState<number[][]>([]);

  const correctCharsRef = useRef(0);

  const calculateWPM = () => {
    const wpmValue = Math.round((correctChars * 12) / testTime);
    setWpm(wpmValue);
  };

  const resetTest = () => {
    setCurrentWordIndex(0);
    setCurrentCharIndex(0);
    setTimerStarted(false);
    setTestCompleted(false);
    const words = randomWords(500);
    setWordsArray(Array.isArray(words) ? words : [words]);
    setCountdown(testTime);
    // Reset statistics
    setCorrectChars(0);
    setIncorrectChars(0);
    setExtraChars(0);
    setMissedChars(0);
    setAccuracy(0);
    setWpm(0);
    setGraphData([]);

    focusInput();

    // Clear all existing classes and remove extra characters
    wordsSpanRef.forEach((ref) => {
      if (ref.current && ref.current.children) {
        const children = Array.from(ref.current.children);
        children.forEach((child) => {
          if (child.classList.contains("extra-char")) {
            child.remove();
          } else {
            child.classList.remove(
              "blinking-cursor",
              "blinking-cursor-right",
              "correct-char",
              "incorrect-char",
            );
          }
        });
      }
    });
  };

  useEffect(() => {
    if (testCompleted) {
      calculateWPM();
      const totalChars =
        correctChars + incorrectChars + extraChars + missedChars;
      setAccuracy(
        totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 0,
      );
    }
  }, [
    testCompleted,
    correctChars,
    incorrectChars,
    extraChars,
    wordsArray,
    countdown,
    testTime,
  ]);

  const wordsSpanRef = useMemo(() => {
    return Array(wordsArray.length)
      .fill(0)
      .map((i) => createRef<HTMLDivElement>());
  }, [wordsArray]);

  const InputRef = useRef<HTMLInputElement>(null);

  const handleUserInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode !== 8 && e.key.length > 1) {
      e.preventDefault();
      return;
    }

    // Only start timer when user actually types a character (not space or other keys)
    if (!timerStarted && e.key.length === 1 && e.key !== " ") {
      setTimerStarted(true);
    }

    if (countdown === 0) {
      return;
    }

    const currWord = wordsSpanRef[currentWordIndex].current?.childNodes;

    if (!currWord || currWord.length === 0) return;

    if (e.key === " ") {
      // Mark current word as incorrect if not completed
      if (currWord && currentCharIndex < currWord.length) {
        // Mark remaining characters as missed
        setMissedChars((prev) => prev + (currWord.length - currentCharIndex));
        // Remove all blinking cursors
        for (let i = 0; i < currWord.length; i++) {
          (currWord[i] as HTMLElement).classList.remove("blinking-cursor", "blinking-cursor-right");
        }
      } else if (currWord && currWord.length > 0) {
        // Word completed, remove blinking cursor
        (currWord[currWord.length - 1] as HTMLElement).classList.remove("blinking-cursor-right");
      }

      // Move to next word
      const nextWordIndex = currentWordIndex + 1;
      if (nextWordIndex < wordsSpanRef.length) {
        const nextWordChars = wordsSpanRef[nextWordIndex].current?.children;
        if (nextWordChars && nextWordChars.length > 0) {
          (nextWordChars[0] as HTMLElement).classList.add("blinking-cursor");
        }

        // Scrolling logic
        if (
          wordsSpanRef[currentWordIndex + 1].current &&
          wordsSpanRef[currentWordIndex].current &&
          wordsSpanRef[currentWordIndex + 1].current.offsetLeft <
          wordsSpanRef[currentWordIndex].current.offsetLeft
        ) {
          wordsSpanRef[currentWordIndex].current.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }

        setCurrentWordIndex((prev) => prev + 1);
        setCurrentCharIndex(0);
      }
      return;
    }

    // Remove backspace functionality completely - no going back!

    // If typing beyond word length, just ignore - don't add extra characters
    if (currentCharIndex >= currWord.length) {
      return;
    }
    if (e.key === (currWord[currentCharIndex] as HTMLElement).innerText) {
      (currWord[currentCharIndex] as HTMLElement).classList.add("correct-char");
      setCorrectChars((prev) => prev + 1);
    } else {
      (currWord[currentCharIndex] as HTMLElement).classList.add("incorrect-char");
      setIncorrectChars((prev) => prev + 1);
    }

    (currWord[currentCharIndex] as HTMLElement).classList.remove("blinking-cursor");

    if (currentCharIndex + 1 < currWord.length) {
      (currWord[currentCharIndex + 1] as HTMLElement).classList.add("blinking-cursor");
    } else {
      (currWord[currentCharIndex] as HTMLElement).classList.add("blinking-cursor-right");
    }

    setCurrentCharIndex((prev) => prev + 1);
  };

  const focusInput = () => {
    setTimeout(() => {
      if (InputRef.current) {
        InputRef.current.focus();
      }
    }, 0);
  };

  useEffect(() => {
    if (wordsSpanRef[0].current && wordsSpanRef[0].current.children[0]) {
      (wordsSpanRef[0].current.children[0] as HTMLElement).classList.add("blinking-cursor");
    }
  }, [wordsArray]);

  useEffect(() => {
    resetTest();
  }, [testTime]);

  useEffect(() => {
    setCountdown(testTime);
  }, [testTime]);

  useEffect(() => {
    const words = randomWords(500);
    setWordsArray(Array.isArray(words) ? words : [words]);
    focusInput();
  }, []);

  useEffect(() => {
    correctCharsRef.current = correctChars;
  }, [correctChars]);

  useEffect(() => {
    // Timer logic
    let timer: NodeJS.Timeout;
    if (timerStarted && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev: number) => {
          const timeElapsed = testTime - prev + 1;
          const currentWPM = Math.round(
            (correctCharsRef.current * 12) / timeElapsed,
          );
          setGraphData((data) => [...data, [timeElapsed, currentWPM]]);

          if (prev === 1) {
            setTimerStarted(false);
            setTestCompleted(true);
            clearInterval(timer);
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timerStarted, testTime]);

  useEffect(() => {
    // Handle Tab key to reset the test
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        e.preventDefault();
        resetTest();
      }
    };

    window.addEventListener("keydown", handleTabKey);

    return () => {
      window.removeEventListener("keydown", handleTabKey);
    };
  }, [resetTest]);

  // Calculate live WPM for the speed meter
  const liveWpm = timerStarted && countdown > 0 && countdown < testTime
    ? Math.round((correctChars * 12) / (testTime - countdown))
    : 0;

  return (
    <div className="type-box min-h-[300px] px-4 sm:px-8 min-w-full max-w-[1200px] flex flex-col lg:flex-row gap-5 p-4 rounded-md">
      {/* Simple Speed Meter */}
      <div className="flex flex-col items-center justify-center min-w-[120px] lg:min-w-[120px] glass-effect rounded-xl p-4 order-2 lg:order-1">
        <div className="text-3xl font-bold text-cyan-400 mb-1">{liveWpm}</div>
        <div className="text-xs text-gray-300 uppercase tracking-wider">WPM</div>
      </div>

      {/* Main typing area */}
      <div className="flex-1 flex flex-col gap-5 order-1 lg:order-2">
        <TimeBox countdown={countdown} />
        {testCompleted ? (
          <div className="">
            <Result
              wpm={wpm}
              accuracy={accuracy}
              correctChars={correctChars}
              incorrectChars={incorrectChars}
              extraChars={extraChars}
              missedChars={missedChars}
              graphData={graphData}
              testTime={testTime}
            />
          </div>
        ) : (
          <div className="relative flex-1 p-2 overflow-hidden">
            <div
              onClick={focusInput}
              className="words-container text-xl sm:text-2xl pt-5 flex flex-wrap gap-2 space-y-1 overflow-hidden h-[120px] sm:h-[150px] relative scrollbar-hide"
            >
              {wordsArray.map((word, index) => (
                <span ref={wordsSpanRef[index]} className="mx-1.5" key={index}>
                  {word.split("").map((char, charIndex) => (
                    <span className="mx-[1.5px]" key={charIndex}>
                      {char}
                    </span>
                  ))}
                </span>
              ))}
            </div>
          </div>
        )}
        {!testCompleted && (
          <input
            type="text"
            ref={InputRef}
            onKeyDown={handleUserInput}
            className="opacity-0 absolute w-0 h-0"
          />
        )}
      </div>
    </div>
  );
};

export default TypingBox;
