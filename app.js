'use strict';

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

const STORE = {
  view: 'start',
  currentQuestion: -1,
  currentScore: 0,
  userAnswer: []
};

function renderView() {
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
  } 
}

function generateIntro() {
  $('.intro').html(
    `<p>In a land far, far away...</p>
<form>
  <input class="start-button button" type="submit" value="Start Quiz">
</form>`
  );
}

// function generateStatus(){'
//   $('.status').html(
//     `
//     <h1>You scored 0</h1>
//     <h2>Yousa Jar-Jar Binks</h2>
//     <img src='./img/jarjarbinks.jpg'alt='a picture of jar jar binks'>
//     <p>Think you can do better?</p>
//     <form>
//       <input class="try-again-button button" type="submit" value="Try Again">
//     </form>
//     `

//   );
// }

// Single top-level render function to do all should be the only one we call for 
// an event handler




function UpdateQuestion() {
  if (STORE.currentQuestion < questions.length) {
    STORE.currentQuestion++;
    return STORE.currentQuestion;
  } else {
    return null;
  }
}
//Increments score count based on number of correct answers
function scoreKeeper() {
  STORE.currentScore++;
  console.log('score keeper ran');
}
//generate a string of html with current score
function generateScore() {
  $('.current-score').html(`
    ${STORE.currentScore}/${questions.length}
  `);
  console.log('generate score ran');
}
//generates a string of html with answers
function generateAnswer() {
  let answerHtml = '';
  for (let i = 0; i < questions[STORE.currentQuestion].answers.length; i++) {
    answerHtml += `<input type="radio" value="${questions[STORE.currentQuestion].answers[i].id}" id="${i}" name="answer" required>
    <label for="${questions[STORE.currentQuestion].answers[i].id}">${
  questions[STORE.currentQuestion].answers[i].answer
}</label><br>`;
  }
  $('.question').append(answerHtml);
  console.log('generate answer ran');
}
//generate a string of html with question
function generateQuestion() {
  $('.question').html(`
  ${questions[STORE.currentQuestion].question}<br>
  `);
  console.log('generate question ran');
}
function template() {
  $('.quiz').html(`<span class = 'question-number'></span>
  <form id="questions">
    <p class="question"></p>
      <input class="answer-button button" type="submit" value="Answer">
    </form>
    
    <p>Quiz Progress</p>
    <span class="progress"></span>

    <span class="current-score"></span>`);
  console.log('template ran');
}

function renderQuiz() {
  template();
  generateQuestion();
  generateAnswer();
  generateScore();
}

function displayAnswer() {
  $('.quiz label').addClass('incorrect');
}


function checkAnswer() {
  // Compare id of the selected answer with the id of the correct answer
  // only return on true


  const userAnswer = $('input[name=answer]:checked').val();
  STORE.userAnswer.push(userAnswer);

  return parseInt(userAnswer) === questions[STORE.currentQuestion].correctAnswer;
}


function handleAnswerClicked(){
  $('.quiz').submit(function(event){
    event.preventDefault();
 console.log('answer clicked'); 
    // apply css
  // add next button
  // foreach input on page 
  $('label').toggleClass('incorrect');
  $(`label[for=${questions[STORE.currentQuestion].correctAnswer}]`).removeClass('incorrect');
 //if (id !== questions[STORE.currentQuestion].answers.correctAnswer){
   // add class
   
 //}
});
  
}


// function handleNextClicked() {
//   // Display Strikethrough
//   // Push the selected to userAnswer array
//   $('.quiz').submit(function(event) {
//     event.preventDefault();
    
//     if (checkAnswer()){
//        scoreKeeper();
//       }

//     let nextQuestion = UpdateQuestion();
//     if (nextQuestion !== null) {
//       renderQuiz();
//       renderView();
//     } else {
//       STORE.view = 'Status';
//       renderView();
//     }
//   });
// }

function handleStartClicked() {
  $('.intro').submit(function(event) {
    event.preventDefault();
    STORE.view = 'quiz';
    const firstQuestion = UpdateQuestion();
    renderQuiz();
    renderView();
  });
}

// Render State
function main() {
  generateIntro();
  renderView();
  handleStartClicked();
  handleAnswerClicked();
}

$(main);
