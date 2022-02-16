let madeQuizzes = null;

function checkIfMadeQuizzes() {
    const containerMyQuizzes = document.querySelector(".my-quizzes");

    if (madeQuizzes === null) {
        containerMyQuizzes.innerHTML = `
        <article class="create-first-quiz">
            <p>Você não criou nenhum quizz ainda :(</p>
            <p><span>Criar Quizz</span></p>
        </article>
        `;
    } else {
        containerMyQuizzes.innerHTML = `
        <div class="created-quizzes-header">
            <p>Seus Quizzes</p>
            <ion-icon name="add-circle"></ion-icon>
        </div>
        <div class="created-quizzes">
            <article class="created-quiz">
                <img src="./img/homer-simpson.jpeg" alt="imagem-quiz"/>
                <p><span>Quizz do Homer sdadasdsa dsad sa sad asd sad ad asd sa das</span></p>
            </article>
        </div>
        `;
    }
}

checkIfMadeQuizzes();











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