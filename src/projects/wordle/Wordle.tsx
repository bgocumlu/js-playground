import { useEffect, useState, useRef } from 'react';
import {kelimeler} from './bes_harfli_kelimeler.json';

const WORDLE_COLORS = {
  correct: { bg: '#6aaa64', text: '#fff', border: '#6aaa64' },
  present: { bg: '#c9b458', text: '#fff', border: '#c9b458' },
  absent: { bg: '#787c7e', text: '#fff', border: '#787c7e' },
  empty: { bg: '#fff', text: '#212121', border: '#d3d6da' },
};

type WordleStatus = keyof typeof WORDLE_COLORS;

function Box({ letter = "", status = "empty" }: { letter?: string; status?: WordleStatus }) {
  const { bg, text, border } = WORDLE_COLORS[status ?? "empty"];
  return (
    <div
      className="w-10 h-10 sm:w-12 sm:h-12 rounded flex items-center justify-center text-xl sm:text-2xl font-bold uppercase select-none"
      style={{ backgroundColor: bg, color: text, border: `2px solid ${border}` }}
    >
      {letter}
    </div>
  );
}

function GuessRow({ letters = ["", "", "", "", ""], statuses = ["empty", "empty", "empty", "empty", "empty"] }: { letters?: string[]; statuses?: WordleStatus[] }) {
  return (
    <div className="flex gap-2 mb-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Box key={i} letter={letters[i]} status={statuses[i]} />
      ))}
    </div>
  );
}

type Guess = { letters: string[]; statuses: WordleStatus[] };

export function Wordle() {
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string[]>(["", "", "", "", ""]);
  const [answer, setAnswer] = useState<string[]>([]);
  const [error, setError] = useState<string>("");
  const [gameState, setGameState] = useState<"playing" | "won" | "lost">("playing");
  const [keyStatuses, setKeyStatuses] = useState<Record<string, WordleStatus>>({});
  const currentGuessRef = useRef(currentGuess);
  const handleKeyDownRef = useRef<((e: KeyboardEvent) => void) | null>(null);

  // Function to pick a new answer
  function pickNewAnswer() {
    const randomIndex = Math.floor(Math.random() * kelimeler.length);
    const answerWord = kelimeler[randomIndex].toLocaleLowerCase("tr");
    const answerArr = answerWord.split("");
    setAnswer(answerArr);
    console.log("Answer:", answerArr.join("")); // For debugging purposes
  }

  // Pick a random answer on mount
  useEffect(() => {
    pickNewAnswer();
  }, []);

  useEffect(() => {
    currentGuessRef.current = currentGuess;
  }, [currentGuess]);

  function checkGuess(guess: string[], answer: string[]): WordleStatus[] {
    // Compare in lowercase for Turkish
    const guessLower = guess.map(l => l.toLocaleLowerCase("tr"));
    const answerLower = answer.map(l => l.toLocaleLowerCase("tr"));
    const statuses: WordleStatus[] = Array(5).fill("absent");
    const answerCopy = [...answerLower];

    // First pass: correct
    for (let i = 0; i < 5; i++) {
      if (guessLower[i] === answerLower[i]) {
        statuses[i] = "correct";
        answerCopy[i] = ""; // Remove matched letter
      }
    }
    // Second pass: present
    for (let i = 0; i < 5; i++) {
      if (statuses[i] === "correct") continue;
      const idx = answerCopy.indexOf(guessLower[i]);
      if (idx !== -1 && guessLower[i] !== "") {
        statuses[i] = "present";
        answerCopy[idx] = "";
      }
    }
    return statuses;
  }

  function updateKeyStatuses(guess: string[], statuses: WordleStatus[]) {
    setKeyStatuses(prev => {
      const newStatuses = { ...prev };
      for (let i = 0; i < guess.length; i++) {
        const key = guess[i].toLocaleUpperCase("tr");
        const status = statuses[i];
        // Only update if the new status is "better" than the current one
        // Priority: correct > present > absent
        if (!newStatuses[key] || 
            (status === "correct") || 
            (status === "present" && newStatuses[key] === "absent")) {
          newStatuses[key] = status;
        }
      }
      return newStatuses;
    });
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== "playing") return;
      if (e.key.length === 1 && /[a-zA-ZçğıİöşüÇĞİÖŞÜ]/i.test(e.key)) {
        setError("");
        setCurrentGuess(prev => {
          const idx = prev.findIndex(l => l === "");
          if (idx === -1) return prev;
          const next = [...prev];
          next[idx] = e.key.toLocaleLowerCase("tr");
          return next;
        });
      } else if (e.key === "Backspace") {
        setError("");
        setCurrentGuess(prev => {
          const idx = prev.slice().reverse().findIndex(l => l !== "");
          if (idx === -1) return prev;
          const removeIdx = 4 - idx;
          const next = [...prev];
          next[removeIdx] = "";
          return next;
        });
      } else if (e.key === "Enter") {
        const guess = currentGuessRef.current;
        if (guess.every(l => l !== "")) {
          const guessWord = guess.join("").toLowerCase();
          if (kelimeler.map(w => w.toLocaleLowerCase("tr")).includes(guessWord)) {
            const statuses = checkGuess(guess, answer);
            updateKeyStatuses(guess, statuses);
            setGuesses(prev => {
              const newGuesses = [...prev, { letters: guess, statuses }];
              if (guess.join("") === answer.join("")) {
                setGameState("won");
              } else if (newGuesses.length === 6) {
                setGameState("lost");
              }
              return newGuesses;
            });
            setCurrentGuess(["", "", "", "", ""]);
            setError("");
          } else {
            setError("Geçerli bir kelime giriniz.");
          }
        }
      }
    };
    handleKeyDownRef.current = handleKeyDown;
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [answer, gameState]);

  function handleRestart() {
    setGuesses([]);
    setCurrentGuess(["", "", "", "", ""]);
    setError("");
    setGameState("playing");
    setKeyStatuses({});
    pickNewAnswer();
    // Remove focus from the button to prevent Enter key from triggering it
    (document.activeElement as HTMLElement)?.blur();
  }

  // Turkish Q/QWERTY keyboard rows
  const keyboardRows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "Ğ", "Ü"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ş", "İ"],
    ["Z", "X", "C", "V", "B", "N", "M", "Ö", "Ç"]
  ];

  function handleKeyboardClick(key: string) {
    if (gameState !== "playing") return;
    setError("");
    setCurrentGuess(prev => {
      const idx = prev.findIndex(l => l === "");
      if (idx === -1) return prev;
      const next = [...prev];
      next[idx] = key.toLocaleLowerCase("tr");
      return next;
    });
  }
  function handleBackspace() {
    setError("");
    setCurrentGuess(prev => {
      const idx = prev.slice().reverse().findIndex(l => l !== "");
      if (idx === -1) return prev;
      const removeIdx = 4 - idx;
      const next = [...prev];
      next[removeIdx] = "";
      return next;
    });
  }
  function handleEnter() {
    const guess = currentGuessRef.current;
    if (guess.every(l => l !== "")) {
      const guessWord = guess.join("").toLowerCase();
      if (kelimeler.map(w => w.toLocaleLowerCase("tr")).includes(guessWord)) {
        const statuses = checkGuess(guess, answer);
        updateKeyStatuses(guess, statuses);
        setGuesses(prev => {
          const newGuesses = [...prev, { letters: guess, statuses }];
          if (guess.join("") === answer.join("")) {
            setGameState("won");
          } else if (newGuesses.length === 6) {
            setGameState("lost");
          }
          return newGuesses;
        });
        setCurrentGuess(["", "", "", "", ""]);
        setError("");
      } else {
        setError("Geçerli bir kelime giriniz.");
      }
    }
  }

  return (
    <div className="flex flex-col items-center min-h-screen p-4 touch-manipulation" style={{ touchAction: 'manipulation' }}>
      <button
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition touch-manipulation"
        onClick={handleRestart}
        onTouchStart={(e) => e.preventDefault()}
      >
        Yeniden Başlat
      </button>
      <div className="flex flex-col gap-1 mb-4">
        {guesses.map((guess, i) => (
          <GuessRow key={i} letters={guess.letters.map(l => l.toLocaleUpperCase("tr"))} statuses={guess.statuses} />
        ))}
        {gameState === "playing" && guesses.length < 6 && <GuessRow letters={currentGuess.map(l => l.toLocaleUpperCase("tr"))} />}
        {Array.from({ length: Math.max(0, 6 - guesses.length - (gameState === "playing" ? 1 : 0)) }).map((_, i) => (
          <GuessRow key={`empty-${guesses.length + i + 1}`} />
        ))}
      </div>
      {/* On-screen keyboard for mobile */}
      <div className="mt-4 flex flex-col gap-1 select-none w-full max-w-sm px-2">
        {keyboardRows.map((row, i) => (
          <div key={i} className="flex justify-center gap-1">
            {row.map((key) => {
              const keyStatus = keyStatuses[key] || "empty";
              const { bg, text } = WORDLE_COLORS[keyStatus];
              const buttonColor = keyStatus === "empty" ? "bg-gray-200" : "";
              return (
                <button
                  key={key}
                  className={`px-1 py-3 rounded text-sm font-bold active:opacity-75 touch-manipulation ${buttonColor}`}
                  style={{ 
                    minWidth: i === 0 ? 28 : i === 1 ? 30 : 32,
                    minHeight: 44,
                    backgroundColor: keyStatus !== "empty" ? bg : undefined,
                    color: keyStatus !== "empty" ? text : undefined
                  }}
                  onClick={() => handleKeyboardClick(key)}
                  onTouchStart={(e) => e.preventDefault()}
                >{key}</button>
              );
            })}
            {/* Backspace button right after "Ç" on the third row */}
            {i === 2 && (
              <button
                className="px-3 py-3 bg-gray-300 rounded text-lg font-bold active:bg-gray-400 touch-manipulation"
                style={{ minWidth: 44, minHeight: 44 }}
                onClick={handleBackspace}
                onTouchStart={(e) => e.preventDefault()}
              >⌫</button>
            )}
          </div>
        ))}
        {/* Centered ENTER button */}
        <div className="flex justify-center gap-1 mt-1">
          <button
            className="px-6 py-3 bg-gray-300 rounded text-xs font-bold active:bg-gray-400 touch-manipulation"
            style={{ minWidth: 80, minHeight: 44 }}
            onClick={handleEnter}
            onTouchStart={(e) => e.preventDefault()}
          >ENTER</button>
        </div>
      </div>
      {error && <div className="text-red-500 mt-2 text-center">{error}</div>}
      {gameState === "won" && <div className="text-green-600 font-bold mt-2 text-center">Tebrikler! Doğru bildiniz.</div>}
      {gameState === "lost" && <div className="text-gray-700 font-bold mt-2 text-center">Cevap: {answer.join("").toLocaleUpperCase("tr")}</div>}
    </div>
  );
}