const state = {
    view: {
        startScreen: document.getElementById("start-screen"),
        gameScreen: document.getElementById("game-screen"),
        gameOverScreen: document.getElementById("game-over-screen"),
        startButton: document.getElementById("start-game-btn"),
        restartButton: document.getElementById("restart-game-btn"),
        squares: document.querySelectorAll(".square"),
        enemy: document.querySelector(".enemy"),
        timeLeft: document.getElementById("time-left"),
        score: document.getElementById("score"),
        lives: document.getElementById("lives"),
        finalScore: document.getElementById("final-score"),
    },
    values: {
        hitPosition: 0,
        result: 0,
        currentTime: 60,
        lastRandomNumber: -1,
        speed: 1000,
        lives: 3,
        gameOver: false,
    },
    actions: {
        timerId: null,
        countDownTimerId: null,
    }
};

function switchScreen(toShow, toHide) {
    toHide.style.display = "none";
    toShow.style.display = "flex";
}

function countDown() {
    if (state.values.gameOver) return;

    state.values.currentTime--;
    state.view.timeLeft.textContent = state.values.currentTime;

    if (state.values.currentTime < 0) {
        endGame();
    }
}

function playSound(audioName) {
    let audio = new Audio(`./src/audios/${audioName}.m4a`);
    audio.volume = 0.05;
    audio.play();
}

function randomSquare() {
    if (state.values.lives <= 0 || state.values.gameOver) return;

    state.view.squares.forEach((square) => {
        square.classList.remove("enemy");
    });

    let randomNumber;
    do {
        randomNumber = Math.floor(Math.random() * 9);
    } while (randomNumber === state.values.lastRandomNumber);

    state.values.lastRandomNumber = randomNumber;

    let randomSquare = state.view.squares[randomNumber];
    randomSquare.classList.add("enemy");
    state.values.hitPosition = randomSquare.id;

    setTimeout(() => {
        if (state.values.hitPosition !== null && !state.values.gameOver) {
            loseLife();
        }
    }, state.values.speed);
}

function addListenerHitBox() {
    state.view.squares.forEach((square) => {
        square.addEventListener("mousedown", () => {
            if (square.id === state.values.hitPosition && !state.values.gameOver) {
                state.values.result++;
                state.view.score.textContent = state.values.result;
                state.values.hitPosition = null;
                playSound("hit");

                square.classList.add("ralph-hit");
                setTimeout(() => {
                    square.classList.remove("ralph-hit");
                }, 500);

                state.values.speed = Math.max(500, state.values.speed - 25);

                clearInterval(state.actions.timerId);
                state.actions.timerId = setInterval(randomSquare, state.values.speed);
            }
        });
    });
}

function loseLife() {
    playSound("glassBreak");
    state.values.lives--;
    state.view.lives.textContent = state.values.lives;

    if (state.values.lives <= 0) {
        setTimeout(() => {
            endGame();
        }, 100);
    }
}

function endGame() {
    clearInterval(state.actions.timerId);
    clearInterval(state.actions.countDownTimerId);
    state.values.gameOver = true;

    playSound("gameover");
    state.view.finalScore.textContent = state.values.result;
    switchScreen(state.view.gameOverScreen, state.view.gameScreen);
}

function startGame() {
    state.values = {
        hitPosition: 0,
        result: 0,
        currentTime: 60,
        lastRandomNumber: -1,
        speed: 1000,
        lives: 3,
        gameOver: false,
    };
    state.view.score.textContent = state.values.result;
    state.view.timeLeft.textContent = state.values.currentTime;
    state.view.lives.textContent = state.values.lives;

    playSound("wreck-it");
    addListenerHitBox();

    state.actions.timerId = setInterval(randomSquare, state.values.speed);
    state.actions.countDownTimerId = setInterval(countDown, 1000);

    switchScreen(state.view.gameScreen, state.view.startScreen);
}

state.view.startButton.addEventListener("click", startGame);
state.view.restartButton.addEventListener("click", () => {
    switchScreen(state.view.startScreen, state.view.gameOverScreen);
});
