let numeroPerguntasRespondidas = 0, numeroPerguntasAcertadas = 0, numeroPerguntasTotal = 0, niveisQuizzAberto = [],idQuizzAberto=0;

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
    idQuizzAberto=quizz.id;
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
    niveisQuizzAberto = resposta.data.levels;
    perguntas.forEach(popularPerguntasQuizzAberto);
}

function popularPerguntasQuizzAberto(pergunta,indice){
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
        setTimeout(proximoElemento,2000,pergunta)
    }
}

function proximoElemento(elemento){
    if(elemento.nextElementSibling !==null){
        elemento.nextElementSibling.scrollIntoView({behavior: "smooth"});
    }
    if(elemento.classList.value === "resultado"){
        elemento.scrollIntoView({behavior: "smooth"})
    }
}

function darResultado(){
    const paginaQuizz = document.querySelector(".pagina-quizz-aberto");
    const acertosPorcentagem = Math.round((numeroPerguntasAcertadas/numeroPerguntasTotal)*100);
    const resultadoAlcancado = niveisQuizzAberto.find(descobrirResultado);
    paginaQuizz.innerHTML += `
    <div class="resultado">
        <div class="titulo-resultado">
            <span >${acertosPorcentagem}% de acerto: ${resultadoAlcancado.title}</span>
        </div>
        <img src="${resultadoAlcancado.image}">
        <span class="descricao">${resultadoAlcancado.text}</span>
    </div>
    <button onclick="reiniciarQuizzAberto()">Reiniciar Quizz</button>
    <button onclick="sairQuizzAberto()">Voltar pra home</button>`;
    const resultado = document.querySelector(".resultado");
    setTimeout(proximoElemento,2000,resultado);
}
function descobrirResultado(possivelResultado,indice){
    const acertosPorcentagem = Math.round((numeroPerguntasAcertadas/numeroPerguntasTotal)*100);
    let maxValue;
    if(indice+1 === niveisQuizzAberto.length){
        maxValue = 101;
    }
    else{
        maxValue = niveisQuizzAberto[indice+1].minValue
    }
    return (acertosPorcentagem>=possivelResultado.minValue && acertosPorcentagem<maxValue);

}

function reiniciarQuizzAberto(){
    const promise = axios.get(`https://mock-api.bootcamp.respondeai.com.br/api/v2/buzzquizz/quizzes/${idQuizzAberto}`);
    promise.then(criarPaginaQuizz);
    const paginaQuizz = document.querySelector(".pagina-quizz-aberto");
    paginaQuizz.scrollTo(0,0);
}

function sairQuizzAberto(){
    const paginaQuizz = document.querySelector(".pagina-quizz-aberto");
    paginaQuizz.scrollTo(0,0);
    document.querySelector(".pagina-quizz-aberto").classList.add("escondido");
    window.scrollTo(0,0);
}


function comparador() { 
	return Math.random() - 0.5; 
}








let qnt_perguntas = 0;
let niveis = 0;

function prosseguirParaPerguntas(){
    const titulo = document.querySelector(".titulo").value;
    const url = document.querySelector(".url").value
    qnt_perguntas = parseInt(document.querySelector(".quantidadePerguntas").value);
    niveis = parseInt(document.querySelector(".quantidadeNiveis").value);

    if (!validateURL(url) || titulo.length<20 || titulo.length>65 || qnt_perguntas<3 || niveis<2){
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
            <div class="perguntas pergunta${i}">
                <div class="numero-pergunta">
                    <h1>Pergunta ${i}</h1>
                    <ion-icon onclick="abrirMenuDados(this)" name="create-outline"></ion-icon>
                </div>
                <div class="dados-pergunta dropdown">
                    <input type="text" class="texto" placeholder="Texto da pergunta" onfocus="this.value='';">
                    <input type="text" class="cor" placeholder="Cor de fundo da pergunta" onfocus="this.value='';">    
                    <h2>Resposta correta</h2>
                    <input type="text" class="correta" placeholder="Resposta correta" onfocus="this.value='';" required>
                    <input type="text" class="urlResposta" placeholder="URL da imagem" onfocus="this.value='';" required> 
                    <h2>Respostas incorretas</h2>
                    <div class="resposta-incorreta inc1">
                        <input type="text" placeholder="Resposta incorreta 1" onfocus="this.value='';">
                        <input type="text" placeholder="URL da imagem 1" onfocus="this.value='';"> 
                    </div>
                    <div class="resposta-incorreta inc2">
                        <input type="text" placeholder="Resposta incorreta 2" onfocus="this.value='';">
                        <input type="text" placeholder="URL da imagem 2" onfocus="this.value='';"> 
                    </div>
                    <div class="resposta-incorreta inc3">
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

function prosseguirParaNiveis(){
    for(let i=1; i<=qnt_perguntas; i++){
        const pergunta = document.querySelector(".pergunta"+i);
        const texto = pergunta.querySelector(".dados-pergunta .texto").value;
        const cor = pergunta.querySelector(".dados-pergunta .cor").value;
        const respostaCorreta = pergunta.querySelector(".dados-pergunta .correta").value;
        const urlResposta = pergunta.querySelector(".dados-pergunta .urlResposta").value;

        if (texto.length<20 || !isHexColor(cor) || respostaCorreta==="" || !validateURL(urlResposta) || (pergunta.querySelector(".inc1").value==="" && pergunta.querySelector(".inc2").value==="" && pergunta.querySelector(".inc3").value==="")){
            alert("Preencha os dados corretamente");
        } else{
            passarPag();
        }
    }
}

function passarPag(){
    const pagCriacao = document.querySelector(".criar-perguntas");
    pagCriacao.classList.add("escondido");
    const pagNiveis = document.querySelector(".definir-niveis");
    pagNiveis.classList.remove("escondido");

    popularNiveis();
}

function popularNiveis(){
    const numNiveis = document.querySelector(".caixa-niveis");
    numNiveis.innerHTML = "";

    for (i=1; i<=niveis; i++){
        numNiveis.innerHTML+= `
            <div class="niveis nivel${i}">
                <div class="numero-pergunta">
                    <h1>Nível ${i}</h1>
                    <ion-icon onclick="abrirMenuNiveis(this)" name="create-outline"></ion-icon>
                </div>
                <div class="dados-nivel dropdown">
                    <input type="text" class="titulo" placeholder="Título do nível" onfocus="this.value='';">
                    <input type="number" class="porcentagem" placeholder="% de acerto mínima" max=100 min=0 onfocus="this.value='';">
                    <input type="url" class="imagem" placeholder="URL da imagem do nível" onfocus="this.value='';">
                    <input type="text" class="descricao" placeholder="Descrição do nível" onfocus="this.value='';">
                </div>
            </div>   
        `;
    }
}

function abrirMenuNiveis(nivelAberto){
    const dadosNivel = nivelAberto.parentNode.nextElementSibling;
    const dadosTodosNiveis = document.querySelectorAll(".dados-nivel");
    const icones = document.querySelectorAll(".numero-pergunta ion-icon");
    
    for(let i=0;i<dadosTodosNiveis.length;i++){
        dadosTodosNiveis[i].classList.add("dropdown");
        icones[i].classList.remove("escondido");
    }

    dadosNivel.classList.remove("dropdown");
    dadosNivel.parentNode.scrollIntoView();
    nivelAberto.classList.add("escondido");
}

function finalizarQuizz(){
    for (i=1; i<=niveis; i++){
        const nivel = document.querySelector(".nivel"+i);
        const titulo = nivel.querySelector(".titulo").value;
        const porcentagem = nivel.querySelector(".porcentagem").value;
        const imagem = nivel.querySelector(".imagem").value;
        const descricao = nivel.querySelector(".descricao").value;

    }

}





function validateURL(str){
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
}

function isHexColor (str) {   
    if (!/^#[0-9A-F]{6}$/i.test(str)){
        return false;
    }
    return true;
}