import { useState, useCallback } from "react";
import "./styles/vines.css";

const initialData = [
  { title: "Virtues", words: ["Faith", "Hope", "Love", "Grace"] },
  { title: "People", words: ["Moses", "Aaron", "David", "Solomon"] },
  { title: "Places", words: ["Jerusalem", "Bethlehem", "Nazareth", "Galilee"] },
  { title: "Practices", words: ["ab", "Sabbath", "Prophecy", "Mordecai commanded"] },
];

function shuffle(array) {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

function getFontSize(word, defaultFont = 14, maxLength = 12, minFont = 10) {
  const length = word.length;
  if (length <= maxLength) return defaultFont;
  const scale = Math.exp(-0.05 * (length - 1));
  return Math.round(minFont + (defaultFont - minFont) * scale);
}

export default function Vines() {
  const [availableWords, setAvailableWords] = useState(() =>
    shuffle(initialData.flatMap((cat) => cat.words))
  );
  const [selectedWords, setSelectedWords] = useState([]);
  const [solvedCategories, setSolvedCategories] = useState([]);
  const [message, setMessage] = useState("");

  const handleSelect = (word) => {
    if (selectedWords.includes(word)) {
      setSelectedWords(selectedWords.filter((w) => w !== word));
    } else {
      if (selectedWords.length < 4) {
        setSelectedWords([...selectedWords, word]);
      }
    }
  };

  const handleDeselectAll = () => {
    setSelectedWords([]);
  };

  const handleShuffle = () => {
    setAvailableWords((prev) => shuffle(prev));
  };

  const handleSubmit = useCallback(() => {
    if (selectedWords.length !== 4) return;

    const sortedSelection = [...selectedWords].sort();

    // Check if the 4 selected words match any category
    const matchedCategory = initialData.find((category) => {
      const sortedCategoryWords = [...category.words].sort();
      return JSON.stringify(sortedCategoryWords) === JSON.stringify(sortedSelection);
    });

    if (matchedCategory) {
      setSolvedCategories((prev) => [...prev, matchedCategory]);
      setAvailableWords((prev) => prev.filter((w) => !selectedWords.includes(w)));
      setSelectedWords([]);
      
      if (solvedCategories.length + 1 === initialData.length) {
        setMessage("Great job! You solved all categories!");
      } else {
        setMessage("Category Solved!");
      }
    } else {
      // Check for "One Away" hint
      const isOneAway = initialData.some((category) => {
        const overlap = selectedWords.filter((word) => category.words.includes(word));
        return overlap.length === 3;
      });

      setMessage(isOneAway ? "One away!" : "Incorrect group. Try again!");
    }
  }, [selectedWords, solvedCategories]);

  return (
    <div className="connections-game game vines">
      {/* Solved Categories Stacked on Top */}
      <div className="solved-categories-container">
        {solvedCategories.map((cat, idx) => (
          <div key={idx} className={`solved-category category-color-${idx}`}>
            <h3 className="category-title">{cat.title}</h3>
            <p className="category-words">{cat.words.join(", ")}</p>
          </div>
        ))}
      </div>

      {/* Grid of Remaining Unsolved Words */}
      {availableWords.length > 0 && (
        <div className="words-grid">
          {availableWords.map((word) => {
            const isSelected = selectedWords.includes(word);
            return (
              <button
                key={word}
                style={{ fontSize: `${getFontSize(word)}px` }}
                className={`word-card ${isSelected ? "selected" : ""}`}
                onClick={() => handleSelect(word)}
              >
                {word}
              </button>
            );
          })}
        </div>
      )}

      {/* Feedback Message */}
      {message && <div className="message">{message}</div>}

      {/* Control Actions */}
      <div className="controls">
        <button 
          onClick={handleShuffle} 
          disabled={availableWords.length === 0}
          className="action-btn"
        >
          Shuffle
        </button>
        <button 
          onClick={handleDeselectAll} 
          disabled={selectedWords.length === 0}
          className="action-btn"
        >
          Deselect All
        </button>
        <button 
          onClick={handleSubmit} 
          disabled={selectedWords.length !== 4}
          className="action-btn submit-btn"
        >
          Submit
        </button>
      </div>
    </div>
  );
}