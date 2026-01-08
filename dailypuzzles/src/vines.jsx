import { useState, useCallback } from "react";
import "./styles/vines.css";

const initialWords = [
  "Faith", "Hope", "Love", "Grace",
  "Moses", "Aaron", "David", "Solomon",
  "Jerusalem", "Bethlehem", "Nazareth", "Galilee",
  "ab", "Sabbath", "Prophecy", "Mordecai commanded"
];

const COLUMN_SIZE = 4;
const correctColumns = [];

for (let i = 0; i < initialWords.length; i += COLUMN_SIZE) {
  correctColumns.push(initialWords.slice(i, i + COLUMN_SIZE));
}

const categoryTitles = ["Virtues", "People", "Places", "Practices"];

// Pure shuffle
function shuffle(array) {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

// Auto-fit long words
function getFontSize(word, defaultFont = 14, maxLength = 12, minFont = 10) {
  const length = word.length;
  if (length <= maxLength) return defaultFont;
  const scale = Math.exp(-0.05 * (length - 1));
  return Math.round(minFont + (defaultFont - minFont) * scale);
}

export default function Vines() {
  // Initialize shuffled words once — no effect needed
  const [words, setWords] = useState(() => shuffle(initialWords));

  const [firstSelected, setFirstSelected] = useState(null);
  const [message, setMessage] = useState("");
  const [lockedColumns, setLockedColumns] = useState([false, false, false, false]);
  const [swappedWords, setSwappedWords] = useState([]);
  const [revealedCategories, setRevealedCategories] = useState([null, null, null, null]);

  // submitGuess now takes the word list directly
  const submitGuess = useCallback((currentWords) => {
    let remainingCorrect = correctColumns.map((col, idx) => ({
      words: [...col].sort(),
      title: categoryTitles[idx],
    }));

    const newLockedColumns = [...lockedColumns];
    const newRevealedCategories = [...revealedCategories];

    for (let col = 0; col < 4; col++) {
      if (newLockedColumns[col]) continue;

      const start = col * 4;
      const columnWords = currentWords.slice(start, start + 4).sort();

      const matchIndex = remainingCorrect.findIndex(
        correctCol => JSON.stringify(correctCol.words) === JSON.stringify(columnWords)
      );

      if (matchIndex !== -1) {
        newLockedColumns[col] = true;
        newRevealedCategories[col] = remainingCorrect[matchIndex].title;
        remainingCorrect.splice(matchIndex, 1);
      }
    }

    setLockedColumns(newLockedColumns);
    setRevealedCategories(newRevealedCategories);

    if (newLockedColumns.filter(Boolean).length === 4) {
      setMessage("You Win!");
    } else {
      setMessage("");
    }

  }, [lockedColumns, revealedCategories]);

  // Swap words
  const swapWords = (index) => {
    const colIndex = Math.floor(index / 4);
    if (lockedColumns[colIndex]) return;

    if (firstSelected === null) {
      setFirstSelected(index);
    } else if (firstSelected === index) {
      setFirstSelected(null);
    } else {
      const firstColIndex = Math.floor(firstSelected / 4);
      if (lockedColumns[firstColIndex]) {
        setFirstSelected(null);
        return;
      }

      const newWords = [...words];
      [newWords[firstSelected], newWords[index]] = [newWords[index], newWords[firstSelected]];

      setWords(newWords);
      submitGuess(newWords); // run immediately after swap

      setSwappedWords([firstSelected, index]);
      setTimeout(() => setSwappedWords([]), 500);

      setFirstSelected(null);
    }
  };

  return (
    <div className="vines-game game">
      <div className="columns-container">
        {[0, 1, 2, 3].map((col) => (
          <div key={col} className={`column ${lockedColumns[col] ? "locked" : ""}`}>
            {revealedCategories[col] && (
              <div
                className="category-title"
                style={{ fontSize: getFontSize(revealedCategories[col]) + "px" }}
              >
                {revealedCategories[col]}
              </div>
            )}

            {words.slice(col * 4, col * 4 + 4).map((word, idx) => {
              const globalIndex = col * 4 + idx;
              const isSwapped = swappedWords.includes(globalIndex);

              return (
                <div
                  id={`word-${globalIndex}`}
                  key={idx}
                  style={{ fontSize: getFontSize(word) + "px" }}
                  className={`vine-word word 
                    ${firstSelected === globalIndex ? "selected" : ""} 
                    ${lockedColumns[col] ? "locked-word" : ""} 
                    ${isSwapped ? "swapped" : ""}`}
                  onClick={() => swapWords(globalIndex)}
                >
                  {word}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="message">{message}</div>
    </div>
  );
}
