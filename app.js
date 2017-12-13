'use strict';
//STORE holds data about the current state
const STORE = {
  view: 'start',
  currentQuestion: -1,
  currentScore: 0,
  userAnswer: []
};
//These are the questions and answers for the quiz
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
//These are the different result outcomes for the quiz
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

//
function handleStartClicked() {
  $('.intro').submit(function (event) {
    event.preventDefault();
    STORE.view = 'quiz';
    const firstQuestion = UpdateQuestion();
    renderQuiz();
  });
}

//
function handleAnswerClicked() {
  $('.quiz').submit(function (event) {
    event.preventDefault();
    generateNextButton();
    $('.answer-button').remove();
    $('label').toggleClass('incorrect');
    $(`label[for=${questions[STORE.currentQuestion].correctAnswer}]`).removeClass('incorrect');
    if (checkAnswer()) {
      scoreKeeper();
      generateScore();
    }
  });
}

//
function handleNextClicked() {
  $('.quiz').on('click', '.next-button', function (event) {
    event.preventDefault();
    let nextQuestion = UpdateQuestion();
    if (nextQuestion !== null) {
      renderQuiz();
    } else {
      STORE.view = 'Status';
      renderQuiz();
      generateStatus();
    }
  });
}

//
function generateIntro() {
  $('.intro').html(
    `<p>In a land far, far away...</p>
<form>
  <input class="start-button button" type="submit" value="Start Quiz">
</form>`
  );
}

//
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

//generates the question number to be displayed as "Q{number of question}"
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

//generates a string of html with answers
function generateAnswer() {
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
function UpdateQuestion() {
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
