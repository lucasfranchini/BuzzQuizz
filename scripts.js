let numeroPerguntasRespondidas = 0, numeroPerguntasAcertadas = 0, numeroPerguntasTotal = 0, niveisQuizzAberto = [];

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
            <img src="${quizzes[i].image}">
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
    const paginaQuizz = document.querySelector(".pagina-quizz-aberto");
    paginaQuizz.classList.remove("escondido");
    const background = `
    background: linear-gradient(0deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url("${resposta.data.image}");
    background-size: cover;`;
    paginaQuizz.innerHTML = `
    <div class="cabecalho-quizz" style = '${background}'>
        <h1>${resposta.data.title}</h1>
    </div>`;
    const perguntas = resposta.data.questions;
    numeroPerguntasRespondidas = 0;
    numeroPerguntasAcertadas = 0;
    numeroPerguntasTotal = perguntas.length;
    niveisQuizzAberto = resposta.data.levels
    perguntas.forEach(popularPerguntas);
}

function popularPerguntas(pergunta,indice){
    const paginaQuizz = document.querySelector(".pagina-quizz-aberto");
    const respostas = pergunta.answers;
    respostas.sort(comparador);
    paginaQuizz.innerHTML +=`
    <div class="pergunta">
        <div class="titulo-pergunta" style="background-color:${pergunta.color}">
            <span>${pergunta.title}</span>
        </div>
        <div class="caixa-respostas">
        </div>
    </div>`;
    const campoResposta = document.querySelectorAll(".caixa-respostas")[indice];
    for(let i=0;i<respostas.length;i++){
        campoResposta.innerHTML += `
        <div class="resposta" id="${respostas[i].isCorrectAnswer}"onclick="darResposta(this)">
            <img src="${respostas[i].image}">
            <span>${respostas[i].text}</span>
        </div>`;
    }
}

function darResposta(respostaClicada){
    const totalRespostas =respostaClicada.parentNode.children;
    const pergunta = respostaClicada.parentNode.parentNode;
    if(respostaClicada.parentNode.id !== "respondido"){
        for(let i=0;i<totalRespostas.length;i++){
            if(totalRespostas[i].id==="false"){
                totalRespostas[i].style.color = '#FF4B4B';
            }
            else{
                totalRespostas[i].style.color = '#009C22';
            }
            totalRespostas[i].style.opacity = '0.3';
        }
        respostaClicada.style.opacity = '1';
        respostaClicada.parentNode.id = 'respondido';
        numeroPerguntasRespondidas++;
        if(respostaClicada.id === "true"){
            numeroPerguntasAcertadas++;
        }
        if(numeroPerguntasRespondidas === numeroPerguntasTotal){
            darResultado();
        }
        setTimeout(proximaPergunta,2000,pergunta)
    }
}

function proximaPergunta(pergunta){
    if(pergunta.nextElementSibling !==null){
        pergunta.nextElementSibling.scrollIntoView({behavior: "smooth"});
    }
    
}

/*function darResultado(){
    const paginaQuizz = document.querySelector(".pagina-quizz-aberto");
}*/



function comparador() { 
	return Math.random() - 0.5; 
}








let resultado = true;
let qnt_perguntas = 0;
let niveis = 0;

function validateURL(){
    const url = document.querySelector(".url").value

    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    resultado = !!pattern.test(url);
    prosseguirParaPerguntas();
}

function prosseguirParaPerguntas(){
    const titulo = document.querySelector(".titulo").value;
    qnt_perguntas = parseInt(document.querySelector(".quantidadePerguntas").value);
    niveis = parseInt(document.querySelector(".quantidadeNiveis").value);

    if (resultado===false || titulo.length<20 || titulo.length>65 || qnt_perguntas<3 || niveis<2){
        alert("Preencha os dados corretamente");
    } else{
        mudarPagina();
    }
}

function mudarPagina(){
    const pagInfos = document.querySelector(".informacoes-basicas");
    pagInfos.classList.add("escondido");
    const pagCriacao = document.querySelector(".criar-perguntas");
    pagCriacao.classList.remove("escondido");
    
    popularPerguntas();
}

function popularPerguntas(){
    const numPerguntas = document.querySelector(".caixaPergunta");
    numPerguntas.innerHTML="";

    for (i=1; i<=qnt_perguntas; i++){
        numPerguntas.innerHTML+=`
            <div class="perguntas">
                <div class="numero-pergunta">
                    <h1>Pergunta ${i}</h1>
                    <ion-icon onclick="abrirMenuDados(this)" name="create-outline"></ion-icon>
                </div>
                <div class="dados-pergunta dropdown">
                    <input type="text" placeholder="Texto da pergunta" onfocus="this.value='';">
                    <input type="text" placeholder="Cor de fundo da pergunta" onfocus="this.value='';">    
                    <h2>Resposta correta</h2>
                    <input type="text" placeholder="Resposta correta" onfocus="this.value='';">
                    <input type="text" placeholder="URL da imagem" onfocus="this.value='';"> 
                    <h2>Respostas incorretas</h2>
                    <div class="resposta-incorreta">
                        <input type="text" placeholder="Resposta incorreta 1" onfocus="this.value='';">
                        <input type="text" placeholder="URL da imagem 1" onfocus="this.value='';"> 
                    </div>
                    <div class="resposta-incorreta">
                        <input type="text" placeholder="Resposta incorreta 2" onfocus="this.value='';">
                        <input type="text" placeholder="URL da imagem 2" onfocus="this.value='';"> 
                    </div>
                    <div class="resposta-incorreta">
                        <input type="text" placeholder="Resposta incorreta 3" onfocus="this.value='';">
                        <input type="text" placeholder="URL da imagem 3" onfocus="this.value='';"> 
                    </div>
                </div>
            </div>
        `;
    }
}


function abrirMenuDados(perguntaAberta){ // pega o elemento que voce clicou, que no caso é o ion-icon
    const dadosPergunta = perguntaAberta.parentNode.nextElementSibling;// do ion-icon vai até a parte que fica com os dados daquela pergunta
    const dadosTodasPerguntas = document.querySelectorAll(".dados-pergunta");//pega todos os dados de todas as perguntas
    const icones = document.querySelectorAll(".numero-pergunta ion-icon");//pega todos os icones das perguntas
    for(let i=0;i<dadosTodasPerguntas.length;i++){
        dadosTodasPerguntas[i].classList.add("dropdown");//coloca o dropdown em todas as perguntas
        icones[i].classList.remove("escondido");//remove o escondido das perguntas que não estão maximizadas
    }
    dadosPergunta.classList.remove("dropdown");// remove o dropdown só dos dados do ion-icon que voce clicou
    dadosPergunta.parentNode.scrollIntoView();//sobe para o inicio daquela pergunta(desnecessario,mas eu estava querendo testar essa função)
    perguntaAberta.classList.add("escondido");// esconde o ion-icon que voce clicou
}

function abrirMenuNiveis(){
    const elemento = document.querySelector(".dados-nivel");
    elemento.classList.remove("dropdown")

    const icone = document.querySelector(".niveis ion-icon");
    icone.classList.add("escondido")
}