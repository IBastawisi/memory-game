const game = {
    moves: 0,
    matches: 0,
    mismatches: 0,
    compareRoom: [],

    // Comparison logic
    compare: function () {
        if (game.compareRoom.length === 2) {
            if (game.compareRoom[0].firstElementChild.classList.value === game.compareRoom[1].firstElementChild.classList.value) {
                ui.match(game.compareRoom);
            } else {
                ui.noMatch(game.compareRoom);
            }
            game.compareRoom = [];
        }

        switch (game.mismatches) {
            case 5:
                ui.stars[0].style.display = 'none';
                break;
            case 12:
                ui.stars[1].style.display = 'none';
                break;
        }

        if (game.matches === 8) {
            clearInterval(timer.interval);
            setTimeout(() => ui.pass(), 1000);
        }
    },

    newGame: function () {
        // Intialize all counters
        game.moves = 0;
        game.matches = 0;
        game.mismatches = 0;
        game.compareRoom = [];
        timer.running = false, timer.time = [0, 0, 0, 0];
        clearInterval(timer.interval), timer.interval = null;

        // Reset UI
        ui.deck.innerHTML = '';
        ui.shuffle([...ui.cards]).forEach(card => {
            card.classList.value = ('card');
            ui.deck.appendChild(card);
        });
        ui.stars.forEach(star => star.style.display = 'inline-block');
        ui.sync();

        // Open cards
        ui.cards.forEach(card => ui.open(card));

        // Close cards after 2 secs
        setTimeout(() => ui.cards.forEach(card => ui.close(card)), 2000);
    }
};

const ui = {
    deck: document.querySelector('.deck'),
    cards: document.querySelectorAll('.card'),
    moves: document.querySelector('.moves'),
    restart: document.querySelector('.restart'),
    time: document.querySelector(".time"),
    stars: document.querySelectorAll(".fa-star"),
    score: document.querySelector('.score-panel'),

    // Transitions
    open: function (card) {
        transition.begin(card, ["transform", "rotateY(180deg)", "rotateY(0)", "500ms", "linear"]);
        setTimeout(() => card.classList.add("open"), 250);
    },

    close: function (card) {
        transition.begin(card, ["transform", "rotateY(0)", "rotateY(180deg)", "500ms", "linear"]);
        setTimeout(() => card.classList.remove("open"), 250);
    },

    match: function (cards) {
        setTimeout(() => cards.forEach(card => card.classList.add("match")), 250);
        game.matches++;
    },

    noMatch: function (cards) {
        setTimeout(() => cards.forEach(card => ui.close(card)), 250);
        game.mismatches++;
    },

    pass: function () {
        setTimeout(() => ui.close(ui.deck), 500);
        if (window.innerWidth >= 700) {
            transition.begin(ui.deck, ["height", "680px", "500px", "500ms", "linear", "600ms"]);
        } else {
            transition.begin(ui.deck, ["height", "340px", "280px", "500ms", "linear", "600ms"]);
        }
        setTimeout(() => {
            ui.deck.innerHTML = '';
            ui.deck.classList.add('pass');
            ui.deck.appendChild(ui.score);
            ui.deck.appendChild(ui.restart);
            ui.score.insertAdjacentHTML('beforeBegin', `<img src="img/pass.gif" alt="pass"> <h2>YOU DID IT!</h2>`)
            ui.deck.style.transform = 'rotateY(0)';
        }, 750);

    },

    reset: function () {
        ui.close(ui.deck);
        ui.deck.innerHTML = ''
        if (window.innerWidth >= 700) {
            transition.begin(ui.deck, ["height", "500px", "680px", "500ms", "linear", "150ms"]);
        } else {
            transition.begin(ui.deck, ["height", "280px", "340px", "500ms", "linear", "150ms"]);
        }
        setTimeout(() => {
            ui.deck.style.transform = 'rotateY(0)';
            ui.deck.classList.remove('pass');
            ui.deck.insertAdjacentElement('beforeBegin', ui.score);
            ui.deck.insertAdjacentElement('afterEnd', ui.restart);
        }, 250)
    },

    // Shuffle function from http://stackoverflow.com/a/2450976
    shuffle: function (array) {
        var currentIndex = array.length, temporaryValue, randomIndex;

        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    },

    // Update screen
    sync: function () {
        if (game.moves % 2 === 0) {
            ui.moves.textContent = game.moves === 2 ? `${game.moves / 2} Move` : `${game.moves / 2} Moves`;
        }
        ui.time.textContent = `Time: ${timer.addZero(timer.time[0]) + ":" + timer.addZero(timer.time[1]) + ":" + timer.addZero(timer.time[2])}`;
    }

};

const timer = {
    interval: null,
    time: [0, 0, 0, 0],
    running: false,

    // Add zero
    addZero: function (time) {
        if (time <= 9) {
            time = "0" + time;
        }
        return time;
    },

    // Run timer
    run: function () {
        ui.sync();
        timer.time[3]++;
        timer.time[0] = Math.floor((timer.time[3] / 100) / 60);
        timer.time[1] = Math.floor((timer.time[3] / 100) - (timer.time[0] * 60));
        timer.time[2] = Math.floor(timer.time[3] - (timer.time[1] * 100) - (timer.time[0] * 6000));
    }
};
// Card click event
ui.deck.addEventListener('click', function (event) {
    if (event.target.classList.value === 'card') {
        if (!timer.running) {
            timer.interval = setInterval(timer.run, 10);
            timer.running = true;
        }
        ui.open(event.target);
        game.compareRoom.push(event.target);
        game.moves++;
        game.compare();
    }
});

// Restart click event
ui.restart.addEventListener('click', function (event) {
    if (ui.deck.classList.contains('pass')) {
        setTimeout(() => game.newGame(), 300);
        ui.reset();
    } else {
        game.newGame();
    }
});

// Let the game begin
game.newGame();