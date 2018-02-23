// Selectors & Global vars
const deck = document.querySelector('.deck');
const cards = document.querySelectorAll('.card');
const movesSpan = document.querySelector('.moves');
const restartBtn = document.querySelector('.restart');
var moves, matched, accuracy, compareRoom;

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

// Transitions
function open(card) {
    transition.begin(card, ["transform", "rotateY(0)", "rotateY(180deg)", "500ms", "linear"]);
    setTimeout(() => card.classList.add("open"), 250);
}

function close(card) {
    transition.begin(card, ["transform", "rotateY(180deg)", "rotateY(0)", "500ms", "linear"]);
    setTimeout(() => card.classList.remove("open"), 250);
}

function match() {
    [...compareRoom].forEach(card => card.classList.add("match"))
}

function noMatch() {
    [...compareRoom].forEach(card => close(card));
}

// Comparison logic
function compare() {
    if (compareRoom.length === 2) {
        if (compareRoom[0].firstElementChild.classList.value === compareRoom[1].firstElementChild.classList.value) {
            match();
            matched++;
        } else {
            noMatch();
            accuracy--;
        }
        compareRoom = [];
    }
    // Todo: if complete show a modal
}

function updateScore() {
    movesSpan.textContent = moves;
    // Todo: update stars
}

function newGame() {

    // Intialize all counters
    moves = 0, matched = 0, accuracy = 30, compareRoom = [];

    // Reset HTML
    deck.innerHTML = '';
    shuffle([...cards]).forEach(card => {
        card.classList.value = ('card');
        deck.appendChild(card)
    });
    movesSpan.textContent = moves

    // Open cards
    cards.forEach(card => open(card));

    // Close cards after 2 secs
    setTimeout(() => cards.forEach(card => close(card)), 2000);
}

// Card click event
deck.addEventListener('click', function (event) {
    if (event.target.classList.value === 'card') {
        open(event.target);
        compareRoom.push(event.target);
        moves++;
        updateScore();
        setTimeout(() => compare(), 500);
    }
});

// Restart click event
restartBtn.addEventListener('click', function (event) {
    newGame();
});

// Let the game begin
newGame();