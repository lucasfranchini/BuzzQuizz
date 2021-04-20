pegarquizzes();

function pegarquizzes (){
    const promise = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v2/buzzquizz/quizzes");
    promise.then(popularquizzes);
}

function popularquizzes(resposta){
    const quizzes = resposta.data;
    const campoQuizz = document.querySelector(".todos-quizzes ul");
    campoQuizz.innerHTML = "";
    const degrade = "background-size: cover;"
    for(let i=0;i<quizzes.length;i++){
        campoQuizz.innerHTML +=`
        <li id=${quizzes[i].id}>
            <img src="${quizzes[i].image}" alt="">
            <div class="degrade"></div>
            <span>${quizzes[i].title}</span>
        </li>`;
    }
}