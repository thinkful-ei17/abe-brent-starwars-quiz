'use strict';
// TODO: Refactor into OOP and clean up code

//STORE holds data about the current state
/*currentQuestion initialized at -1 so that on first call
it changes to 0 so we can access the 0 index.
*/
const STORE = {
  view: 'start',
  currentQuestion: -1,
  currentScore: 0,
  userAnswer: []
};
//These are the questions and answers for the quiz
//We use the id key/value pair to compare it to the correctAnswer
let questions = null;
let character = null; 

function fetchQuestions(callback){
  const cb = callback;
  $.getJSON('/questions.json', 
    res => {questions = res;
    cb();});
}

function fetchCharacters(callback){
  const cb = callback;
  $.getJSON('/characters.json', res => {character = res;
    cb();});
}

const feedback = {
   correct : {src: 'correct.gif', alt: "Galactic soldiers known as Storm Troopers dance with joy in celebration to the correct answer", feedback: "right"},
   incorrect : {src: 'incorrect.gif', alt:"The primary hero of the Star Wars universe, Luke Skywalker screams in agony as a result to the incorrect answer", feedback: "wrong"}
  
}

//responsible for delegating what happens when 'start' button is clicked.
function handleStartClicked() {
  /*telling it to look at the div with the 'intro' class and 
  listen for a submit event on a child form element that is
  later added into the DOM when generateQuiz is called*/
  $('.intro').submit(function (event) {
    //using preventDefault to stop the page from refreshing
    event.preventDefault();
    //setting the value of the 'view' property in the STORE object to 'quiz'
    STORE.view = 'quiz';
    /*updateQuestion checks to see if there is a next question
    if there is, then it returns it*/
    updateQuestion();
    //Call to render page
    renderQuiz();
  });
}

//responsible for delegating what happens when 'answer' button is clicked
function handleAnswerClicked() {
  /*telling it to look at the div with the 'quiz' class and 
  listen for a submit event on a child form element that is
  later added into the DOM when generateNextButton is called*/
  $('.quiz').submit(function (event) {
    //using preventDefault to stop the page from refreshing
    event.preventDefault();
    //appends a 'next' button on the page
    generateNextButton();
    //removes the 'answer' button
    $('.answer-button').remove();
    /*toggles the 'incorrect' class on all questions 
    which is linked to a css ruleset to add a strikethrough*/
    $('label').toggleClass('incorrect');
    $('label').attr('aria-value',"Incorrect Answer")
    //deletes the 'incorrect' class from the correct answer
    $(`label[for=${questions[STORE.currentQuestion].correctAnswer}]`).removeClass('incorrect');
    //checkAnswer returns boolean value(true/false)
    STORE.view ='feedback';
    generateFeedback();

    if (checkAnswer()) {
      //increments the score count by 1 
      scoreKeeper();
      //add the updated score
      generateScore();
    }
  });
}

//responsible for delegating what happens when 'next' button is clicked
function handleNextClicked() {
  /*telling it to look at the div with the 'quiz' class and listen 
  for a click event on element with the 'next-button' class*/
  $('.quiz').on('click', '.next-button', function (event) {
    //using preventDefault to stop the page from refreshing
    event.preventDefault();
    /*ternary statement that renders the page if null is not returned 
    otherwise it sets the value of the 'view' property in the STORE object to 'status'*/
    if(updateQuestion() === null){
      STORE.view = 'results';
      generateResults();
    }
    renderQuiz(); 
      
    
  });
}

//generates the html for the intro page
function generateIntro() {
  $('.intro').html(
    `<p>In a galaxy far far away...</p>
<form id="start-quiz-form">
  <input class="start-button button" type="submit" value="Start Quiz" />
</form>`
  );
}

//generates the quiz page html template
function generateQuiz() {
  $('.quiz').html(`<p class = 'question-number' tabindex="0"></p>
  <form id="questions-form">
    <p class="question"></p>
    <div class="answers" role="radiogroup" aria-labelledby="answers" tabindex="0">
    </div>
      <input tabindex="0" id='answers' role="button" class="answer-button button" type="submit" value="Check Answer">
    </form>
    
    <p>Quiz Progress</p>    
    <span class="current-score"></span>`);
}

/*generates the question number to be displayed as "Q{number of question}"
we add 1 to the currentQuestion since arrays at 0 based*/
function generateQuestionNumber() {
  $('.question-number').html(`
  Question ${STORE.currentQuestion + 1}:
  `);
}

//generates a string of html with the current question
function generateQuestion() {
  $('.question').html(`
  ${questions[STORE.currentQuestion].question}<br>
  `);
  $('.question').scrollTop();
}

//generates a string of html the answers
function generateAnswer() {
  //initialize a variable with the value of an empty string
  let answerHtml = ( questions[STORE.currentQuestion].answers
    .map((item,index )=>
      ` <input role="radio" tabindex="-1" type="radio" value="${item.id}" id="answer-${index}" name="answer" required />
      <label for="answer-${index}">${item.answer}   
      </label><br>`
    )
    .join('') 
  );
  $('.answers').append(answerHtml);
}
//
function generateNextButton() {
  $(`<form id="next-question-form">
  <input id='next' class="next-button button" type="button" value="Next Question" />
</form>`).insertAfter('.answers');
}


//generate a string of html with current score
function generateScore() {
  $('.current-score').html(`
    ${STORE.currentScore}/${questions.length}
  `);
}


function generateFeedback(){
  const img = (parseInt(STORE.userAnswer[STORE.userAnswer.length -1])=== questions[STORE.currentQuestion].correctAnswer) ? feedback.correct:feedback.incorrect;
  
  const correctAnswer = questions[STORE.currentQuestion].answers.find(a => a.id === questions[STORE.currentQuestion].correctAnswer).answer;
  $('.question').html(
    ``
);

$(`<div class="feedback" tabindex="1"><img src="img/${img.src}" alt="${img.alt}"><p>The correct Answer to: ${questions[STORE.currentQuestion].question} <br> is: ${correctAnswer}. <br>You got this question ${img.feedback}.</p></div>`).insertAfter('.question');
}



function generateResults() {
  fetchCharacters(() => {
  const {message, image, rank, alt} = character[STORE.currentScore];
  $('.results').html(`
    <h1>Score: ${STORE.currentScore}</h1>
    <h2 class="score-message">${STORE.currentScore === 0 ? 'Yousa' : 'You\'re a'} ${rank} </h2>
    <img src="${image}" alt='${alt}' class="score-image">
    <p>&ldquo;${message}&rdquo;</p>
    <p>Want to play again?</p>
    <form>
      <input class="try-again-button button" type="submit" value="Re-take Quiz">
    </form>
    `);});
}

//
function updateQuestion() {
  if (STORE.currentQuestion < questions.length - 1) {
    STORE.currentQuestion++;
    return STORE.currentQuestion;
  } else {
    return null;
  }
} 

//
function checkAnswer() {
  // Compare id of the selected answer with the id of the correct answer
  // only return on true
  const userAnswer = $('input[name=answer]:checked').val();
  STORE.userAnswer.push(userAnswer);
  return parseInt(userAnswer) === questions[STORE.currentQuestion].correctAnswer;
}

//Increments score count based on number of correct answers
function scoreKeeper() {
  STORE.currentScore++;
}

//
function viewChecker() {
  if (STORE.view === 'start') {
    $('.intro').show();
    $('.quiz').hide();
    $('.answers').hide();
    $('.feedback').hide();
    $('.results').hide();
  } else if (STORE.view === 'quiz') {
    $('.intro').hide();
    $('.quiz').show();
    $('.answers').show();
    $('.feedback').hide();
  } else if (STORE.view === 'answers') {
    $('.quiz').hide();
    $('.answers').show();
    $('.feedback').hide();
  } else if (STORE.view === 'feedback'){
    $('.feedback').show();
  }
  else if (STORE.view==='results'){
    $('.answers').hide();
    $('.results').show();
    $('.quiz').hide();
    $('.feedback').hide();
  }
}

//This function is responsible for rendering the page
function renderQuiz() {
  generateQuiz();
  generateQuestion();
  generateQuestionNumber();
  generateAnswer();
  generateScore();
  viewChecker();
}

// Render State
function main() {
  $('.start-button').hide();

  fetchQuestions(() => {
    $('.start-button').show();
     generateIntro();
  viewChecker();
  handleStartClicked();
  handleAnswerClicked();
  handleNextClicked();
  });
 
}
//
$(main);
