

let madeQuizzes = null;
const MAIN = document.querySelector("main");
let CREATEDQUIZOBJECT = {};
const CONSTAPI = "https://mock-api.driven.com.br/api/v4/buzzquizz";

// Checa ao abrir o site se já existem quizzes criados pelo usuário
function checkIfMadeQuizzes() {
    const containerMyQuizzes = document.querySelector(".my-quizzes");

    if (madeQuizzes === null) {
        containerMyQuizzes.innerHTML = `
        <article class="create-first-quiz">
            <p>Você não criou nenhum quizz ainda :(</p>
            <p><span onclick="createQuizScreen1()">Criar Quizz</span></p>
        </article>
        `;
    } else {
        containerMyQuizzes.innerHTML = `
        <div class="created-quizzes-header">
            <p>Seus Quizzes</p>
            <ion-icon name="add-circle"></ion-icon>
        </div>
        <div class="created-quizzes">
            <article class="created-quiz" onclick="openQuiz()">
                <img src="./img/homer-simpson.jpeg" alt="imagem-quiz"/>
                <p><span>Quizz do Homer sdadasdsa dsad sa sad asd sad ad asd sa das</span></p>
            </article>
        </div>
        `;
    }
}

checkIfMadeQuizzes();

// Exibição do quiz:

function openQuiz() {
    const quizHeader = document.querySelector(".quiz-page-header");
    const quizPage = document.querySelector(".quiz-page");

    MAIN.classList.toggle("hide");
    quizPage.classList.toggle("hide");
    quizHeader.classList.toggle("hide");
}

// Disponibilização dos quizzes do servidor ao entrar na tela inicial:
const promiseGetQuizzes = axios.get(`${CONSTAPI}/quizzes`);
promiseGetQuizzes.then(renderQuizzes);
promiseGetQuizzes.catch(error => {
    console.error(error.response);
    alert("Não deu pra obter os quizzes, verifique o erro ou avise o devinho");
})

function renderQuizzes(response) {
    const containerAllQuizzes = document.querySelector(".all-quizzes-container");
    const data = response.data;

    data.forEach(quiz => {
      containerAllQuizzes.innerHTML += `
        <article onclick="loadQuizFromServer(${quiz.id})">
          <div class="bg-gradient">
          </div>
          <img src="${quiz.image}" alt="imagem-quiz"/>
          <p><span>${quiz.title}</span></p>
        </article>
      `;
    })
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

    // inputs de perguntas básicas:
    const inputTitle = document.querySelector(".create-quiz-page .title").value;
    const inputURL = document.querySelector(".create-quiz-page .url").value;
    const inputQuestionQtd = document.querySelector(".create-quiz-page .question-qtd").value;
    const inputLevelQtd = document.querySelector(".create-quiz-page .level-qtd").value;

    // inputs de perguntas:
    const inputTextQuestion1 = document.querySelector(".create-quiz-page .question-1");

    CREATEDQUIZOBJECT = {
        title: inputTitle,
        image: inputURL
    }

    // Validations
    const titleOK = CREATEDQUIZOBJECT.title.length >= 20 && CREATEDQUIZOBJECT.title.length <= 65;
    const urlOK = validURL(inputURL);
    const questionQtdOK = inputQuestionQtd >= 3;
    const levelQtdOK = inputLevelQtd >= 2;

    if (btnClass.contains("btn-create-screen-1")) {
      if (titleOK && urlOK && questionQtdOK && levelQtdOK) {
          createQuizScreen2(inputQuestionQtd);
        } else {
          alert("Preencha os dados corretamente!");
        }
    } else if (btnClass.contains("btn-create-screen-2")) {

    }
}

function createQuizScreen2(questionQtd) {
  const pageCreate = document.querySelector(".create-quiz-page");
  pageCreate.innerHTML = `
  <h1>Crie suas perguntas</h1>
  `;
  
  for (let i = 0; i < questionQtd; i++) {
    pageCreate.innerHTML += `
    <div id="${i+1}" class="edit-question" onclick="editQuestion(this)">
        <h1>Pergunta ${i+1}</h1>
        <img src="./img/Vector.svg" alt="edit-question-icon"/>
    </div>
    `;
  }

  pageCreate.innerHTML += `<button type="submit" class="btn-create-screen-2" onclick="createQuizNextScreens(this)">Prosseguir pra criar níveis</button>`;
}

// Função para validar uma URL
function validURL(str) {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return !!pattern.test(str);
}

/* Comportamento de respostas */
function answerSelection(answer){
    const coverSelection = answer.querySelector('.white-cover');
    const pSelection = answer.querySelector('p');

    const section = document.querySelector('.quiz-page');
    const coverList = section.querySelectorAll('.white-cover');
    const pList = section.querySelectorAll('p');

    for(let i = 0; i < coverList.length; i++){
        if(coverList[i] !== coverSelection){
            coverList[i].classList.add('success-quiz-answer-selection');
            pList[i].classList.add('error-quiz-answer-selection');
            pList[i].classList.remove('success-quiz-answer-selection');
        }
        else {
            coverList[i].classList.remove('success-quiz-answer-selection');
            pList[i].classList.remove('error-quiz-answer-selection');
            pList[i].classList.add('success-quiz-answer-selection');
        }
    } 
}


function loadQuizFromServer(id){
  const promise = axios.get(`${CONSTAPI}/quizzes/${id}`);
  promise.then(assembleQuizzes);
  promise.catch(console.error());
}

function assembleQuizzes(quizFromServer){
  const documentImgHeader = document.querySelector('.quiz-page-header');
  const documentTitle = document.querySelector('header h2');
  
  const quiz = quizFromServer.data;

  documentImgHeader.style.backgroundImage = `linear-gradient(
      0deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), 
      url("${quiz.image}")`;

  documentTitle.innerHTML = quiz.title;
  
  const levels = quiz.levels;
  let questions = quiz.questions;
  questions = shuffleArray(questions);

  const levelTitle = levels[0].title;
  const levelColor = levels[0].color;
  const levelImage = levels[0].image;
  const levelText = levels[0].text;

  const quizPage = document.querySelector('.quiz-page');
  quizPage.innerHTML = '';

  questions.forEach((question) => {
    quizPage.innerHTML += assembleQuestions(question);
    const header = quizPage.querySelector('article:last-child header');
    header.style.backgroundColor = `${question.color}`;
  })

  quizPage.innerHTML += `
    <article>
      <header>${levelTitle}</header>
      <img src="${levelImage}"></img>
      <p>${levelText}</p>
    </article>`;

  const header = quizPage.querySelector('article:last-child header');
  header.style.backgroundColor = `"${levelColor}"`;

  quizPage.innerHTML += `
    <div class="quiz-result">
      <button>Reiniciar Quizz</button>
      <button onclick="openQuiz()">Voltar para home</button>
    </div>`
  
  openQuiz();
}


function showScore(quizPage){

}

function assembleQuestions(question){
    return `<article>
        <header>${question.title}?</header>
        <section>
        ${assembleAnswer(question.answers)}
        </section>
    </article>`;
}

function assembleAnswer(answers){
    let output = '';
    for(let i = 0; (i + 1)  < answers.length; i+=2){
      const img1 = answers[i].image;
      const describe1 = answers[i].text;
      const img2 = answers[i+1].image;
      const describe2 = answers[i+1].text;
      output += `
            <div class="left">                    
              <div onclick="answerSelection(this)">
              <img src="${img1}" alt="">
              <p>${describe1}</p>
              <div class="white-cover"></div>
              </div>
            </div>
            <div class="right">
                <div onclick="answerSelection(this)">
                <img src="${img2}" alt="">
                <p>${describe2}</p>
                <div class="white-cover"></div>
                </div>                    
            </div>`

    }
    return output;

}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        // gera índices aleatórios dentro do permitido para o 'array'
        const j = (Math.floor((Math.random() * 10)%array.length));

        const aux = array[i];
        array[i] = array[j];
        array[j] = aux;
    }
    return array;
}
