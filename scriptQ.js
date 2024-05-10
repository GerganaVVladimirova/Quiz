let shuffledQuestions = [];
let currentQuestionIndex = 0;
let score = 0;

// Function to shuffle an array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Function to fetch questions from the server
async function fetchQuestions() {
  try {
    const response = await fetch("/questions"); // endpoint
    const data = await response.json();
    return data.questions;
  
  } catch (error) {
    console.error("Error fetching questions:", error);
    return [];
  }
}

// Function to initialize the quiz
async function initializeQuiz() {
  const questions = await fetchQuestions();
  if (questions.length > 0) {
    // Make a copy of the questions array and shuffle it
    shuffledQuestions = [...questions];

    shuffleArray(shuffledQuestions);
    shuffledQuestions = shuffledQuestions.slice(0, 60);
    // Start the quiz
    loadNextQuestion();
  } else {
    console.error("No questions found.");
  }
}

// Function to load the next question
function loadNextQuestion() {
  if (currentQuestionIndex < shuffledQuestions.length) {
    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    displayQuestion(currentQuestion);

    let questionNum = document.getElementById("number");
    questionNum.innerText = ` Question  ${currentQuestionIndex + 1}`;
  } else {
    endQuiz();
  }
}

// Function to display a question
function displayQuestion(question) {
  const questionElem = document.getElementById("question");
  const optionsElem = document.getElementById("options");

  questionElem.textContent = question.question;
  optionsElem.innerHTML = "";
  let sheffuledOptions = Array.from(question.options);
  shuffleArray(sheffuledOptions);
  console.log(sheffuledOptions)

  sheffuledOptions.forEach((option) => {
    const input = document.createElement(question.multiple ? "input" : "input");
    input.type = question.multiple ? "checkbox" : "radio";
    input.name = "option";
    input.value = option;
    optionsElem.appendChild(input);

    const label = document.createElement("label");
    label.textContent = option;
    optionsElem.appendChild(label);

    optionsElem.appendChild(document.createElement("br"));
  });

  const submitButton = document.createElement("button");
  submitButton.textContent = "Submit";
  submitButton.onclick = () => checkAnswer(question.answers);
  optionsElem.appendChild(submitButton);
}

// Function to check the answer
function checkAnswer(correctAnswers) {
  const selectedOptions = Array.from(
    document.querySelectorAll('input[name="option"]:checked')
  ).map((input) => input.value);

  if(selectedOptions.every(item => correctAnswers.includes(item)) && correctAnswers.every(item => selectedOptions.includes(item))){
    score++;
  }
  else {
    alert("the correct is " + correctAnswers);
  }
  currentQuestionIndex++;
  loadNextQuestion();
}

function endQuiz() {
  // Save score to localStorage for access on the score page
  localStorage.setItem("quizScore", score);
  // Redirect to the score page
  window.location.href = "score.html";
  handleFileDelete();
}

// Call initializeQuiz to start the quiz
initializeQuiz();

var timer;

function countDown(i, callback) {
  //callback = callback || function(){};
  timer = setInterval(function () {

    minutes = parseInt(i / 60, 10);
    seconds = parseInt(i % 60, 10);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    document.getElementById("time").innerHTML = "You have " + minutes + " min " + " " + seconds + " sec left";

    i-- || (clearInterval(timer), callback());
  }, 1000);
}

window.onload = function () {
  countDown(60, function () { //3600
    handleFileDelete();
    endQuiz()

  });

}

 async function handleFileDelete() {
  shuffledQuestions=[];
  const response = await fetch('/delete', { 
    method: 'POST'
});
}