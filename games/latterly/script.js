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
    { startWord: 'HONK', endWord: 'ZEST' },
];
// Get the current date
const currentDate = new Date();
const daysSinceMay222024 = Math.floor((new Date() - new Date('2024-05-22')) / (1000 * 60 * 60 * 24)) - 1;

// Retrieve the word set for the current day
const wordSet = wordSets[daysSinceMay222024];


// Extract the startWord and endWord from the selected word set
const startWord = wordSet.startWord;
const endWord = wordSet.endWord;

// Function to create and append letter divs to the specified container
function appendLetters(word, containerSelector) {
    const container = document.querySelector(containerSelector);
    for (let i = 0; i < word.length; i++) {
        const div = document.createElement('div');
        div.setAttribute('onclick', "select(this, this.getAttribute('data-letter'))");
        div.setAttribute('data-letter', (i + 1).toString());
        div.classList.add('letter');
        div.textContent = word[i];
        container.append(div);
    }
}

// Append letters for the start word
appendLetters(startWord, '#guess .current');

// Append letters for the end word
appendLetters(endWord, '#target');

let selectedLetter = 0;

// Function to handle letter selection
function select(element, letterNum) {
    const selectedElements = document.getElementsByClassName('selected');
    for (let i = 0; i < selectedElements.length; i++) {
        selectedElements[i].classList.remove('selected');
    }
    element.classList.add('selected');
    selectedLetter = letterNum;
}

// Function to construct a word based on selected letters
function getWord(textLetter, final) {
    const selectedLetters = document.querySelectorAll(final == 0 ? '#guess .letter' : '#target .letter');
    console.log(selectedLetters);
    console.log(textLetter);
    let word = "";
    let i = 1;
    selectedLetters.forEach(function (letter) {
        if (i == selectedLetter && !final) {
            word += textLetter;
        } else {
            word += letter.innerText;
        }
        i++;
    });
    word = word.replace(/[\r\n]+/g, ''); // Remove line breaks
    return word;
}

// Get the necessary elements
const result = document.getElementById('result');
let totalMoves = 0;
const keys = document.querySelectorAll('.key');
const numGuesses = document.querySelector('.guesses');
const pastGuesses = document.getElementById('past-guesses');
const tip = document.getElementById('tip');
const winner = getWord("!", 1); // Get the winning word

// Add event listener to each key
keys.forEach(function (key) {
    key.addEventListener('click', function () {
        if (selectedLetter !== 0) {
            tip.classList.remove("active");
            const newWord = getWord(this.innerText, 0);
            checkWord(newWord).then(isValid => {
                if (isValid) {
                    console.log(isValid);
                    totalMoves++;
                    numGuesses.innerText = totalMoves;
                    const selectedElement = document.querySelector('.selected');
                    if (selectedElement) {
                        selectedLetter = 0;
                        selectedElement.classList.remove('selected');
                        const sourceDiv = document.getElementById('guess');
                        const innerHTMLToCopy = sourceDiv.innerHTML;
                        pastGuesses.innerHTML += innerHTMLToCopy;
                        selectedElement.innerText = this.innerText;
                        if (newWord === winner) {
                            console.log("MATCH!");
                            document.getElementById('game').classList.add("gameover");
                            result.innerText = 'Congratulations!';
                        }
                    }
                }
            });
        }
        else{
            tip.classList.add("active");
        }
    });
});

// Function to check if a word exists
function checkWord(word) {
    word = word.replace(/[\r\n]+/g, '');
    return fetch('https://api.dictionaryapi.dev/api/v2/entries/en/' + word)
        .then(response => {
            if (!response.ok) {
                throw new Error('Word not found');
            }
            return response.json(); // Parse response body as JSON
        })
        .then(data => {
            result.innerText = '';
            return true; // Resolve the promise with true
        })
        .catch(error => {
            result.innerText = '"' + word + '" is not a valid word.';
            return false; // Reject the promise with false
        });
}

const info = document.getElementById("info");
const helpButton = document.getElementById("help");

// Toggle class active on #info when HELP button is clicked
helpButton.addEventListener("click", function() {
    info.classList.toggle("active");
});

// Hide #info when clicking anywhere on the document while it's visible
document.addEventListener("click", function(event) {
    if (info.classList.contains("active") && event.target !== helpButton) {
        info.classList.remove("active");
    }
});
