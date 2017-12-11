'use strict';

const questions = [
  {
    'question': 'Who is Luke Skywalker\'s Dad?',
    'answers': [
      {'answer': 'Sheev Palpatine', correct: false },
      {'answer': 'Obi-Wan Kenobi', correct: false },
      {'answer': 'Anakin Skywalker', correct: true},
      {'answer': 'Qui-Gon Jinn', correct: false},
      {'answer': 'Jar Jar Binks', correct: false },
    ],
  },
  {
    'question':'Which is the only film in which desert planet tatoonine doesn\'t appear?',
    'answers': [
      {'answer': 'Return of the Jedi', correct: false},
      {'answer': 'The Empire Strikes Back', correct: true},
      {'answer': 'A New Hope', correct: false},
      {'answer':'Episode I', correct: false},
      {'answer': 'Episode II', correct: false},
    ],
  },
  {
    'question':'Which 1981 Blockbuster features characters from the original trilogy carved on to an ancient wall?',
    'answers': [
      {'answer':'Clash of the Titans', correct: false},
      {'answer':'Escape from New York', correct: false},
      {'answer':'The Evil Dead', correct: false},
      {'answer':'The Great Muppet Caper', correct: false},
      {'answer':'Raiders of the Lost Ark', correct: true},
    ],
  },
  {
    'question':'What is the name of the bounty hunter Han Solo kills in Mos Eisley\'s Cantina?',
    'answers': [
      {'answer':'Yoda', correct: false},
      {'answer':'Plo Koon', correct: false},
      {'answer':'Greedo', correct: true},
      {'answer':'Watto', correct: false},
      {'answer':'General Akbar', correct: false },
    ],
  },
  {
    'question':'Who killed Jabba the Hutt?',
    'answers': [
      {'answer':'Darth Vader', correct: false},
      {'answer':'Chewbacca', correct: false},
      {'answer':'Luke Skywalker', correct: false},
      {'answer':'Han Solo', correct: false},
      {'answer':'Princess Leia', correct: true},

    ],
  }];

const STORE = {
  view: 'start',
  currentQuestion: -1,
  currentScore: 0
};

function renderView(){
  if(STORE.view === 'start'){
    $('.intro').show();
    $('.quiz').hide();
    $('.status').hide();
  } else if (STORE.view === 'quiz'){
    $('.intro').hide();
    $('.quiz').show();
    $('.status').hide();
  } else {
    $('.intro').hide();
    $('.quiz').hide();
    $('.status').show();
  }
}

// Function that generates template
function generateQuestion(index){
    $('.quiz').html(`<span>Q${index}</span>
  <form>
    <p class="question">${questions[index].question}</p>
    
      <input type="radio" value="1" id="question1" name="answer" required>
      <label for="question1">${questions[index].answers[0].answer}</label>

      <input type="radio" value="2" name="answer" required>
      <label for="question2">${questions[index].answers[1].answer}</label>

      <input type="radio" value="3" name="answer" id="question3" required>
      <label for="question3">${questions[index].answers[2].answer}</label>

      <input type="radio" id="question4" value="4" name="answer" required>
      <label for="question4">${questions[index].answers[3].answer}</label>

       <input type="radio" id="question5" value="5" name="answer" required>
      <label for="question5">${questions[index].answers[4].answer}</label>
    
      <input class="answer-button button" type="submit" value="Answer">
    </form>
    
    <p>Quiz Progress</p>
    <span class="progress"></span>

    <span class="current-score">Score: 3/5</span>`);
}

function UpdateQuestion(){
  if(STORE.currentQuestion < questions.length-1) 
  {
    STORE.currentQuestion++;
    return STORE.currentQuestion;
  } else {
   return null;
  }
 }


function handleAnswerClicked(){
  $('.quiz').submit(function(event){
    event.preventDefault();
    if(UpdateQuestion() != null){
      generateQuestion();
      renderView();
    } else {
      STORE.view = 'Status';
      renderView();
    }
   });
}

function handleStartClicked(){
  $('.intro').submit(function(event){
    event.preventDefault();
    STORE.view = 'quiz';
    const firstQuestion = UpdateQuestion(); 

    generateQuestion(firstQuestion);
    renderView();
  });
}

// Render State
function main(){
  renderView();
  handleStartClicked();
  handleAnswerClicked();
}

$(main);

