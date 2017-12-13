'use strict';
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
const questions = [
  {
    question: 'Who is Luke Skywalker\'s Dad?',
    answers: [
      { answer: 'Sheev Palpatine', id: 1 },
      { answer: 'Obi-Wan Kenobi', id: 2 },
      { answer: 'Anakin Skywalker', id: 3 },
      { answer: 'Qui-Gon Jinn', id: 4 },
      { answer: 'Jar Jar Binks', id: 5 }
    ],
    correctAnswer: 3
  },
  {
    question:
      'Which is the only film in which desert planet tatoonine doesn\'t appear?',
    answers: [
      { answer: 'Return of the Jedi', id: 1 },
      { answer: 'The Empire Strikes Back', id: 2 },
      { answer: 'A New Hope', id: 3 },
      { answer: 'Episode I', id: 4 },
      { answer: 'Episode II', id: 5 }
    ], 
    correctAnswer: 2
  },
  {
    question:
      'Which 1981 Blockbuster features characters from the original trilogy carved on to an ancient wall?',
    answers: [
      { answer: 'Clash of the Titans', id: 1 },
      { answer: 'Escape from New York', id: 2 },
      { answer: 'The Evil Dead', id: 3 },
      { answer: 'The Great Muppet Caper', id: 4 },
      { answer: 'Raiders of the Lost Ark', id: 5 }
    ],
    correctAnswer: 5
  },
  {
    question:
      'What is the name of the bounty hunter Han Solo kills in Mos Eisley\'s Cantina?',
    answers: [
      { answer: 'Yoda', id: 1 },
      { answer: 'Plo Koon', id: 2 },
      { answer: 'Greedo', id: 3 },
      { answer: 'Watto', id: 4 },
      { answer: 'General Akbar', id: 5 }
    ], 
    correctAnswer: 3
  },
  {
    question: 'Who killed Jabba the Hutt?',
    answers: [
      { answer: 'Darth Vader', id: 1 },
      { answer: 'Chewbacca', id: 2 },
      { answer: 'Luke Skywalker', id: 3 },
      { answer: 'Han Solo', id: 4 },
      { answer: 'Princess Leia', id: 5 }
    ],
    correctAnswer: 5
  }
];
//These are the different result outcomes for the quiz.
const character = [
  {
    'message': 'Oh! Aw! Ooh! Uh! Ai, Ai! Whoa, Ai! Whaaa! What? Wha- Oh.',
    'image': './img/jarjarbinks.jpg',
    'alt': 'Jar-Jar Binks'
  },
  {
    'message': 'Do or do not, there is no try...',
    'image': './img/youngling.jpg',
    'alt': 'Youngling'
  },
  {
    'message': 'Patience you must have my young Padawan.',
    'image': './img/padawan.jpg',
    'alt': 'Padawan'
  },
  {
    'message': 'Ignorance, yet Knowledge.',
    'image': './img/jediknight.jpg',
    'alt': 'Jedi Knight'
  },
  {
    'message': 'Strong with you , the force is',
    'image': './img/jedimaster.png',
    'alt': 'Jedi Master'
  },
  {
    'message': 'The Force will be with you. Always.',
    'image': './img/jedigrandmaster.png',
    'alt': 'Jedi Grand Master'
  },
];

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
    //deletes the 'incorrect' class from the correct answer
    $(`label[for=${questions[STORE.currentQuestion].correctAnswer}]`).removeClass('incorrect');
    //checkAnswer returns boolean value(true/false)
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
    updateQuestion() !== null ? renderQuiz():STORE.view = 'status';renderQuiz(); generateStatus();
  });
}

//generates the html for the intro page
function generateIntro() {
  $('.intro').html(
    `<p>In a land far, far away...</p>
<form>
  <input class="start-button button" type="submit" value="Start Quiz">
</form>`
  );
}

//generates the quiz page html template
function generateQuiz() {
  $('.quiz').html(`<span class = 'question-number'></span>
  <form id="questions">
    <p class="question"></p>
      <input id='answer' class="answer-button button" type="submit" value="Answer">
    </form>
    
    <p>Quiz Progress</p>
    <span class="progress"></span>

    <span class="current-score"></span>`);
}

/*generates the question number to be displayed as "Q{number of question}"
we add 1 to the currentQuestion since arrays at 0 based*/
function generateQuestionNumber() {
  $('.question-number').html(`
  Q${STORE.currentQuestion + 1}
  `);
}

//generates a string of html with the current question
function generateQuestion() {
  $('.question').html(`
  ${questions[STORE.currentQuestion].question}<br>
  `);
}

//generates a string of html the answers
function generateAnswer() {
  //initialize a variable with the value of an empty string
  let answerHtml = '';
  for (let i = 0; i < questions[STORE.currentQuestion].answers.length; i++) {
    answerHtml += `<input type="radio" value="${questions[STORE.currentQuestion].answers[i].id}" id="${i}" name="answer" required>
    <label for="${questions[STORE.currentQuestion].answers[i].id}">
    ${questions[STORE.currentQuestion].answers[i].answer}</label><br>
  `;}
  $('.question').append(answerHtml); //<<<<<<<<ANOTHER FUNCTION???
}

//
function generateNextButton() {
  $(`<form>
  <input id='next' class="next-button button" type="button" value="Next">
</form>`).insertAfter('.question');
}


//generate a string of html with current score
function generateScore() {
  $('.current-score').html(`
    ${STORE.currentScore}/${questions.length}
  `);
}

//
function generateStatus() {
  const msg = character[STORE.currentScore].message;
  const img = character[STORE.currentScore].image;
  const alt = character[STORE.currentScore].alt;
  $('.status').html(`
    <h1>Score: ${STORE.currentScore}</h1>
    <h2 class="score-message">${STORE.currentScore === 0 ? 'Yousa' : 'You\'re a'} ${alt} </h2>
    <img src="${img}" alt='${alt}' class="score-image">
    <p>&ldquo;${msg}&rdquo;</p>
    <p>Think you can do better?</p>
    <form>
      <input class="try-again-button button" type="submit" value="Try Again">
    </form>
    `);
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
    $('.status').hide();
  } else if (STORE.view === 'quiz') {
    $('.intro').hide();
    $('.quiz').show();
    $('.answers').show();
  } else if (STORE.view === 'answers') {
    $('.quiz').hide();
    $('.answers').show();
  } else {
    $('.answers').hide();
    $('.status').show();
    $('.quiz').hide();
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
  generateIntro();
  viewChecker();
  handleStartClicked();
  handleAnswerClicked();
  handleNextClicked();
}
//
$(main);
