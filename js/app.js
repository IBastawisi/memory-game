// Selectors & Global vars
const deck = document.querySelector('.deck');
const cards = document.querySelectorAll('.card');
const movesDiv = document.querySelector('.moves');
const restartBtn = document.querySelector('.restart');
const time = document.querySelector(".time");
const stars = document.querySelectorAll(".fa-star");
var moves, matched, mismatched, compareRoom, interval, timer;

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
    transition.begin(card, ["transform", "rotateY(180deg)", "rotateY(0)", "500ms", "linear"]);
    setTimeout(() => card.classList.add("open"), 250);
}

function close(card) {
    transition.begin(card, ["transform", "rotateY(0)", "rotateY(180deg)", "500ms", "linear"]);
    setTimeout(() => card.classList.remove("open"), 250);
}

function match(cards) {
    setTimeout(() => cards.forEach(card => card.classList.add("match")), 250);
    matched++;
}

function noMatch(cards) {
    setTimeout(() => cards.forEach(card => close(card)), 250);
    mismatched++;
}

// Add zero
function leadingZero(time) {
    if (time <= 9) {
        time = "0" + time;
    }
    return time;
}

// Run timer
function runTimer() {
    sync();
    timer[3]++;

    timer[0] = Math.floor((timer[3] / 100) / 60);
    timer[1] = Math.floor((timer[3] / 100) - (timer[0] * 60));
    timer[2] = Math.floor(timer[3] - (timer[1] * 100) - (timer[0] * 6000));
}

// Comparison logic
function compare() {
    if (compareRoom.length === 2) {
        if (compareRoom[0].firstElementChild.classList.value === compareRoom[1].firstElementChild.classList.value) {
            match(compareRoom);
        } else {
            noMatch(compareRoom);
        }
        compareRoom = [];
    }

    switch (mismatched) {
        case 3:
            stars[0].style.display = 'none';
            break;
        case 6:
            stars[1].style.display = 'none';
            break;
        case 10:
            stars[2].style.display = 'none';
            break;
        case 15:
            stars[3].style.display = 'none';
            break;
    }

    if (matched === cards.length / 2) {
        clearInterval(interval);
        // Show score
    }
}

function sync() {
    movesDiv.textContent = moves === 1 ? `${moves} Move` : `${moves} Moves`;
    time.textContent = `Time: ${leadingZero(timer[0]) + ":" + leadingZero(timer[1]) + ":" + leadingZero(timer[2])}`;
}

function newGame() {
    // Intialize all counters
    moves = 0; matched = 0; mismatched = 0; compareRoom = []; timer = [0, 0, 0, 0];
    clearInterval(interval);
    interval = null;

    // Reset HTML
    deck.innerHTML = '';
    shuffle([...cards]).forEach(card => {
        card.classList.value = ('card');
        deck.appendChild(card);
    });
    sync();

    // Open cards
    cards.forEach(card => open(card));

    // Close cards after 2 secs
    setTimeout(() => cards.forEach(card => close(card)), 2000);

    // Start the timer
    setTimeout(() => interval = setInterval(runTimer, 10), 2250);
}

// Card click event
deck.addEventListener('click', function (event) {
    if (event.target.classList.value === 'card') {
        open(event.target);
        compareRoom.push(event.target);
        moves++;
        compare();
    }
});

// Restart click event
restartBtn.addEventListener('click', function (event) {
    newGame();
});

// Let the game begin
newGame();