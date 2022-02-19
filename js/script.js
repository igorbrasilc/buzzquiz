
const MAIN = document.querySelector("main");
let CREATEDQUIZOBJECT = {
  title: null,
  image: null,
  questions: null,
  levels: null
};
const CONSTAPI = "https://mock-api.driven.com.br/api/v4/buzzquizz";
let QUESTION_QTD = 0;
let LEVEL_QTD = 0;

/* Comportamento de respostas do quiz*/
/* function cQ(){
  console.log('imprimiu');
  const promise = axios.post(`${CONSTAPI}/quizzes`, catQuiz);
  promise.then(r => console.log(r));
  promise.catch(r => console.log(r));
} */

let QUIZ_FROM_SERVER;
let currentQuiz;
const quizPage = document.querySelector('.quiz-page');
let questionList = [];
let correctAnswers = 0;

// Exibição do quiz:

function openQuiz() {
  const quizHeader = document.querySelector(".quiz-page-header");
  MAIN.classList.toggle("hide");
  quizPage.classList.toggle("hide");
  quizHeader.classList.toggle("hide");
}

// Disponibilização dos quizzes do servidor ao entrar na tela inicial:
const promiseGetQuizzes = axios.get(`${CONSTAPI}/quizzes`);
loading();
promiseGetQuizzes.then(quizFilter);
promiseGetQuizzes.catch(error => {
  console.error(error.response);
  alert("Não deu pra obter os quizzes, verifique o erro ou avise o devinho");
})

function quizFilter(promise) {
  const quizzes = promise.data;
  let myQuizzes = [];
  let serveQuizzes = [];


  let storedQuizzes = JSON.parse(localStorage.getItem('myLocal'));
  quizzes.forEach(quizz => {
    const id = quizz.id;
    if (!storedQuizzes) storedQuizzes = [];

    if(storedQuizzes.indexOf(id) >= 0) myQuizzes.push(quizz);
    else serveQuizzes.push(quizz);
  })

  // Se tiver algum quizz próprio
  if(myQuizzes.length){
    containQuiz(); 
    renderMyQuiz(myQuizzes);
  } 

  renderQuiz(serveQuizzes);
  loading();
}

function containQuiz(){
  const createFirtQuiz = document.querySelector('.create-first-quiz');
  const createQuiz = document.querySelector('.created-quizzes-header');
  createFirtQuiz.classList.toggle('hide');
  createQuiz.classList.toggle('hide');
}

function renderMyQuiz(response) {
  const containerAllQuizzes = document.querySelector(".my-quizzes .all-quizzes-container");

  response.forEach(quiz => {
    containerAllQuizzes.innerHTML += assembleQuizzes(quiz);
    const article = containerAllQuizzes.querySelector('article:last-child');
    article.setAttribute('class', 'my-quiz');
  })
}


function renderQuiz(response) {
  const containerAllQuizzes = document.querySelector(".all-quizzes .all-quizzes-container");

  response.forEach(quiz => {
    containerAllQuizzes.innerHTML += assembleQuizzes(quiz);
  })
}


function assembleQuizzes(quiz) {
  return `
    <article onclick="loadQuizFromServer(${quiz.id})">
      <div class="bg-gradient">
      </div>
      <img src="${quiz.image}" alt="imagem-quiz"/>
      <p><span>${quiz.title}</span></p>
    </article>
  `;
}


//  Criação do quiz
function createQuizScreen1() {
  const containerCreateFirst = document.querySelector(".create-first-quiz");
  const pageCreate = document.querySelector(".create-quiz-page");

  MAIN.classList.toggle("hide");
  containerCreateFirst.classList.toggle("hide");

  pageCreate.innerHTML = `
    <h1>Comece pelo começo</h1>
    <div class="container-questions">
        <input type="text" placeholder="Título do seu quizz" class="title">
        <input type="url" placeholder="URL da imagem do seu quizz" class="url">
        <input type="text" placeholder="Quantidade de perguntas do quizz" class="question-qtd">
        <input type="text" placeholder="Quantidade de níveis do quizz" class="level-qtd">
    </div>
    <button type="submit" class="btn-create-screen-1" onclick="createQuizNextScreens(this)">Prosseguir pra criar perguntas</button>
    `;
}


function createQuizNextScreens(btn) {
  const btnClass = btn.classList;
  const btnText = btn.innerHTML;

  // tela de perguntas basicas:
  if (btnClass.contains("btn-create-screen-1")) {
    const inputTitle = document.querySelector(".create-quiz-page .title").value;
    const inputURL = document.querySelector(".create-quiz-page .url").value;
    const inputQuestionQtd = document.querySelector(".create-quiz-page .question-qtd").value;
    const inputLevelQtd = document.querySelector(".create-quiz-page .level-qtd").value;

    // Validations
    const titleOK = inputTitle.length >= 20 && inputTitle.length <= 65;
    const urlOK = validURL(inputURL);
    const questionQtdOK = inputQuestionQtd >= 3;
    const levelQtdOK = inputLevelQtd >= 2;

    if (titleOK && urlOK && questionQtdOK && levelQtdOK) {
      QUESTION_QTD = inputQuestionQtd;
      LEVEL_QTD = inputLevelQtd;
      CREATEDQUIZOBJECT.title = inputTitle;
      CREATEDQUIZOBJECT.image = inputURL;
      createQuizScreen2(QUESTION_QTD);
    } else {
      alert("Preencha os dados corretamente!");
    }
  }

  // inputs de perguntas:
  const questions = [];

  // tela de perguntas do quiz a ser criado:
  if (btn.classList.contains("btn-create-screen-2")) {
    for (let i = 0; i < QUESTION_QTD; i++) {
      let questionObject = {
        title: document.querySelector(`.q${i + 1}-text`).value,
        color: document.querySelector(`.q${i + 1}-color`).value,
        answers: [{
          text: document.querySelector(`.q${i + 1}-answer`).value,
          image: document.querySelector(`.q${i + 1}-answer-img`).value,
          isCorrectAnswer: true
        }, {
          text: document.querySelector(`.q${i + 1}-wrong-answer1`).value,
          image: document.querySelector(`.q${i + 1}-wrong-answer-img1`).value,
          isCorrectAnswer: false
        }, {
          text: document.querySelector(`.q${i + 1}-wrong-answer2`).value,
          image: document.querySelector(`.q${i + 1}-wrong-answer-img2`).value,
          isCorrectAnswer: false
        }, {
          text: document.querySelector(`.q${i + 1}-wrong-answer3`).value,
          image: document.querySelector(`.q${i + 1}-wrong-answer-img3`).value,
          isCorrectAnswer: false
        }]
      }
      questions.push(questionObject);
    }

    // Validations questions
    let titleQuestionOK;
    let colorOK;
    let answerQtdOK;
    let answerURLOK;
    let questionsValidated = 0;

    for (let i = 0; i < questions.length; i++) {
      titleQuestionOK = questions[i].title.length >= 20;
      colorOK = validColorHEX(questions[i].color);
      let countAnswerNotNull = 0;
      let countAnswerURLOK = 0;

      for (let j = 0; j < 4; j++) {

        if (questions[i].answers[j].text !== '') {
          countAnswerNotNull += 1;

          const inputURL = questions[i].answers[j].image;
          const urlOK = validURL(inputURL);

          if (urlOK === true) {
            countAnswerURLOK += 1;
          }
        }
      }

      if (countAnswerNotNull >= 2) {
        answerQtdOK = true;
      } else {
        answerQtdOK = false;
        alert("Deve ter no minimo 2 respostas escritas em cada pergunta");
      }

      if (countAnswerURLOK === countAnswerNotNull) {
        answerURLOK = true;
      } else {
        answerURLOK = false;
        alert(`Verifique a URL da imagem da pergunta ${i + 1}`);
      }

      if (titleQuestionOK && colorOK && answerURLOK && answerQtdOK) {
        questionsValidated += 1;
      }
    }

    if (questionsValidated * 1 === QUESTION_QTD * 1) {
      CREATEDQUIZOBJECT.questions = questions;
      createQuizScreen3(LEVEL_QTD);
    } else {
      alert("Preencha os dados corretamente!");
      questionsValidated = 0;
    }
  }


  // tela de niveis:

  const levels = [];

  if (btnClass.contains("btn-create-screen-3")) {
    for (let i = 0; i < LEVEL_QTD; i++) {
      let levelObject = {
        title: document.querySelector(`.level${i + 1}-title`).value,
        image: document.querySelector(`.level${i + 1}-img`).value,
        text: document.querySelector(`.level${i + 1}-description`).value,
        minValue: document.querySelector(`.level${i + 1}-rate`).value
      }

      levels.push(levelObject);
    }

    // Validation levels:
    let titleLevelOK;
    let levelRateOK;
    let levelRateRange;
    let levelRateZero;
    let levelURLOK;
    let levelDescriptionOK;
    let levelsValidated = 0;
    let countRateZero = 0;

    for (let i = 0; i < levels.length; i++) {
      titleLevelOK = levels[i].title.length >= 10;
      levelRateRange = levels[i].minValue * 1 >= 0 && levels[i].minValue * 1 <= 100;
      levelRateZero = levels[i].minValue * 1 === 0;
      const inputURL = levels[i].image;
      levelURLOK = validURL(inputURL);
      levelDescriptionOK = levels[i].text.length >= 30;

      if (levelRateZero) {
        countRateZero += 1;
        levelRateOK = true;
      } else if (levelRateRange) {
        levelRateOK = true;
      } else {
        levelRateOK = false;
      }

      if (countRateZero < 1) {
        alert("É necessário que um dos levels tenha % minima igual a 0");
        levelRateOK = false;
      } else {
        if (levelRateRange) {
          levelRateOK = true;
        } else {
          levelRateOK = false;
        }
      }

      if (titleLevelOK && levelRateOK && levelURLOK && levelDescriptionOK) {
        levelsValidated += 1;
      } else {
        alert(`Preencha corretamente o level ${i + 1}`);
      }
    }

    if (levelsValidated * 1 === LEVEL_QTD * 1) {
      CREATEDQUIZOBJECT.levels = levels;
      createQuizScreen4();
    } else {
      levelsValidated = 0;
      alert("Preencha os dados novamente");
    }
  }


}

function createQuizScreen2(questionQtd) {
  const pageCreate = document.querySelector(".create-quiz-page");
  pageCreate.innerHTML = `
  <h1>Crie suas perguntas</h1>
  `;

  for (let i = 0; i < questionQtd; i++) {
    pageCreate.innerHTML += `
    <div class="container-questions hide container-q${i + 1}">
        <h1 onclick="alreadyEditedQuestion(this, ${i + 1})">Pergunta ${i + 1} <span>(Clique novamente para resumir)</span></h1>
        <input type="text" placeholder="Texto da pergunta" class="q${i + 1}-text"/>
        <input type="text" placeholder="Cor de fundo da pergunta" class="q${i + 1}-color"/>
        <h1>Resposta correta</h1>
        <input type="text" placeholder="Resposta correta" class="q${i + 1}-answer"/>
        <input type="url" placeholder="URL da imagem" class="q${i + 1}-answer-img"/>
        <h1>Respostas incorretas</h1>
        <input type="text" placeholder="Resposta incorreta 1" class="q${i + 1}-wrong-answer1"/>
        <input type="url" placeholder="URL da imagem 1" class="q${i + 1}-wrong-answer-img1"/>
        <input type="text" placeholder="Resposta incorreta 2" class="q${i + 1}-wrong-answer2"/>
        <input type="url" placeholder="URL da imagem 2" class="q${i + 1}-wrong-answer-img2"/>
        <input type="text" placeholder="Resposta incorreta 3" class="q${i + 1}-wrong-answer3"/>
        <input type="url" placeholder="URL da imagem 3" class="q${i + 1}-wrong-answer-img3"/>
    </div>
    <div class="edit-question id${i + 1}" onclick="editQuestion(this, ${i + 1})">
        <h1>Pergunta ${i + 1}</h1>
        <img src="./img/Vector.svg" alt="edit-question-icon"/>
    </div>
    `;
  }

  pageCreate.innerHTML += `<button type="submit" class="btn-create-screen-2" onclick="createQuizNextScreens(this)">Prosseguir pra criar níveis</button>`;
}

function createQuizScreen3(levelQtd) {
  const pageCreate = document.querySelector(".create-quiz-page");
  pageCreate.innerHTML = `
  <h1>Agora, decida os níveis!</h1>
  `;

  for (let i = 0; i < levelQtd; i++) {
    pageCreate.innerHTML += `
    <div class="container-questions hide container-q${i + 1}">
        <h1 onclick="alreadyEditedQuestion(this, ${i + 1})">Nível ${i + 1} <span>(Clique novamente para resumir)</span></h1>
        <input type="text" placeholder="Título do nível" class="level${i + 1}-title"/>
        <input type="number" placeholder="% de acerto mínima" class="level${i + 1}-rate"/>
        <input type="url" placeholder="URL da imagem do nível" class="level${i + 1}-img"/>
        <input type="text" placeholder="Descrição do nivel" class="level${i + 1}-description description"/>
    </div>
    <div class="edit-question id${i + 1}" onclick="editQuestion(this, ${i + 1})">
        <h1>Nível ${i + 1}</h1>
        <img src="./img/Vector.svg" alt="edit-question-icon"/>
    </div>
    `;
  }

  pageCreate.innerHTML += `<button type="submit" class="btn-create-screen-3" onclick="createQuizNextScreens(this)">Finalizar Quizz</button>`;
}

function createQuizScreen4() {
  const promise = axios.post(`${CONSTAPI}/quizzes`, CREATEDQUIZOBJECT);
  promise.then(quiz => {

    storeQuizId(quiz.data.id);

    const pageCreate = document.querySelector(".create-quiz-page");
    pageCreate.innerHTML = `
    <h1>Seu quizz está pronto!</h1>
    <article onclick="loadQuizFromServer(${quiz.data.id})" class="created-quiz-success">
      <div class="bg-gradient">
      </div>
      <img src="${quiz.data.image}" alt="imagem-quiz"/>
      <p><span>${quiz.data.title}</span></p>
    </article>
    <button type="submit" class="btn-access-quiz-created" onclick="loadQuizFromServer(${quiz.data.id})">Acessar Quizz</button>
    <p onclick="returnHome()">Voltar pra home</p>
    `;
  })
  promise.catch(error => {
    alert("Deu erro na postagem do seu quizz");
    console.error(error.response);
  })

  
}

function editQuestion(question, id) {
  const expandedQuestion = question.parentNode.querySelector(`.container-q${id}`);

  question.classList.toggle("hide");
  expandedQuestion.classList.toggle("hide");
}

function alreadyEditedQuestion(question, id) {
  const minimizedQuestion = document.querySelector(`.id${id}`);

  question.parentNode.classList.toggle("hide");
  minimizedQuestion.classList.toggle("hide");
}

// Função para validar uma URL
function validURL(str) {
  var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
  return !!pattern.test(str);
}

function validColorHEX(str) {
  let pattern = new RegExp('^#+([a-fA-F0-9]{6}|[a-fA-F0-9]{6})$');
  return !!pattern.test(str);
}

/* Montagem da página de perguntas de um quiz */

let qtdQuestions = 0;

function loadQuizFromServer(id) {
  console.log(`${CONSTAPI}/quizzes/${id}`);
  const promise = axios.get(`${CONSTAPI}/quizzes/${id}`);
  loading();
  promise.then(assembleQuiz);
  promise.catch(console.error());
  openQuiz();
}


function assembleQuiz(quizFromServer) {
  QUIZ_FROM_SERVER = quizFromServer;
  quizPage.innerHTML = '';

  currentQuiz = quizFromServer.data;

  const documentImgHeader = document.querySelector('.quiz-page-header');
  documentImgHeader.style.backgroundImage = `linear-gradient(
      0deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), 
      url("${currentQuiz.image}")
  `;

  const documentTitle = document.querySelector('header h2');
  documentTitle.innerHTML = currentQuiz.title;

  let questions = currentQuiz.questions;
  qtdQuestions = questions.length;

  questions = shuffleArray(questions);

  questions.forEach((question) => {
    quizPage.innerHTML += assembleQuestions(question);
    const header = quizPage.querySelector('article:last-child header');
    header.style.backgroundColor = `${question.color}`;
  })

  window.scrollTo(0, 0);
  loading();
}


function assembleQuestions(question) {
  return `
    <article>
        <header>${question.title}?</header>
        <section>
        ${assembleAnswer(question.answers)}
        </section>
    </article>
  `;
}


function assembleAnswer(answers) {
  let answerList = answers;
  answerList = shuffleArray(answerList);

  let rightDiv = '';
  let leftDiv = '';

  for (let i = 0; i < answerList.length; i++) {
    const answer = answerList[i];
    const img = answer.image;
    const describe = answer.text;
    const isCorrect = answer.isCorrectAnswer;

    if (i % 2) {
      leftDiv += answerStruture(isCorrect, img, describe);
    }

    else {
      rightDiv += answerStruture(isCorrect, img, describe);
    }
  }

  rightDiv = `<div class="right">${rightDiv}</div>`;
  leftDiv = `<div class="left">${leftDiv}</div>`;

  return leftDiv + rightDiv;
}

function answerStruture(isCorrect, img, describe) {
  return `
    <div id="${isCorrect}" class="answer-quiz" onclick="answerSelection(this, this.id)">
      <img src="${img}" alt="">
      <p>${describe}</p>
      <div class="white-cover"></div>
    </div>`;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    // gera índices aleatórios dentro do permitido para o 'array'
    const j = (Math.floor((Math.random() * 10) % array.length));

    const aux = array[i];
    array[i] = array[j];
    array[j] = aux;
  }
  return array;
}

/* Comportamento de respostas do quiz*/

function answerSelection(answerSelected, isCorrectAnswer) {
  let documentSection = answerSelected.parentNode;
  documentSection = documentSection.parentNode;

  // se não foi escolhida nenhuma resposta do cartão
  console.log(' func é igual? ' + isSelected(documentSection));
  if (!isSelected(documentSection)) {
    // não finalizou ainda
    if (questionList.length <= qtdQuestions) {
      const article = documentSection.parentNode;

      setTimeout(() => {
        let count = 0;
        const interval = setInterval(() => {
          if(article.clientHeight + 26 < count) clearInterval(interval);
          console.log(count)
          count += 10;
          window.scrollBy(0, 10);
        }, 10);
      }, 2000);

      questionList.push({ question: documentSection, isCorrectAnswer: isCorrectAnswer });

      const coverSelection = answerSelected.querySelector('.white-cover');

      const documentArticle = documentSection.parentNode;
      const coverList = documentArticle.querySelectorAll('.white-cover');
      const answerList = documentSection.querySelectorAll('.answer-quiz'); // mudar para documenteArticle

      // altera cor do text da resposta erradas e certas
      for (let i = 0; i < answerList.length; i++) {
        if (answerList[i].id === 'true') {
          answerList[i].querySelector('p').classList.add('success-quiz-answer-selection');

          if (answerList[i] === answerSelected) correctAnswers++;// Se a resposta correta é igual a selecionada
        }
        else {
          answerList[i].querySelector('p').classList.add('error-quiz-answer-selection');
        }
      }

      // adiciona fundo branco nas resposta não selecionadas
      for (let i = 0; i < coverList.length; i++) {
        if (coverList[i] !== coverSelection) {
          coverList[i].classList.add('unselected');
        }
      }

      if (qtdQuestions === questionList.length) {
        setTimeout(showScore, 2000);
      }
    }
  }
}


function isSelected(questionSelected) {
  for (let i = 0; i < questionList.length; i++) {
    if (questionList[i].question === questionSelected) {
      return true;
    }
  }

  return false;
}


function showScore() {
  const levels = currentQuiz.levels;
  let currentLevel;

  const hitPercent = Math.floor((100 / qtdQuestions) * correctAnswers);


  levels.forEach(level => {
    if (level.minValue <= hitPercent) {
      currentLevel = level;
    }
  })

  const levelTitle = `${hitPercent} de acerto: ${currentLevel.title}`;
  const levelColor = currentLevel.color;
  const levelImage = currentLevel.image;
  const levelText = currentLevel.text;
  quizPage.innerHTML += `
  <article class="show-score">
    <header>${levelTitle}</header>
      <section>
      <img src="${levelImage}"></img>
      <p>${levelText}</p>
    </section>
  </article>`;

  const header = quizPage.querySelector('article.show-score header');
  header.style.backgroundColor = `"${levelColor}"`;

  quizPage.innerHTML += `
  <div class="quiz-result">
    <button onclick="resetQuiz()">Reiniciar Quizz</button>
    <button onclick="returnHome()">Voltar para home</button>
  </div>`;
  quizPage.querySelector('.show-score').scrollIntoView();
}



/* Utilities */

function resetQuiz() {
  loading();
  currentQuiz = undefined;
  questionList = [];
  correctAnswers = 0;
  assembleQuiz(QUIZ_FROM_SERVER);
  window.scrollTo(0, 0);
}

function returnHome() {
  loading();
  window.location.reload();
  loading();
}

function loading() {
  const loading = document.querySelector('.load-screen');
  loading.classList.toggle('hide');
}


/* Amazenar informações */
function storeQuizId(id) {
  const dataStoring = localStorage.getItem('myLocal');
  let dataConversion = [];

  if (dataStoring) {
    dataConversion = JSON.parse(dataStoring);
  }

  dataConversion.push(id);
  dataConversion = JSON.stringify(dataConversion);
  localStorage.setItem('myLocal', dataConversion);
}