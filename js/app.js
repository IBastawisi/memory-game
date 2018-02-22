// Selectors
const deck = document.querySelector('.deck');
const cards = document.querySelectorAll('.card')

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// Transition animation
function open(card) {
    transition.begin(card, ["transform", "rotateY(0)", "rotateY(180deg)", "500ms", "linear"]);
    setTimeout(() => card.classList.add("open"), 250);
}

function close(card) {
    transition.begin(card, ["transform", "rotateY(180deg)", "rotateY(0)", "500ms", "linear"]);
    setTimeout(() => card.classList.remove("open"), 250);
}

// Update HTML
deck.innerHTML = '';
shuffle([...cards]).forEach(card => deck.appendChild(card));

// Open cards on new game
cards.forEach(card => open(card));

// Close cards after 2 secs
setTimeout(() => cards.forEach(card => close(card)), 2000);

//Set up the event listener for a card. If a card is clicked:
cards.forEach(card => card.addEventListener('click', function (event) {
    open(event.target);

}));
/* 
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
