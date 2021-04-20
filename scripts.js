pegarquizzes();

function pegarquizzes (){
    const promise = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v2/buzzquizz/quizzes");
    promise.then(popularquizzes);
}

function popularquizzes(resposta){
    const quizzes = resposta.data;
    const campoQuizz = document.querySelector(".todos-quizzes ul");
    campoQuizz.innerHTML = "";
    for(let i=0;i<quizzes.length;i++){
        campoQuizz.innerHTML +=`
        <li id=${quizzes[i].id} onclick =" abrirQuizz(this)" >
            <img src="${quizzes[i].image}" alt="">
            <div class="degrade"></div>
            <span>${quizzes[i].title}</span>
        </li>`;
    }
}

function abrirQuizz(quizz){
    const promise = axios.get(`https://mock-api.bootcamp.respondeai.com.br/api/v2/buzzquizz/quizzes/${quizz.id}`);
    promise.then(criarPaginaQuizz);
}

function criarPaginaQuizz(resposta){

}