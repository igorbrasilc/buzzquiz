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
    console.log('clicou');
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
        <article onclick="openQuiz()">
            <div class="bg-gradient">
                <img src="${quiz.image}" alt="imagem-quiz"/>
                <p><span>${quiz.title}</span></p>
            </div>
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

// function createQuizNextScreens(btn) {
//     const btnClass = btn.classList;
//     const btnText = btn.innerHTML;
//     const inputTitle = document.querySelector(".create-quiz-page .title").value;
//     const inputURL = document.querySelector(".create-quiz-page .url").value;
//     const inputQuestionQtd = document.querySelector(".create-quiz-page .question-qtd").value;
//     const inputLevelQtd = document.querySelector(".create-quiz-page .level-qtd").value;

//     CREATEDQUIZOBJECT = {
//         title: inputTitle,
//         URL: inputURL,
//         questionQtd: inputQuestionQtd,
//         levelQtd: inputLevelQtd
//     }

//     // Validations
//     const titleOK = CREATEDQUIZOBJECT.title.length >= 20 && CREATEDQUIZOBJECT.title.length <= 65;

//     if (btnClass.contains("btn-create-screen-1")) {
//         console.log(CREATEDQUIZOBJECT);
//     }
// }


/* Comportamento de respostas */
function answerSelection(answer){
    console.log('clicou');
    const coverSelection = answer.querySelector('.white-cover');
    const pSelection = answer.querySelector('p');

    const section = answer.parentNode;
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
            console.log(pList[i]);
        }
    } 
}

