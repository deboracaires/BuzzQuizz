const URL_QUIZZES = "https://mock-api.bootcamp.respondeai.com.br/api/v3/buzzquizz/quizzes";
const listaQuizzes = document.querySelector(".lista-quizzes");
const telaCriarComeco = document.querySelector(".criar-quizz-comeco");
const telaCriarPerguntas = document.querySelector(".criar-quizz-perguntas");
const telaCriarNiveis = document.querySelector(".criar-quizz-niveis");
const telaCriarFinal = document.querySelector(".criar-quizz-final");
let titulo;
let urlImagem;
let numPerguntas;
let numNiveis;
const perguntas = [];
const niveis = [];

function criaLocalStorage() {
    if(localStorage.getItem("quizzes") === null) {
    localStorage.setItem("quizzes", "[-1]");
    }
}
criaLocalStorage();
function adicionaInfosBasicas() {
    const dadosComeco = document.querySelectorAll('.criar-quizz-comeco li input');
    titulo = dadosComeco[0].value;
    urlImagem = dadosComeco[1].value;
    numPerguntas = Number(dadosComeco[2].value);
    numNiveis = Number(dadosComeco[3].value);
}

function adicionaInfosPerguntas() {
    for(let i = 0; i < numPerguntas; i++) {
        let grupoPerguntas = document.getElementById(`pergunta${i + 1}`);
        perguntas[i] = {
            title: grupoPerguntas.querySelector('li:nth-child(2) input').value,
            color: grupoPerguntas.querySelector('li:nth-child(3) input').value,
            answers: [
                {
                    text: grupoPerguntas.querySelector('li:nth-child(5) input').value,
                    image: grupoPerguntas.querySelector('li:nth-child(6) input').value,
                    isCorrectAnswer: true
                },
                {
                    text: grupoPerguntas.querySelector('li:nth-child(8) input').value,
                    image: grupoPerguntas.querySelector('li:nth-child(9) input').value,
                    isCorrectAnswer: false
                }
            ]
        }
        if(grupoPerguntas.querySelector('li:nth-child(10) input').value !== "") {
            perguntas[i].answers.push({
                text: grupoPerguntas.querySelector('li:nth-child(10) input').value,
                image: grupoPerguntas.querySelector('li:nth-child(11) input').value,
                isCorrectAnswer: false
            })
        }
        if(grupoPerguntas.querySelector('li:nth-child(12) input').value !== "") {
            perguntas[i].answers.push({
                text: grupoPerguntas.querySelector('li:nth-child(12) input').value,
                image: grupoPerguntas.querySelector('li:nth-child(13) input').value,
                isCorrectAnswer: false
            })
        }
    }
}

function adicionaInfosNiveis() {
    for(let i = 0; i < numNiveis; i++) {
        let grupoNiveis = document.getElementById(`nivel${i + 1}`);
        niveis[i] = {
            title: grupoNiveis.querySelector('li:nth-child(2) input').value,
            image: grupoNiveis.querySelector('li:nth-child(4) input').value,
            text: grupoNiveis.querySelector('li:nth-child(5) textarea').value,
            minValue: Number(grupoNiveis.querySelector('li:nth-child(3) input').value)
        }
    }
}

function adicionaInfosFinais() {
    telaCriarFinal.querySelector(".img-quizz-criado").style.backgroundImage = `url(${urlImagem})`;
    telaCriarFinal.querySelector(".img-quizz-criado span").innerHTML = titulo;
}

function eCorHexadecimal(cor) {
    let soCor = cor.substring(1, 7);
        console.log(soCor);
        if(cor.length === 7 && !isNaN(Number('0x' + soCor))) {
            return true;
        }
        return false;
  }

function saoPerguntasValidas(p) {
    if(p.title.length < 20 || p.color.indexOf("#") !== 0 || !eCorHexadecimal(p.color) || p.answers[0].text === "" || p.answers[1].text === "" || 
    p.answers[0].image.indexOf("https://") === -1 || p.answers[1].image.indexOf("https://") === -1) {
        return true;
    } else {
        return false;
    }
}
function saoNiveisValidos(n) {
    if(n.title.length < 10 || n.minValue < 0 || n.minValue > 100 || n.image.indexOf ("https://") === -1 || n.text.length < 30) {
        return true;
    } else {
        for(let i = 0; i < niveis.length; i++) {
            if(niveis[i].minValue === 0) {
                return false;
            }    
        }
        return true;
    }
}

function criarQuizzComeco() {
    listaQuizzes.classList.add('escondido');
    telaCriarComeco.classList.remove('escondido');
}
function criarQuizzPerguntas() {
    adicionaInfosBasicas();
    adicionaInfosFinais();
    if(titulo.length < 20 || titulo.length > 65 || urlImagem.indexOf("https://") === -1 || numPerguntas < 3 || numNiveis < 2) {
        alert('Erro, preencha os dados novamente!');
    } else {
        telaCriarComeco.classList.add('escondido');
        telaCriarPerguntas.classList.remove("escondido");
        renderizarAdicaoPergunta(1);
    }
}

function criarQuizzNiveis() {
    adicionaInfosPerguntas();

    for(let i = 0; i < numPerguntas; i++) {
        if(saoPerguntasValidas(perguntas[i])){
            alert('Erro, preencha os dados novamente!');
            return;
        }
    }
    renderizarAdicaoNiveis(1);
    telaCriarPerguntas.classList.add("escondido");
    telaCriarNiveis.classList.remove("escondido");
}
function criarQuizzFinal() {
    adicionaInfosNiveis();

    for(let i = 0; i < numNiveis; i++) {
        if(saoNiveisValidos(niveis[i])) {
            alert('Erro, preencha os dados novamente!');
            return;
        }
    }
    telaCriarNiveis.classList.add("escondido");
    telaCriarFinal.classList.remove("escondido");
    enviaQuizz();
}

function voltaHome() {
    telaCriarFinal.classList.add("escondido");
    listaQuizzes.classList.remove('escondido');
}

function renderizarAdicaoPergunta(num) {
    const blocoCriarPerguntas = document.getElementById(`pergunta${num}`);
    blocoCriarPerguntas.innerHTML =
    `<ul>
        <li class="subtitulo-criar-quizz"><strong> Pergunta ${num}</strong></li>
        <li><input type="text" placeholder="Texto da pergunta" required></li>
        <li><input type="text" placeholder="Cor de fundo da pergunta" required></li>

        <li class="subtitulo-criar-quizz"><strong> Resposta correta</strong></li>
        <li><input type="text" placeholder="Resposta correta" required></li>
        <li><input type="text" placeholder="URL da imagem" required></li>

        <li class="subtitulo-criar-quizz"><strong> Respostas incorretas</strong></li>
        <li><input type="text" placeholder="Resposta incorreta 1" required></li>
        <li class="respiro-li"><input type="text" placeholder="URL da imagem 1" required></li>

        <li><input type="text" placeholder="Resposta incorreta 2" required></li>
        <li class="respiro-li"><input type="text" placeholder="URL da imagem 2" required></li>

        <li><input type="text" placeholder="Resposta incorreta 3" required></li>
        <li><input type="text" placeholder="URL da imagem 3" required></li>
    </ul>`

    if(num === 1) {
        for(let i = 2; i <= numPerguntas; i++) {
            blocoCriarPerguntas.innerHTML += 
            `<section class="adicionar-perguntas" id="pergunta${i}">
                <strong> Pergunta ${i}</strong>
                <ion-icon name="create-outline" onclick="renderizarAdicaoPergunta(${i})"></ion-icon>
            </section>`
        }
    }
}

function renderizarAdicaoNiveis(num) {
    const blocoCriarNiveis = document.getElementById(`nivel${num}`)
    blocoCriarNiveis.innerHTML = 
    `<ul>
        <li class="subtitulo-criar-quizz"><strong>Nível ${num}</strong></li>
        <li><input type="text" placeholder="Título do nível" required></li>
        <li><input type="text" placeholder="% de acerto mínima" required></li>
        <li><input type="text" placeholder="URL da imagem do nível" required></li>
        <li><textarea placeholder="Descrição do nível" required></textarea></li>
    </ul>`
    if(num === 1) {
        for(let i = 2; i <= numNiveis; i++) {
            blocoCriarNiveis.innerHTML += 
            `<section class="adicionar-niveis" id="nivel${i}">
                <strong> Nível ${i}</strong>
                <ion-icon name="create-outline" onclick="renderizarAdicaoNiveis(${i})"></ion-icon>
            </section>`
        }
    }
}
function enviaQuizz() {
    const novoQuizz = {
        title: titulo,
        image: urlImagem,
        questions: perguntas,
        levels: niveis
    }
    const quizzEnviado = axios.post(URL_QUIZZES, novoQuizz);
    quizzEnviado.then(salvaMeuQuizz);

    quizzEnviado.catch((erro) => {
        console.log(erro.status);
        alert("Erro! Quizz não foi criado!");
        window.location.reload();
    });
}


function salvaMeuQuizz(quizzSalvo) {
    const identificador = quizzSalvo.data.id;
    if(localStorage.getItem("quizzes") === "[-1]") {
        const quizzSerializado = JSON.stringify(identificador);
        localStorage.setItem("quizzes", `[${quizzSerializado}]`);
    } else {
        let quizzesSerializados = localStorage.getItem("quizzes");
        const meusQuizzes = JSON.parse(quizzesSerializados);
        meusQuizzes.push(identificador);
        quizzesSerializados = JSON.stringify(meusQuizzes);
        localStorage.setItem("quizzes", quizzesSerializados);
    }
}

function abrirQuizzCriado(item) {
    const meusQuizzesSalvos = JSON.parse(localStorage.getItem("quizzes"));
    telaCriarFinal.classList.add("escondido");
    let valor = meusQuizzesSalvos.length - 1;
    abrirQuizz(meusQuizzesSalvos[valor]);
}