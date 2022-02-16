let madeQuizzes = null;
const MAIN = document.querySelector("main");

function checkIfMadeQuizzes() {
    const containerMyQuizzes = document.querySelector(".my-quizzes");

    if (madeQuizzes === null) {
        containerMyQuizzes.innerHTML = `
        <article class="create-first-quiz">
            <p>Você não criou nenhum quizz ainda :(</p>
            <p><span onclick="createQuiz()">Criar Quizz</span></p>
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

function openQuiz() {
    const quizHeader = document.querySelector(".quiz-page-header");
    const quizPage = document.querySelector(".quiz-page");

    MAIN.classList.toggle("hide");
    quizPage.classList.toggle("hide");
    quizHeader.classList.toggle("hide");
}

function createQuiz() {
    const containerCreateFirst = document.querySelector(".create-first-quiz");
    const pageCreate = document.querySelector(".create-quiz-page");

    MAIN.classList.toggle("hide");
    containerCreateFirst.classList.toggle("hide");
    
    pageCreate.innerHTML = `
    <h1>Comece pelo começo</h1>
        <div class="container-questions">
            <input type="text" placeholder="Título do seu quizz" class="title">
            <input type="text" placeholder="URL da imagem do seu quizz" class="url">
            <input type="text" placeholder="Quantidade de perguntas do quizz" class="question-qtd">
            <input type="text" placeholder="Quantidade de níveis do quizz" class="level-qtd">
        </div>
        <button type="submit" class="btn-create">Prosseguir pra criar perguntas</button>
    `;
}
