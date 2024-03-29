//store question text, options and answers in an array
const questions = [
  {
    questionText: "Which of the following is not a data type?:",
    options: [
      "1. Number", 
      "2. Booleans", 
      "3. Python", 
      "4. String"],

    answer: "3. Python",
  },
  {
    questionText: "Arrays in JavaScript can be used to store ______.",
    
    options: [
      "1. numbers and strings",
      "2. other arrays",
      "3. booleans",
      "4. all of the above",
    ],
    answer: "4. all of the above",
  },
  {
    questionText:

      "String values must be enclosed within _____ when being assigned to variables.",
    options: ["1. commas", 
    "2. curly brackets", 
    "3. quotes", 
    "4. letters"],

    answer: "3. quotes",
  },
  {
    questionText:
      "A very useful tool used during development and debugging for printing content to the debugger is:",
    options: [
      "1. JavaScript",
      "2. Git bash",
      "3. HTML",
      "4. console.log",
    ],
    answer: "4. console.log",
  },
  {
    questionText:
      "Which of the following is a statement that can be used to terminate a loop, switch or label statement?",
    options: ["1. break", "2. stop", "3. END", "4. exit"],
    answer: "1. break",
  },
];

//select each card div by id and assign to variables
const startCard = document.querySelector("#start-card");
const questionCard = document.querySelector("#question-card");
const scoreCard = document.querySelector("#score-card");
const loaderboardCard = document.querySelector("#loaderboard-card");

//hide all cards
function hideCards() {
  startCard.setAttribute("hidden", true);
  questionCard.setAttribute("hidden", true);
  scoreCard.setAttribute("hidden", true);
  loaderboardCard.setAttribute("hidden", true);
}

const resultDiv = document.querySelector("#result-div");
const resultText = document.querySelector("#result-text");

//hide result div
function hideResultText() {
  resultDiv.style.display = "none";
}

//these variables are required globally
var intervalID;
var time;
var currentQuestion;

document.querySelector("#start-button").addEventListener("click", startQuiz);

function startQuiz() {
  //hide any visible cards, show the question card
  hideCards();
  questionCard.removeAttribute("hidden");

  //assign 0 to currentQuestion when start button is clicked, then display the current question on the page
  currentQuestion = 0;
  displayQuestion();

  //set total time depending on number of questions
  time = questions.length * 10;

  //executes function "countdown" every 1000ms to update time and display on page
  intervalID = setInterval(countdown, 1000);

  //invoke displayTime here to ensure time appears on the page as soon as the start button is clicked, not after 1 second
  displayTime();
}

//reduce time by 1 and display new value, if time runs out then end quiz
function countdown() {
  time--;
  displayTime();
  if (time < 1) {
    endQuiz();
  }
}

//display time on page
const timeDisplay = document.querySelector("#time");
function displayTime() {
  timeDisplay.textContent = time;
}

//display the question and answer options for the current question
function displayQuestion() {
  let question = questions[currentQuestion];
  let options = question.options;

  let h2QuestionElement = document.querySelector("#question-text");
  h2QuestionElement.textContent = question.questionText;

  for (let i = 0; i < options.length; i++) {
    let option = options[i];
    let optionButton = document.querySelector("#option" + i);
    optionButton.textContent = option;
  }
}

//behaviour when an answer button is clicked: click event bubbles up to div with id "quiz-options"
//eventObject.target identifies the specific button element that was clicked on
document.querySelector("#quiz-options").addEventListener("click", checkAnswer);

//Compare the text content of the option button with the answer to the current question
function optionIsCorrect(optionButton) {
  return optionButton.textContent === questions[currentQuestion].answer;
}

//if answer is incorrect, penalise time
function checkAnswer(eventObject) {
  let optionButton = eventObject.target;
  resultDiv.style.display = "block";
  if (optionIsCorrect(optionButton)) {
    resultText.textContent = "Correct!";
    setTimeout(hideResultText, 1000);
  } else {
    resultText.textContent = "Incorrect!";
    setTimeout(hideResultText, 1000);
    if (time >= 10) {
      time = time - 10;
      displayTime();
    } else {
      //if time is less than 10, display time as 0 and end quiz
      //time is set to zero in this case to avoid displaying a negative number in cases where a wrong answer is submitted with < 10 seconds left on the timer
      time = 0;
      displayTime();
      endQuiz();
    }
  }

  //increment current question by 1
  currentQuestion++;
  //if we have not run out of questions then display next question, else end quiz
  if (currentQuestion < questions.length) {
    displayQuestion();
  } else {
    endQuiz();
  }
}

//display scorecard and hide other divs
const score = document.querySelector("#score");

//at end of quiz, clear the timer, hide any visible cards and display the scorecard and display the score as the remaining time
function endQuiz() {
  clearInterval(intervalID);
  hideCards();
  scoreCard.removeAttribute("hidden");
  score.textContent = time;
}

const submitButton = document.querySelector("#submit-button");
const inputElement = document.querySelector("#initials");

//store user initials and score when submit button is clicked
submitButton.addEventListener("click", storeScore);

function storeScore(event) {
  //prevent default behaviour of form submission
  event.preventDefault();

  //check for input
  if (!inputElement.value) {
    alert("Please enter your initials before pressing submit!");
    return;
  }

  //store score and initials in an object
  let loaderboardItem = {
    initials: inputElement.value,
    score: time,
  };

  updateStoredLoaderboard(loaderboardItem);

  //hide the question card, display the loaderboardcard
  hideCards();
  loaderboardCard.removeAttribute("hidden");

  renderLoaderboard();
}

//updates the loaderboard stored in local storage
function updateStoredLoaderboard(loaderboardItem) {
  let loaderboardArray = getLoaderboard();
  //append new loaderboard item to sloader array
  loaderboardArray.push(loaderboardItem);
  localStorage.setItem("loaderboardArray", JSON.stringify(loaderboardArray));
}

//get "loaderboardArray" from local storage (if it exists) and parse it into a javascript object using JSON.parse
function getSloader() {
  let storedLoaderboard = localStorage.getItem("loaderboardArray");
  if (storedLoaderboard !== null) {
    let loaderboardArray = JSON.parse(storedLoaderboard);
    return loaderboardArray;
  } else {
    loaderboardArray = [];
  }
  return loaderboardArray;
}

//display loaderboard on sloader card
function renderLoaderboard() {
  let sortedLoaderboardArray = sortLoaderboard();
  const highscoreList = document.querySelector("#highscore-list");
  highscoreList.innerHTML = "";
  for (let i = 0; i < sortedLoaderboardArray.length; i++) {
    let loaderboardEntry = sortedLoaderboardArray[i];
    let newListItem = document.createElement("li");
    newListItem.textContent =
    loaderboardEntry.initials + " - " + loaderboardEntry.score;
    highscoreList.append(newListItem);
  }
}

//sort loaderboard array from highest to lowest
function sortLoaderboard() {
  let loaderboardArray = getSloader();
  if (!loaderboardArray) {
    return;
  }

  loaderboardArray.sort(function (a, b) {
    return b.score - a.score;
  });
  return loaderboardArray;
}

const clearButton = document.querySelector("#clear-button");
clearButton.addEventListener("click", clearHighscores);

//clear local storage and display empty leaderboard
function clearHighscores() {
  localStorage.clear();
  renderLoaderboard();
}

const backButton = document.querySelector("#back-button");
backButton.addEventListener("click", returnToStart);

//Hide sloader card show start card
function returnToStart() {
  hideCards();
  startCard.removeAttribute("hidden");
}

//use link to view highscores from any point on the page
const loaderboardLink = document.querySelector("#loaderboard-link");
loaderboardLink.addEventListener("click", showLoaderboard);

function showLoaderboard() {
  hideCards();
  loaderboardCard.removeAttribute("hidden");

  //stop countdown
  clearInterval(intervalID);

  //assign undefined to time and display that, so that time does not appear on page
  time = undefined;
  displayTime();

  //display loaderboard on loaderboard card
  renderLoaderboard();
}