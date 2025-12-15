import { useEffect, useState } from "react";
import { Keyboard } from "./keyboard.jsx";
import Flowers from "../flowers.jsx";
import HelpModal from "../components/HelpModal.jsx";
import { RootsHelp } from "../components/Help.jsx";
import { RootsWin } from "../components/Win.jsx";
import { fetchTodaysPuzzle, submitPuzzleStats } from "../components/FetchPuzzle.jsx";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function Latter({ modal, setModal }) {
  const [loading, setLoading] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [showWinModal, setShowWinModal] = useState(false);

  const [startWord, setStartWord] = useState("");
  const [endWord, setEndWord] = useState("");
  const [currentWord, setCurrentWord] = useState("");

  const [selectedIndex, setSelectedIndex] = useState(null);
  const [pastGuesses, setPastGuesses] = useState([]);
  const [moves, setMoves] = useState(0);

  const [message, setMessage] = useState("");
  const [valid, setValid] = useState(true);

  const [startTime, setStartTime] = useState(null);
  const [puzztime, setPuzztime] = useState(null);

  /* -------------------------------------------------- */
  /* Load puzzle + restore stats (Bridges-style)        */
  /* -------------------------------------------------- */

  useEffect(() => {
    async function loadPuzzle() {
      const puzzle = await fetchTodaysPuzzle("Latter");

      let puzzleData;
      try {
        puzzleData = puzzle?.Data ? JSON.parse(puzzle.Data) : null;
      } catch {
        puzzleData = null;
      }

      // fallback safety
      if (!puzzleData) {
        puzzleData = { startWord: "BEAN", endWord: "CART" };
      }

      setStartWord(puzzleData.startWord);
      setEndWord(puzzleData.endWord);
      setCurrentWord(puzzleData.startWord);
      setStartTime(Date.now());

      const username = localStorage.getItem("username") || "guest";
      const today = new Date().toISOString().slice(0, 10);
      const puzzleId = `${today}_Latter`;
      console.log(`${username}_${puzzleId}`);
      const statsRef = doc(db, "stats", `${username}_${puzzleId}`);
      const statsSnap = await getDoc(statsRef);

      if (statsSnap.exists()) {
        const data = statsSnap.data();
        console.log(data);
        setCurrentWord(data.finalMap.finalWord);
        setPastGuesses(data.finalMap.pastGuesses || []);
        setMoves(data.finalMap.moves || 0);
        setPuzztime(data.timeTaken);

        setGameOver(true);
        setShowWinModal(true);
      }

      setLoading(false);
    }

    loadPuzzle();
  }, []);

  /* -------------------------------------------------- */
  /* Helpers                                           */
  /* -------------------------------------------------- */

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  async function checkWord(word) {
    try {
      const res = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      );

      if (!res.ok) throw new Error("Invalid");

      setMessage("");
      return true;
    } catch {
      setMessage(`"${capitalize(word.toLowerCase())}" is not a valid word.`);
      setValid(false);
      return false;
    }
  }

  /* -------------------------------------------------- */
  /* Input handling                                    */
  /* -------------------------------------------------- */

  function handleLetterClick(index) {
    if (gameOver) return;
    setValid(true);
    setSelectedIndex(index);
  }

  async function handleKeyPress(letter) {
    if (gameOver || selectedIndex == null) return;

    setValid(true);

    const newWord = currentWord
      .split("")
      .map((c, i) => (i === selectedIndex ? letter : c))
      .join("");

    const isValid = await checkWord(newWord);
    if (!isValid) return;

    const nextMoves = moves + 1;
    const nextPast = [currentWord, ...pastGuesses];

    setMoves(nextMoves);
    setPastGuesses(nextPast);
    setCurrentWord(newWord);

    if (newWord.toLowerCase() === endWord.toLowerCase()) {
      const endTime = Date.now();
      const timeTaken = Math.floor((endTime - startTime) / 1000);

      setGameOver(true);
      setPuzztime(timeTaken);
      setShowWinModal(true);

      submitPuzzleStats(timeTaken, "Latter", {
        finalWord: newWord,
        pastGuesses: nextPast,
        moves: nextMoves,
      });
    }
  }

  /* -------------------------------------------------- */
  /* Render                                            */
  /* -------------------------------------------------- */

  if (loading) return <div className="latter-game game" />;

  return (
    <div className={`latter-game game ${gameOver ? "game-over" : ""}`}>
      <HelpModal
        open={modal}
        onClose={() => setModal(false)}
        title="How to Play"
      >
        <RootsHelp />
      </HelpModal>

      <HelpModal
        open={showWinModal}
        onClose={() => setShowWinModal(false)}
        title="Congrats!"
      >
        <RootsWin puzztime={puzztime} />
      </HelpModal>

      {message && !gameOver && <div className="invalid">{message}</div>}

      {/* Final word */}
      <div className="final-word word">
        <div className="flowers-container">
          {gameOver && <Flowers />}
        </div>

        {endWord.split("").map((letter, i) => (
          <div key={i} className="letter">
            {letter}
          </div>
        ))}
      </div>

      {/* Current word */}
      <div className="current-word word">
        {currentWord.split("").map((letter, i) => (
          <div
            key={i}
            className={`letter 
              ${!valid ? "notavalidword" : ""} 
              ${selectedIndex === i ? "selected" : ""}`}
            onClick={() => handleLetterClick(i)}
          >
            {letter}
          </div>
        ))}
      </div>

      {/* Past guesses */}
      <div className="past-guesses">
        {pastGuesses.map((word, ip) => (
          <div
            key={word + ip}
            className="past-word word"
            style={{ filter: `brightness(${1 - (ip + 2) / 15})` }}
          >
            {word.split("").map((letter, i) => (
              <div key={i} className="letter">
                {letter}
              </div>
            ))}
          </div>
        ))}
      </div>

      {!gameOver && <Keyboard onKeyPress={handleKeyPress} />}

      {gameOver && !showWinModal && (
        <div onClick={() => setShowWinModal(true)} className="keyboard">
          <button className="alt">View Results</button>
        </div>
      )}
    </div>
  );
}
