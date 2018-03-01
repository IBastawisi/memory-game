// Selectors & Global vars
const deck = document.querySelector('.deck');
const cards = document.querySelectorAll('.card');
const movesDiv = document.querySelector('.moves');
const restartBtn = document.querySelector('.restart');
const time = document.querySelector(".time");
const stars = document.querySelectorAll(".fa-star");
const score = document.querySelector('.score-panel');
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

function pass() {
    setTimeout(() => close(deck), 500);
    if (window.innerWidth >= 700) {
        transition.begin(deck, ["height", "680px", "500px", "500ms", "linear", "600ms"]);
    } else {
        transition.begin(deck, ["height", "340px", "280px", "500ms", "linear", "600ms"]);
    }
    setTimeout(() => {
        deck.innerHTML = '';
        deck.classList.add('pass');
        deck.appendChild(score);
        deck.appendChild(restartBtn);
        score.insertAdjacentHTML('beforeBegin', `<img src="img/pass.gif" alt="pass"> <h2>YOU DID IT!</h2>`)
        deck.style.transform = 'rotateY(0)';
    }, 750);

}

function reset() {
    close(deck);
    deck.innerHTML = ''
    if (window.innerWidth >= 700) {
        transition.begin(deck, ["height", "500px", "680px", "500ms", "linear", "150ms"]);
    } else {
        transition.begin(deck, ["height", "280px", "340px", "500ms", "linear", "150ms"]);
    }
    setTimeout(() => {
        deck.style.transform = 'rotateY(0)';
        deck.classList.remove('pass');
        deck.insertAdjacentElement('beforeBegin', score);
        deck.insertAdjacentElement('afterEnd', restartBtn);
    }, 250);

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
        case 5:
            stars[0].style.display = 'none';
            break;
        case 12:
            stars[1].style.display = 'none';
            break;
    }

    if (matched === cards.length / 2) {
        clearInterval(interval);
        setTimeout(() => pass(), 1000);
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
    stars.forEach(star => star.style.display = 'inline-block');
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
    if (deck.classList.contains('pass')) {
        setTimeout(() => newGame(), 300);
        reset();
    } else {
        newGame();
    }
});

// Let the game begin
newGame();