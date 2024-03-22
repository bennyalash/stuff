
                // Define the words
                const start_word = 'BEAN';
                const end_word = 'CART';

                // Get the container where the elements will be appended
                const container = document.querySelector('#guess .current');

                // Loop through each character of the word
                for (let i = 0; i < start_word.length; i++) {
                    // Create a div element
                    const div = document.createElement('div');

                    // Set attributes for the div
                    div.setAttribute('onclick', "select(this, this.getAttribute('data-letter'))");
                    div.setAttribute('data-letter', (i + 1).toString());
                    div.classList.add('letter');

                    // Set the text content of the div to the current character of the word
                    div.textContent = start_word[i];

                    // Append the div to the container
                    container.append(div);
                }

                // Get the container where the elements will be appended
                const target = document.getElementById('target');

                // Loop through each character of the word
                for (let i = 0; i < end_word.length; i++) {
                    // Create a div element
                    const div = document.createElement('div');

                    // Set class for the div
                    div.classList.add('letter');

                    // Set the text content of the div to the current character of the word
                    div.textContent = end_word[i];

                    // Append the div to the container
                    target.appendChild(div);
                }
                var SelectedLetter = 0;

                function select(element, letterNum) {
                    var selectedElements = document.getElementsByClassName('selected');
                    for (var i = 0; i < selectedElements.length; i++) {
                        selectedElements[i].classList.remove('selected');
                    }
                    element.classList.add('selected');
                    SelectedLetter = letterNum;
                }

                function GetWord(textLetter, final) {
    if (final == 0) {
        var selectedLetters = document.querySelectorAll('#guess .letter');
    } else {
        var selectedLetters = document.querySelectorAll('#target .letter');
    }

    var word = "";
    var i = 1;
    selectedLetters.forEach(function (letter) {
        if (i == SelectedLetter && !final) {
            word += textLetter;
        } else {
            word += letter.innerText;
        }
        i++;
    });

    // Remove line breaks from the word
    word = word.replace(/[\r\n]+/g, '');

    return word;
}
                // Select all elements with the class "key"
                var result = document.getElementById('result');
                var totalMoves = 0;
                var keys = document.querySelectorAll('.key');
                var numGuesses = document.querySelector('.guesses');
                var pastGuesses = document.getElementById('past-guesses');
                var winner = GetWord("!", 1);
                console.log(winner);

                // Add a click event listener to each key
                keys.forEach(function (key) {
                    key.addEventListener('click', function () {
                      if(SelectedLetter != 0){
                        // Call TypeLetter function with the clicked letter
                        var newWord = GetWord(this.innerText, 0);

                        // Check if the new word is valid
                        checkWord(newWord).then(isValid => {
                            if (isValid) {
                                totalMoves++;
                                numGuesses.innerText = totalMoves;
                                console.log(totalMoves);
                                // Replace the selected letter with the clicked key's letter
                                var selectedElement = document.querySelector('.selected');
                                if (selectedElement) {
                                    SelectedLetter = 0;
                                    selectedElement.classList.remove('selected');

                                    var sourceDiv = document.getElementById('guess');
                                    var innerHTMLToCopy = sourceDiv.innerHTML;

                                    pastGuesses.innerHTML += innerHTMLToCopy;
                                    selectedElement.innerText = this.innerText;

                                    if (newWord == winner) {
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


                function checkWord(word) {
                    word = word.replace(/[\r\n]+/g, '');
                    
                    // Make an API request to check if the word exists in WordNet
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
