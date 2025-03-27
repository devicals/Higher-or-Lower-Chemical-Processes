const equations = [
    "N_2(g) + 3H_2(g) \\rightleftharpoons 2NH_3(g)", // Haber Process
    "2SO_2(g) + O_2(g) \\rightleftharpoons 2SO_3(g)"  // Contact Process
];

const conditions = ["pressure", "concentration of reactants", "concentration of products", "temperature"];
const changes = ["increase", "decrease"];

let score = 0,
    correctResponses = 0,
    incorrectResponses = 0;

const conditionCard = document.getElementById('condition-card');
const changeCard = document.getElementById('change-card');
const conditionText = document.getElementById('condition-text');
const changeText = document.getElementById('change-text');
const higherBtn = document.getElementById('higher-btn');
const lowerBtn = document.getElementById('lower-btn');
const scoreValue = document.getElementById('score-value');
const correctValue = document.getElementById('correct-value');
const incorrectValue = document.getElementById('incorrect-value');
const equationElement = document.getElementById('equation');
const popup = document.getElementById('popup');
const popupMessage = document.getElementById('popup-message');
const closePopup = document.getElementById('close-popup');
const infoButton = document.getElementById('info-button');
const infoPopup = document.getElementById('info-popup');
const closeInfoPopup = document.getElementById('close-info-popup');
const resetButton = document.getElementById('reset-button');

let currentCondition, currentChange;

function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function newRound() {
    // Reset cards
    conditionCard.classList.remove('flipped');
    changeCard.classList.remove('flipped');

    // Set "Condition" and "Change" text on card fronts
    const conditionCardFrontH2 = conditionCard.querySelector('.card-front h2');
    const changeCardFrontH2 = changeCard.querySelector('.card-front h2');
    conditionCardFrontH2.textContent = 'Condition';
    changeCardFrontH2.textContent = 'Change';

    currentCondition = getRandomItem(conditions);
    currentChange = getRandomItem(changes);

    // Set the condition/change text on the card backs
    conditionText.textContent = currentCondition;
    changeText.textContent = currentChange;

    equationElement.innerHTML = '\\(' + getRandomItem(equations) + '\\)';
    MathJax.typesetPromise();
}

function checkAnswer(isHigher) {
    let correct = false;

    // Simplified logic based on yield increase or decrease
    if (currentCondition === "pressure" || currentCondition === "concentration of reactants") {
        correct = (currentChange === "increase") === isHigher;
    } else if (currentCondition === "concentration of products" || currentCondition === "temperature") {
        correct = (currentChange === "increase") !== isHigher;
    }

    const clickedButton = isHigher ? higherBtn : lowerBtn;

    if (correct) {
        score++;
        correctResponses++;
        clickedButton.classList.add('correct');
        showPopup('Correct! The yield would ' + (isHigher ? 'increase' : 'decrease') + '.');
    } else {
        score = Math.max(0, score - 1);
        incorrectResponses++;
        clickedButton.classList.add('incorrect');
        showPopup('Incorrect. The yield would ' + (!isHigher ? 'increase' : 'decrease') + '.');
    }

    updateScoreboard();

    setTimeout(() => {
        clickedButton.classList.remove('correct', 'incorrect');
        slideToNextQuestion();
    }, 1000);
}

function updateScoreboard() {
    scoreValue.textContent = score;
    correctValue.textContent = correctResponses;
    incorrectValue.textContent = incorrectResponses;
}

function showPopup(message) {
    popupMessage.textContent = message;
    popup.classList.remove('hidden');
}

function hidePopup() {
    popup.classList.add('hidden');
}

function slideToNextQuestion() {
    const gameContainer = document.getElementById('game-container');
    gameContainer.style.transition = 'transform 0.5s ease-in-out';
    gameContainer.style.transform = 'translateX(-100%)';
    
    setTimeout(() => {
        gameContainer.style.transition = 'none';
        gameContainer.style.transform = 'translateX(100%)';
        newRound();
        
        setTimeout(() => {
            gameContainer.style.transition = 'transform 0.5s ease-in-out';
            gameContainer.style.transform = 'translateX(0)';
        }, 50);
    }, 500);
}

function resetGame() {
    score = 0;
    correctResponses = 0;
    incorrectResponses = 0;
    updateScoreboard();
    newRound();
}

conditionCard.addEventListener('click', () => conditionCard.classList.toggle('flipped'));
changeCard.addEventListener('click', () => changeCard.classList.toggle('flipped'));
higherBtn.addEventListener('click', () => checkAnswer(true));
lowerBtn.addEventListener('click', () => checkAnswer(false));
closePopup.addEventListener('click', hidePopup);
infoButton.addEventListener('click', () => infoPopup.classList.remove('hidden'));
closeInfoPopup.addEventListener('click', () => infoPopup.classList.add('hidden'));
resetButton.addEventListener('click', resetGame);

newRound();
infoPopup.classList.remove('hidden');
