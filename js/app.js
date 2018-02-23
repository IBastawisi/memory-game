// Selectors
const deck = document.querySelector('.deck');
const cards = document.querySelectorAll('.card');
var compareRoom = [];


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

function match() {
    [...compareRoom].forEach(card => card.classList.add("match"))
}

// Comparison logic
function compare() {
    if (compareRoom.length === 2) {
        if (compareRoom[0].firstElementChild.classList.value === compareRoom[1].firstElementChild.classList.value) {
            match();
        } else {
            [...compareRoom].forEach(card => close(card));
        }
        compareRoom = [];
    } else {
        null
    }
}

// Update HTML
deck.innerHTML = '';
shuffle([...cards]).forEach(card => deck.appendChild(card));

// Open cards on new game
cards.forEach(card => open(card));

// Close cards after 2 secs
setTimeout(() => cards.forEach(card => close(card)), 2000);

//Set up the event listener for a card. If a card is clicked:
deck.addEventListener('click', function (event) {
    event.target.classList.contains('card') ? (open(event.target), compareRoom.push(event.target)) : null;
    setTimeout(() => compare(), 500);
});

// if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)