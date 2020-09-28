const wordInput = document.querySelector(".word-input");
const wordDisplay = document.querySelector(".word-display");
const scoreDisplay = document.querySelector(".score");
const timeDisplay = document.querySelector(".time");
const button = document.querySelector(".button");

const GAME_TIME = 5;

let score = 0;
let time = GAME_TIME;
let isPlaying = false;
let timeInterval;
let checkInterval;
let words = [];

function startClick() {
    if(isPlaying) {
        return;
    }
    isPlaying = true;
    time = GAME_TIME;
    score = 0;
    scoreDisplay.innerText = score;
    wordInput.focus();
    buttonChange("게임중")
    timeInterval = setInterval(countDown, 1000);
    checkInterval = setInterval(checkStatus, 50);
}

function getWords() {
    fetch(`https://random-word-api.herokuapp.com/word?number=100`).then(function (response) {
        return response.json();
    }).then(function (json) {
        json.forEach(word => {
            if(word.length < 10) {
                words.push(word);
            }
        })
        buttonChange("게임시작")
    })
}

function checkStatus() {
    if(!isPlaying && time === 0) {
        clearInterval(checkInterval);
        buttonChange("게임시작");
    }
}

function buttonChange(text) {
    button.innerText = text;
    text === "게임시작" ? button.classList.remove("loading") : button.classList.add("loading");
}

function countDown() {
    time > 0 ? time-- : isPlaying = false;
    timeDisplay.innerText = time;
    if (!isPlaying) {
        clearInterval(timeInterval);
    }
}

function checkMatch() {
    if (wordInput.value.toLowerCase() === wordDisplay.innerText.toLowerCase()) {
        wordInput.value = "";
        if(!isPlaying) {
            return;
        }
        score++;
        scoreDisplay.innerText = score;
        const randomIndex = Math.floor(Math.random() * words.length);
        wordDisplay.innerText = words[randomIndex];
    }
}

function init() {
    buttonChange("게임로딩중..");
    getWords();
    wordInput.addEventListener("input", checkMatch);
    button.addEventListener("click", startClick);
}
init();