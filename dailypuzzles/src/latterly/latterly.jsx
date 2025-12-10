import { useEffect, useState } from "react";
import { Keyboard } from "./Keyboard";
import Flowers from "../flowers";
import { Home, MoveRight, MoveLeft, Target } from 'lucide-react';
import { Routes, Route, Link } from "react-router-dom"

const wordSets = [
    { startWord: 'BEAN', endWord: 'CART' },
    { startWord: 'LEAP', endWord: 'FROG' },
    { startWord: 'GOLD', endWord: 'SACK' },
    { startWord: 'DARK', endWord: 'MOON' },
    { startWord: 'PALM', endWord: 'TREE' },
    { startWord: 'HARD', endWord: 'NAIL' },
    { startWord: 'LOVE', endWord: 'BIRD' },
    { startWord: 'HIGH', endWord: 'JUMP' },
    { startWord: 'GOOD', endWord: 'DEAD' },
    { startWord: 'LONG', endWord: 'WALK' },
    { startWord: 'LAMB', endWord: 'LIFE' },
    { startWord: 'FOOL', endWord: 'DAYS' },
    { startWord: 'TALE', endWord: 'FUNK' },
    { startWord: 'SUNK', endWord: 'MOSS' },
    { startWord: 'COOK', endWord: 'LOGO' },
    { startWord: 'JOKE', endWord: 'GOLF' },
    { startWord: 'CAPE', endWord: 'COLD' },
    { startWord: 'LANE', endWord: 'DICE' },
    { startWord: 'MAYO', endWord: 'BANS' },
    { startWord: 'HOSE', endWord: 'LAWS' },
    { startWord: 'WISE', endWord: 'SASH' },
    { startWord: 'SAVE', endWord: 'FOLD' },
    { startWord: 'BONE', endWord: 'CHIN' },
    { startWord: 'SOOT', endWord: 'HOLY' },
    { startWord: 'GOAT', endWord: 'HOAX' },
    { startWord: 'WAND', endWord: 'NOSE' },
    { startWord: 'LONG', endWord: 'BALL' },
    { startWord: 'VAST', endWord: 'RENT' },
    { startWord: 'PARK', endWord: 'TURN' },
    { startWord: 'HONK', endWord: 'ZEST' }
];

export default function Latter() {
    const [startWord, setStartWord] = useState("");
    const [endWord, setEndWord] = useState("");
    const [GO, setGO] = useState(false);

    const [currentWord, setCurrentWord] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [pastGuesses, setPastGuesses] = useState([]);
    const [moves, setMoves] = useState(0);
    const [message, setMessage] = useState("");
    const [valid, setValid] = useState(true);

    // select puzzle of the day
    useEffect(() => {
        const days = Math.floor((new Date() - new Date("2024-05-21")) / (1000 * 60 * 60 * 24)) - 1;
        const puzzle = wordSets[days % wordSets.length];

        setStartWord(puzzle.startWord);
        setEndWord(puzzle.endWord);
        setCurrentWord(puzzle.startWord);
    }, []);

    function handleLetterClick(index) {
        setValid(true)
        setSelectedIndex(index);
    }

    async function handleKeyPress(letter) {
        setValid(true)
        if (selectedIndex == null) return;

        const newWord = currentWord
            .split("")
            .map((c, i) => (i === selectedIndex ? letter : c))
            .join("");

        const isValid = await checkWord(newWord);

        if (!isValid) return;

        // valid move
        setMoves(m => m + 1);
        setPastGuesses(g => [currentWord, ...g]);
        setCurrentWord(newWord);
        //setSelectedIndex(null);

        if (newWord.toLowerCase() === endWord.toLowerCase()) {
            setGO(true);
        }
    }

    function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

    async function checkWord(word) {
        try {
            const res = await fetch("https://api.dictionaryapi.dev/api/v2/entries/en/" + word);

            if (!res.ok) throw new Error("Invalid");

            setMessage("");
            return true;

        } catch {
setMessage(`"${capitalize(word.toLowerCase())}" is not a valid word.`);
            setValid(false)
            return false;
        }
    }
    //return ( <Flowers />);
    return (
        <div className={`latter-game game ${GO && 'game-over'}`}>  
     
                {message != "" && !GO && <div className="invalid">{message}</div>}
                <div className="final-word word">
                <div className="flowers-container">
                {GO && <Flowers />}
                </div>
                                {/*<div className="row-icon"><Target size={28} /></div>*/}

                    {endWord.split("").map((letter, i) => (
                        <div
                            key={i}
                            className={`letter`}
                        >
                            {letter}
                        </div>
                    ))}
                </div>              
            <div className="current-word word">
               {/* <div className="row-icon"><MoveRight size={24} /></div>*/}
                {currentWord.split("").map((letter, i) => (
                    <div
                        key={i}
                        className={`letter ${!valid && "notavalidword"} ${selectedIndex === i ? "selected" : ""}`}
                        onClick={() => handleLetterClick(i)}
                    >
                        {selectedIndex === i ? letter : letter}
                    </div>
                ))}
            </div>
            <div className="past-guesses">
                {pastGuesses.map((word, ip) => (
                    <div className="past-word word" style={{filter: "brightness("+ (1 - (ip+2)/15) + ")"}}>
                        {word.split("").map((letter, i) => (
                            <div
                                key={word+i}
                                className={`letter`}
                                
                            >
                                {letter}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            {!GO && <Keyboard onKeyPress={!GO && handleKeyPress} />}
            {GO && <div className="keyboard">
            <h2>Congrats!</h2>
            <p>You Solved Roots in {moves} Moves!</p>
            <Link to="/"><button>More Puzzles</button></Link>
            </div>}
        </div>
    );
}
