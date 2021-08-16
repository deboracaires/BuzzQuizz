let todosQuizzes = {};
const paginaQuizz = document.querySelector(".pagina-quizz");
let qtdPerguntasMarcadas = 0;
let qtdRespostasCertas = 0;


// leitura de quizzes no servidor
function buscarQuizzes(){
    const promessa = axios.get('https://mock-api.bootcamp.respondeai.com.br/api/v3/buzzquizz/quizzes');
    promessa.then(processarQuizzes);
}
buscarQuizzes();

function processarQuizzes(resposta){
    todosQuizzes = resposta.data;
    renderizarQuizzes();
}
function verificaSeTemQuizzes(){
    const quizzesSalvos = localStorage.getItem("quizzes");
    if(quizzesSalvos !== "[-1]"){
        document.querySelector(".perfil-sem-quizzes").classList.add("escondido");
        document.querySelector(".perfil-com-quizzes").classList.remove("escondido");
        return true;
    }
    return false
}

function verificaQuizz(num, numQuizzes) {
    const meusQuizzes = document.querySelector(".seus-quizzes ul");
    for(let i = 0; i < numQuizzes.length; i++) {
        if(numQuizzes[i] === todosQuizzes[num].id) {
            meusQuizzes.innerHTML += `
        <li onclick="abrirQuizz(${todosQuizzes[num].id})">
            <div class="degrade">
                <span>${todosQuizzes[num].title}</span>
            </div>
        </li>`
        }
    }
}

function renderizarQuizzes(){
    let quiz;
    const temQuizz = verificaSeTemQuizzes();
    const quizzes = document.querySelector(".todos-os-quizzes ul");
    const listaMeusQuizzes = JSON.parse(localStorage.getItem("quizzes"));
    quizzes.innerHTML = '';
    for(let i=0; i<todosQuizzes.length; i++){
        if(temQuizz) {
            verificaQuizz(i, listaMeusQuizzes);
        }
            quizzes.innerHTML += `
        <li onclick="abrirQuizz(${todosQuizzes[i].id})">
            <div class="degrade">
                <span>${todosQuizzes[i].title}</span>
            </div>
        </li>`
        quiz = quizzes.querySelector("li"); 
    }
    for(let i=0; i<todosQuizzes.length; i++){
        quiz.style.backgroundImage = `url("${todosQuizzes[i].image}")`;
        quiz = quiz.nextElementSibling;
    }
}

let quizzEspecifico = {};

// abre a paginaQuizz com o quizz selecionado respectivo

function abrirQuizz(idQuizz){
   
    listaQuizzes.classList.add("escondido");
    
    paginaQuizz.classList.remove("escondido");
    
    const promessa = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v3/buzzquizz/quizzes/" +idQuizz);
    promessa.then(processarQuizz);
    
}
function processarQuizz(resposta){
    quizzEspecifico = resposta.data;
    renderizarQuizz();
}

function renderizarQuizz(){
    const mudaTopo = document.querySelector(".pagina-quizz .topo-quizz");
    mudaTopo.style.backgroundImage = `url("${quizzEspecifico.image}")`;
    
    const mudaTextoTopo = document.querySelector(".pagina-quizz .topo-quizz p")
    mudaTextoTopo.innerHTML = `${quizzEspecifico.title}`;
   
    const inserePerguntas = document.querySelector(".pagina-quizz ul");
    inserePerguntas.innerHTML = ``;
    for(let i=0; i < quizzEspecifico.questions.length; i++){
        const pergunta = quizzEspecifico.questions[i];
        inserePerguntas.innerHTML += `
            <li class="pergunta-quizz-conteiner">
                <div class="pergunta-quizz">
                    <p><strong> ${pergunta.title}</strong></p>
                </div>
                <div class="respostas-conteiner">
                </div>
            </li> 
        `;
        const conteinerPergunta = document.querySelector(".pagina-quizz ul").lastElementChild;
        
        const mudaCor = conteinerPergunta.firstElementChild;
        
        mudaCor.style.backgroundColor = `${quizzEspecifico.questions[i].color}`;

    }


    let insereRespostas = document.querySelector(".pagina-quizz ul li");
    
    for(let i=0; i < quizzEspecifico.questions.length; i++){
        const resposta = insereRespostas.lastElementChild;
        resposta.innerHTML = ``;
        const pergunta = quizzEspecifico.questions[i];
        let respostas = pergunta.answers;
        respostas.sort(embaralharRespostas);
        for(let j = 0; j<respostas.length; j++){
            if(respostas[j].isCorrectAnswer){
                resposta.innerHTML += `
                    <div class="opcao-resposta resposta-correta esconder" onclick="marcarResposta(this, ${respostas.length})">
                        <img src="${respostas[j].image}">
                        <p><strong>${respostas[j].text}</strong></p>
                    </div>
            `;
            } else{
                resposta.innerHTML += `
                    <div class="opcao-resposta resposta-incorreta esconder" onclick="marcarResposta(this, ${respostas.length})">
                        <img src="${respostas[j].image}">
                        <p><strong>${respostas[j].text}</strong></p>
                    </div>
            `;
            }
            
        }
        insereRespostas = insereRespostas.nextElementSibling;
    }
    window.scrollTo(0,0);
    
}

// para marcar as respostas e mostrar se acertou ou errou

function marcarResposta(elemento, numRespostas){
    let respostas = elemento.parentNode.firstElementChild;
    
    let possuiMarcado = false;
    for(let i=0; i < numRespostas; i++){
        respostas.classList.remove("esconder");
        if(respostas.classList.contains("marcado")){
            possuiMarcado = true;
        }
        
        respostas = respostas.nextElementSibling;
    }
    const verificaMarcacao = elemento.parentNode;
    
    
    if(possuiMarcado === false){
        elemento.classList.add("marcado");
        const verificaResposta = elemento.classList.contains("resposta-correta");
        qtdPerguntasMarcadas = qtdPerguntasMarcadas + 1;
        if(verificaResposta){
            qtdRespostasCertas = qtdRespostasCertas + 1;
        }
    }
    if(qtdPerguntasMarcadas === quizzEspecifico.questions.length){
        mostrarResultado();
    }
}

// mostrar resultado do quizz

function mostrarResultado(){
    const resultado = Math.round((qtdRespostasCertas/qtdPerguntasMarcadas)*100);
    console.log(resultado);
    const qtdNiveis = quizzEspecifico.levels.length;
    let nivelObtido = 0;
    for(let i = 0; i < qtdNiveis; i++){
        if(resultado >= quizzEspecifico.levels[i].minValue){
            nivelObtido = i;
        }
    }
    const ul = document.querySelector(".pagina-quizz ul").lastElementChild;
    ul.innerHTML += `
    <li class="final-quizz-conteiner">
        <div class="final-quizz vermelho">
            <strong> `+ resultado + `% de acerto: `+`${quizzEspecifico.levels[nivelObtido].title}</strong>
        </div>  
                <div class="imagem-final">
                    <img src="${quizzEspecifico.levels[nivelObtido].image}">
                    <p><strong>${quizzEspecifico.levels[nivelObtido].text}</strong></p>
                </div> 
    </li>
    `
    paginaQuizz.innerHTML += `
    <div class="reiniciar-quizz vermelho" onclick="reiniciarQuizz()">Reiniciar Quizz</div>
    <div class="voltar-home" onclick="voltarHome()">Voltar para home</div>`;
}


function embaralharRespostas() { 
	return Math.random() - 0.5; 
}

function reiniciarQuizz(){
    renderizarQuizz();
    qtdPerguntasMarcadas = 0;
    qtdRespostasCertas = 0;
    window.scrollTo(0,0);
}

function voltarHome(){  
    window.location.reload();
}