const wordSets = [
    { startWord: 'BEAN', endWord: 'CART' },     // March 21
    { startWord: 'LEAP', endWord: 'FROG' },     // March 22
    { startWord: 'GOLD', endWord: 'SACK' },     // March 23
    { startWord: 'DARK', endWord: 'MOON' },     // March 24
    { startWord: 'PALM', endWord: 'TREE' },     // March 25 PALM SUNDAY
    { startWord: 'HARD', endWord: 'NAIL' },     // March 26
    { startWord: 'LOVE', endWord: 'BIRD' },     // March 27
    { startWord: 'HIGH', endWord: 'JUMP' },     // March 28 
    { startWord: 'GOOD', endWord: 'DEAD' },     // March 29 GOOD FRIDAY
    { startWord: 'LONG', endWord: 'WALK' },     // March 30 
    { startWord: 'LAMB', endWord: 'LIFE' },     // March 31 EASTER
    { startWord: 'FOOL', endWord: 'DAYS' },     // April 1 APRIL FOOLS
];
// Get the current date
const currentDate = new Date();
const daysSinceMarch032024 = Math.floor((new Date() - new Date('2024-03-20')) / (1000 * 60 * 60 * 24)) - 1;

// Retrieve the word set for the current day
const wordSet = wordSets[daysSinceMarch032024];


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
const winner = getWord("!", 1); // Get the winning word

// Add event listener to each key
keys.forEach(function (key) {
    key.addEventListener('click', function () {
        if (selectedLetter !== 0) {
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
