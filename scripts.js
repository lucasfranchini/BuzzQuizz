let numeroPerguntasRespondidas = 0, numeroPerguntasAcertadas = 0, numeroPerguntasTotal = 0, niveisQuizzAberto = [], idQuizzAberto = 0,contador=0;;
let seusQuizzes = JSON.parse(localStorage.getItem("Meus quizzes"));
let tituloQuizz = "", urlTitulo = "", qntPerguntas = 0, niveis = 0, meuQuizz = 0;
const dados = {};
const telaCarregamento = document.querySelector(".tela-carregamento");
pegarquizzes();

function pegarquizzes() {
    telaCarregamento.classList.remove("escondido");
    const promise = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v2/buzzquizz/quizzes");
    promise.then(popularquizzes);
}

function popularquizzes(resposta) {
    contador =0;
    let quizzes = resposta.data;
    const campoTodosQuizzes = document.querySelector(".todos-quizzes ul");
    campoTodosQuizzes.innerHTML = "";
    if (seusQuizzes === null) {
        for (let i = 0; i < quizzes.length; i++) {
            campoTodosQuizzes.innerHTML += `
            <li id=${quizzes[i].id}  >
                <img src="${quizzes[i].image}">
                <div class="degrade" onclick ="abrirQuizz(this)"></div>
                <span onclick ="abrirQuizz(this)">${quizzes[i].title}</span>
            </li>`;
        }
        seusQuizzes = {
            id : [],
            key: []
        };
    }
    else {
        const campoMeusQuizzes = document.querySelector(".meus-quizzes ul");
        document.querySelector(".nenhum-quizz").classList.add("escondido");
        document.querySelector(".cabecalho").classList.remove("escondido");
        campoMeusQuizzes.innerHTML = "";
        quizzes = quizzes.filter(verificandoMeusQuizzes)
        if(contador === 0){
            document.querySelector(".nenhum-quizz").classList.remove("escondido");
        }
        for (let i = 0; i < quizzes.length; i++) {
            campoTodosQuizzes.innerHTML += `
            <li id=${quizzes[i].id}  >
                <img src="${quizzes[i].image}">
                <div class="degrade"onclick ="abrirQuizz(this)"></div>
                <span onclick ="abrirQuizz(this)">${quizzes[i].title}</span>
            </li>`;
        }
    }
    telaCarregamento.classList.add("escondido");
}

function verificandoMeusQuizzes(quizz){
    let verificador =true; 
    for(let i = 0; i<seusQuizzes.id.length;i++){
        if(quizz.id === seusQuizzes.id[i]){
            verificador = false;
            popularMeuQuizz(quizz);
            contador++;
        }
    }
    return verificador;
}

function popularMeuQuizz(quizz){
    const campoMeusQuizzes = document.querySelector(".meus-quizzes ul");
    campoMeusQuizzes.innerHTML += `
    <li id=${quizz.id}>
        <img src="${quizz.image}" >
        <div class="degrade"onclick ="abrirQuizz(this)"></div>
        <span onclick ="abrirQuizz(this)">${quizz.title}</span>
        <div class="edit-delete">
            <ion-icon name="create-outline" onclick = "editarQuizz(this)"></ion-icon>
            <ion-icon name="trash-outline" onclick = "deletarQuizz(this)">></ion-icon>
        </div>
    </li>`;
}

function abrirQuizz(quizz) {
    telaCarregamento.classList.remove("escondido");
    const promise = axios.get(`https://mock-api.bootcamp.respondeai.com.br/api/v2/buzzquizz/quizzes/${quizz.parentNode.id}`);
    promise.then(criarPaginaQuizz);
    idQuizzAberto = quizz.id;
}

function criarPaginaQuizz(resposta) {
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
    telaCarregamento.classList.add("escondido");
}

function popularPerguntasQuizzAberto(pergunta, indice) {
    const paginaQuizz = document.querySelector(".pagina-quizz-aberto");
    const respostas = pergunta.answers;
    respostas.sort(comparador);
    paginaQuizz.innerHTML += `
    <div class="pergunta">
        <div class="titulo-pergunta" style="background-color:${pergunta.color}">
            <span>${pergunta.title}</span>
        </div>
        <div class="caixa-respostas">
        </div>
    </div>`;
    const campoResposta = document.querySelectorAll(".caixa-respostas")[indice];
    for (let i = 0; i < respostas.length; i++) {
        campoResposta.innerHTML += `
        <div class="resposta" id="${respostas[i].isCorrectAnswer}"onclick="darResposta(this)">
            <img src="${respostas[i].image}">
            <span>${respostas[i].text}</span>
        </div>`;
    }
}

function darResposta(respostaClicada) {
    const totalRespostas = respostaClicada.parentNode.children;
    const pergunta = respostaClicada.parentNode.parentNode;
    if (respostaClicada.parentNode.id !== "respondido") {
        for (let i = 0; i < totalRespostas.length; i++) {
            if (totalRespostas[i].id === "false") {
                totalRespostas[i].style.color = '#FF4B4B';
            }
            else {
                totalRespostas[i].style.color = '#009C22';
            }
            totalRespostas[i].style.opacity = '0.3';
        }
        respostaClicada.style.opacity = '1';
        respostaClicada.parentNode.id = 'respondido';
        numeroPerguntasRespondidas++;
        if (respostaClicada.id === "true") {
            numeroPerguntasAcertadas++;
        }
        if (numeroPerguntasRespondidas === numeroPerguntasTotal) {
            darResultado();
        }
        setTimeout(function (elemento) {
            if (elemento.nextElementSibling !== null) {
                elemento.nextElementSibling.scrollIntoView({ behavior: "smooth" });
            }
        }, 2000, pergunta);
    }
}

function darResultado() {
    const paginaQuizz = document.querySelector(".pagina-quizz-aberto");
    const acertosPorcentagem = Math.round((numeroPerguntasAcertadas / numeroPerguntasTotal) * 100);
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
    setTimeout(() => document.querySelector(".resultado").scrollIntoView({ behavior: "smooth" }), 2000);
}

function descobrirResultado(possivelResultado, indice) {
    const acertosPorcentagem = Math.round((numeroPerguntasAcertadas / numeroPerguntasTotal) * 100);
    let maxValue;
    if (indice + 1 === niveisQuizzAberto.length) {
        maxValue = 101;
    }
    else {
        maxValue = niveisQuizzAberto[indice + 1].minValue
    }
    return (acertosPorcentagem >= possivelResultado.minValue && acertosPorcentagem < maxValue);

}

function reiniciarQuizzAberto() {
    const promise = axios.get(`https://mock-api.bootcamp.respondeai.com.br/api/v2/buzzquizz/quizzes/${idQuizzAberto}`);
    promise.then(criarPaginaQuizz);
    const paginaQuizz = document.querySelector(".pagina-quizz-aberto");
    paginaQuizz.scrollTo(0, 0);
}

function sairQuizzAberto() {
    const paginaQuizz = document.querySelector(".pagina-quizz-aberto");
    paginaQuizz.scrollTo(0, 0);
    document.querySelector(".pagina-quizz-aberto").classList.add("escondido");
    window.scrollTo(0, 0);
    pegarquizzes();
}


function comparador() {
    return Math.random() - 0.5;
}

function abrirCriadorDeQuizzes(){
    document.querySelector(".pagina-inicial").classList.add("escondido");
    document.querySelector(".informacoes-basicas").classList.remove("escondido");
}

function prosseguirParaPerguntas() {
    tituloQuizz = document.querySelector(".titulo").value;
    urlTitulo = document.querySelector(".url").value
    qntPerguntas = parseInt(document.querySelector(".quantidadePerguntas").value);
    niveis = parseInt(document.querySelector(".quantidadeNiveis").value);

    if (!validateURL(urlTitulo) || tituloQuizz.length < 20 || tituloQuizz.length > 65 || qntPerguntas < 3 || niveis < 2) {
        alert("Preencha os dados corretamente");
        if (!validateURL(urlTitulo)){
            const corURL = document.querySelector(".novo-quiz .url");
            corURL.classList.add("erro");
            const textoURL = document.querySelector(".novo-quiz .alertaURL");
            textoURL.classList.remove("escondido");
        }
        if (tituloQuizz.length < 20 || tituloQuizz.length > 65){
            const corTitulo = document.querySelector(".novo-quiz .titulo");
            corTitulo.classList.add("erro");
            const textoTitulo = document.querySelector(".novo-quiz .alertaTitulo");
            textoTitulo.classList.remove("escondido");
        }
        if (qntPerguntas < 3){
            const corPerguntas = document.querySelector(".novo-quiz .quantidadePerguntas");
            corPerguntas.classList.add("erro");
            const textoPerguntas = document.querySelector(".novo-quiz .alertaPerguntas");
            textoPerguntas.classList.remove("escondido");
        }
        if (niveis < 2){
            const corNiveis = document.querySelector(".novo-quiz .quantidadeNiveis");
            corNiveis.classList.add("erro");
            const textoNiveis = document.querySelector(".novo-quiz .alertaNiveis");
            textoNiveis.classList.remove("escondido");

        }
    } else {
        irParaPerguntas();
    }

    dados.title = tituloQuizz;
    dados.image = urlTitulo;
}

function irParaPerguntas() {
    const pagInfos = document.querySelector(".informacoes-basicas");
    pagInfos.classList.add("escondido");
    const pagCriacao = document.querySelector(".criar-perguntas");
    pagCriacao.classList.remove("escondido");

    popularPerguntas();
}

function popularPerguntas() {
    const numPerguntas = document.querySelector(".caixa-pergunta");
    numPerguntas.innerHTML = "";

    for (i = 1; i <= qntPerguntas; i++) {
        numPerguntas.innerHTML += `
            <div class="perguntas pergunta${i}">
                <div class="numero-pergunta">
                    <h1>Pergunta ${i}</h1>
                    <ion-icon onclick="abrirMenuDados(this)" name="create-outline"></ion-icon>
                </div>
                <div class="dados-pergunta dropdown">
                    <input type="text" class="texto" placeholder="Texto da pergunta" onfocus="this.value='';">
                    <p class="escondido">O título deve conter no mínimo 20 caracteres.</p>
                    <input type="text" class="cor" placeholder="Cor de fundo da pergunta" onfocus="this.value='';">
                    <p class="escondido">A cor deve ter o formato hexadecimal, com letras de A a F e números (ex. #e3f1a5).</p>    
                    <h2>Resposta correta</h2>
                    <input type="text" class="correta" placeholder="Resposta correta" onfocus="this.value='';" required>
                    <p class="escondido">O campo de respostas não pode estar vazio.</p>
                    <input type="text" class="urlRespostaCorreta" placeholder="URL da imagem" onfocus="this.value='';" required>
                    <p class="escondido">O valor informado não é uma URL válida.</p>
                    <h2>Respostas incorretas</h2>
                    <div class="resposta-incorreta">
                        <input type="text" class="incorreta1" placeholder="Resposta incorreta 1" onfocus="this.value='';">
                        <p class="escondido">O campo de respostas não pode estar vazio.</p>
                        <input type="text" class="urlIncorreta1" placeholder="URL da imagem 1" onfocus="this.value='';">
                        <p class="escondido">O valor informado não é uma URL válida.</p>
                    </div>
                    <div class="resposta-incorreta">
                        <input type="text" class="incorreta2" placeholder="Resposta incorreta 2" onfocus="this.value='';">
                        <p class="escondido">O campo de respostas não pode estar vazio.</p>
                        <input type="text" class="urlIncorreta2" placeholder="URL da imagem 2" onfocus="this.value='';">
                        <p class="escondido">O valor informado não é uma URL válida.</p>
                    </div>
                    <div class="resposta-incorreta">
                        <input type="text" class="incorreta3" placeholder="Resposta incorreta 3" onfocus="this.value='';">
                        <p class="escondido">O campo de respostas não pode estar vazio.</p>
                        <input type="text" class="urlIncorreta3" placeholder="URL da imagem 3" onfocus="this.value='';">
                        <p class="escondido">O valor informado não é uma URL válida.</p>
                    </div>
                </div>
            </div>
        `;
    }
}

function abrirMenuDados(perguntaAberta) { // pega o elemento que voce clicou, que no caso é o ion-icon
    const dadosPergunta = perguntaAberta.parentNode.nextElementSibling;// do ion-icon vai até a parte que fica com os dados daquela pergunta
    const dadosTodasPerguntas = document.querySelectorAll(".dados-pergunta");//pega todos os dados de todas as perguntas
    const icones = document.querySelectorAll(".numero-pergunta ion-icon");//pega todos os icones das perguntas
    for (let i = 0; i < dadosTodasPerguntas.length; i++) {
        dadosTodasPerguntas[i].classList.add("dropdown");//coloca o dropdown em todas as perguntas
        icones[i].classList.remove("escondido");//remove o escondido das perguntas que não estão maximizadas
    }
    dadosPergunta.classList.remove("dropdown");// remove o dropdown só dos dados do ion-icon que voce clicou
    dadosPergunta.parentNode.scrollIntoView();//sobe para o inicio daquela pergunta(desnecessario,mas eu estava querendo testar essa função)
    perguntaAberta.classList.add("escondido");// esconde o ion-icon que voce clicou
}

function prosseguirParaNiveis() {
    const questions = [];

    for (let i = 1; i <= qntPerguntas; i++) {
        const pergunta = document.querySelector(".pergunta" + i);
        const texto = pergunta.querySelector(".dados-pergunta .texto").value;
        const cor = pergunta.querySelector(".dados-pergunta .cor").value;
        const respostaCorreta = pergunta.querySelector(".dados-pergunta .correta").value;
        const urlRespostaCorreta = pergunta.querySelector(".dados-pergunta .urlRespostaCorreta").value;
        const answers = [];

        if (texto.length < 20) {
            alert("Preencha os dados corretamente");
            return;
        }

        if (!isHexColor(cor)) {
            alert("Preencha os dados corretamente");
            return;
        }

        if (respostaCorreta === "") {
            alert("Preencha os dados corretamente");
            return;
        }

        if (!validateURL(urlRespostaCorreta)) {
            alert("Preencha os dados corretamente");
            return;
        }

        if (pergunta.querySelector(".incorreta1").value === "" && pergunta.querySelector(".incorreta2").value === "" && pergunta.querySelector(".incorreta3").value === "") {
            alert("Preencha os dados corretamente");
            return;
        }

        answers.push({
            text: respostaCorreta,
            image: urlRespostaCorreta,
            isCorrectAnswer: true
        })

        for (let z = 1; z <= 3; z++) {
            const respostaIncorreta = pergunta.querySelector(".incorreta" + z).value;
            const urlIncorreta = pergunta.querySelector(".urlIncorreta" + z).value;

            if (respostaIncorreta !== "") {
                if (!validateURL(urlIncorreta)) {
                    alert("Preencha os dados corretamente");
                    return;
                }

                answers.push({
                    text: respostaIncorreta,
                    image: urlIncorreta,
                    isCorrectAnswer: false
                })
            }
        }
        questions.push({
            title: texto,
            color: cor,
            answers: answers
        })
    }

    dados.questions = questions;

    irParaNiveis();
}

function irParaNiveis() {
    const pagCriacao = document.querySelector(".criar-perguntas");
    pagCriacao.classList.add("escondido");
    const pagNiveis = document.querySelector(".definir-niveis");
    pagNiveis.classList.remove("escondido");

    popularNiveis();
}

function popularNiveis() {
    const numNiveis = document.querySelector(".caixa-niveis");
    numNiveis.innerHTML = "";

    for (i = 1; i <= niveis; i++) {
        numNiveis.innerHTML += `
            <div class="niveis nivel${i}">
                <div class="numero-pergunta">
                    <h1>Nível ${i}</h1>
                    <ion-icon onclick="abrirMenuNiveis(this)" name="create-outline"></ion-icon>
                </div>
                <div class="dados-nivel dropdown">
                    <input type="text" class="titulo" placeholder="Título do nível" onfocus="this.value='';">
                    <p class="escondido">O título deve conter no mínimo 10 caracteres.</p>
                    <input type="number" class="porcentagem" placeholder="% de acerto mínima" max=100 min=0 onfocus="this.value='';">
                    <p class="escondido">A % deve ser um número entre 0 e 100.</p>
                    <input type="url" class="urlImagem" placeholder="URL da imagem do nível" onfocus="this.value='';">
                    <p class="escondido">O valor informado não é uma URL válida.</p>
                    <input type="text" class="descricao" placeholder="Descrição do nível" onfocus="this.value='';">
                    <p class="escondido">A descrição deve conter no mínimo 30 caracteres.</p>
                </div>
            </div>   
        `;
    }
}

function abrirMenuNiveis(nivelAberto) {
    const dadosNivel = nivelAberto.parentNode.nextElementSibling;
    const dadosTodosNiveis = document.querySelectorAll(".dados-nivel");
    const icones = document.querySelectorAll(".niveis .numero-pergunta ion-icon");

    for (let i = 0; i < dadosTodosNiveis.length; i++) {
        dadosTodosNiveis[i].classList.add("dropdown");
        icones[i].classList.remove("escondido");
    }

    dadosNivel.classList.remove("dropdown");
    dadosNivel.parentNode.scrollIntoView();
    nivelAberto.classList.add("escondido");
}

function finalizarQuizz() {
    const levels = [];
    const porcentagens = [];
    for (i = 1; i <= niveis; i++) {
        const nivel = document.querySelector(".nivel" + i);
        const titulo = nivel.querySelector(".titulo").value;
        const porcentagem = parseInt(nivel.querySelector(".porcentagem").value);
        const urlImagem = nivel.querySelector(".urlImagem").value;
        const descricao = nivel.querySelector(".descricao").value;

        porcentagens.push(porcentagem);

        if (titulo.length < 10) {
            alert("Preencha os dados corretamente");
            return;
        }

        if (porcentagem < 0 || porcentagem > 100 || porcentagem === "") {
            alert("Preencha os dados corretamente");
            return;
        }

        if (!validateURL(urlImagem)) {
            alert("Preencha os dados corretamente");
            return;
        }

        if (descricao < 30) {
            alert("Preencha os dados corretamente");
            return;
        }

        levels.push({
            title: titulo,
            image: urlImagem,
            text: descricao,
            minValue: porcentagem
        })

    }
    if (porcentagens.indexOf(0) === -1) {
        alert("Preencha os dados corretamente");
        return;
    }

    dados.levels = levels;

    telaCarregamento.classList.remove("escondido");

    const promessa = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/buzzquizz/quizzes", dados);
    promessa.then(salvandoMeuQuizz);
    promessa.catch(erro);

    irParaFinalizacao();
}

function salvandoMeuQuizz(resposta) {
    meuQuizz = resposta.data;
    console.log(resposta);
    seusQuizzes.id.push(meuQuizz.id);
    seusQuizzes.key.push(meuQuizz.key);
    localStorage.setItem("Meus quizzes", JSON.stringify(seusQuizzes));
    telaCarregamento.classList.add("escondido");
}

function erro() {
    alert("Ocorreu um erro no envio do seu quizz");
    telaCarregamento.classList.add("escondido");
}

function irParaFinalizacao() {
    const pagNiveis = document.querySelector(".definir-niveis");
    pagNiveis.classList.add("escondido");
    const pagFinalizacao = document.querySelector(".finalizar-criacao");
    pagFinalizacao.classList.remove("escondido");

    popularFinalizacao();
}

function popularFinalizacao() {
    const finalizar = document.querySelector(".finalizar-criacao div");
    finalizar.innerHTML = `
        <img src="${urlTitulo}">
        <div class="degrade-finalizacao"></div>
        <div class="titulo"><p>${tituloQuizz}</p></div>
    `;
}

function acessarQuizz() {
    pegarquizzes();
    const pagFinalizacao = document.querySelector(".finalizar-criacao");
    pagFinalizacao.classList.add("escondido");
    const meusQuizzes = document.querySelector(".meus-quizzes");
    meusQuizzes.classList.remove("escondido");
    abrirQuizz(meuQuizz);
}

function voltarHome() {
    pegarquizzes();
    const pagFinalizacao = document.querySelector(".finalizar-criacao");
    pagFinalizacao.classList.add("escondido");
    const meusQuizzes = document.querySelector(".meus-quizzes");
    meusQuizzes.classList.remove("escondido");
    const cabecalho = document.querySelector(".cabecalho");
    cabecalho.classList.remove("escondido");
    const todosQuizzes = document.querySelector(".todos-quizzes");
    todosQuizzes.classList.remove("escondido");
    document.querySelector(".pagina-inicial").classList.remove("escondido");
}

function validateURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(str);
}

function isHexColor(str) {
    if (!/^#[0-9A-F]{6}$/i.test(str)) {
        return false;
    }
    return true;
}



function deletarQuizz(QuizzIon){
    const quizz = QuizzIon.parentNode.parentNode;
    const key = seusQuizzes.key[seusQuizzes.id.indexOf(parseInt(quizz.id))];
    const promessa = axios.delete(`https://mock-api.bootcamp.respondeai.com.br/api/v2/buzzquizz/quizzes/${parseInt(quizz.id)}`,{headers: {'Secret-Key': key}});
    promessa.then(deletarQuizzDoCache);
    promessa.catch(()=>alert("Algo impediu seu quizz de ser apagado, tente novamente"));

    function deletarQuizzDoCache(){
        seusQuizzes.key = seusQuizzes.key.filter(function(chave){
            if(chave === key){
                return false;
            }
            return true;
        })
        seusQuizzes.id = seusQuizzes.id.filter(function(id){
            if(id === parseInt(quizz.id)){
                return false;
            }
            return true;
        })
        pegarquizzes();
    }
}

