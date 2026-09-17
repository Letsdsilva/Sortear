
/* ======================================================
   COMISSÕES INTEGRADAS | SIPAT 2026
   SCRIPT.JS
====================================================== */

const namesInput = document.getElementById("namesInput");
const addButton = document.getElementById("addButton");
const clearButton = document.getElementById("clearButton");
const drawButton = document.getElementById("drawButton");
const resetButton = document.getElementById("resetButton");

const message = document.getElementById("message");
const participantList = document.getElementById("participantList");
const participantCount = document.getElementById("participantCount");
const listCount = document.getElementById("listCount");
const winnerCount = document.getElementById("winnerCount");

const winnerBox = document.getElementById("winnerBox");
const winnerName = document.getElementById("winnerName");
const historyList = document.getElementById("historyList");
const historyCount = document.getElementById("historyCount");
const confetti = document.getElementById("confetti");

let participants = [];
let winners = [];
let originalParticipants = [];


/* ======================================================
   MENSAGEM
====================================================== */

function showMessage(text) {
    message.textContent = text;
}


/* ======================================================
   NORMALIZAR NOMES
====================================================== */

function normalizarNome(nome) {
    return nome
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/\s+/g, " ");
}


/* ======================================================
   ATUALIZAR ESTATÍSTICAS
====================================================== */

function updateStats() {
    participantCount.textContent = participants.length;
    listCount.textContent = participants.length;
    winnerCount.textContent = winners.length;
    historyCount.textContent = winners.length;

    drawButton.disabled = participants.length === 0;
}


/* ======================================================
   MOSTRAR PARTICIPANTES
====================================================== */

function renderParticipants() {
    participantList.innerHTML = "";

    if (participants.length === 0) {
        participantList.innerHTML = `
            <div class="empty-list">
                Nenhum participante cadastrado.
            </div>
        `;

        updateStats();
        return;
    }

    participants.forEach((name, index) => {
        const item = document.createElement("div");

        item.className = "participant-item";

        item.innerHTML = `
            <span class="participant-number">
                ${String(index + 1).padStart(2, "0")}
            </span>

            <span>${escapeHtml(name)}</span>
        `;

        participantList.appendChild(item);
    });

    updateStats();
}


/* ======================================================
   MOSTRAR HISTÓRICO
====================================================== */

function renderHistory() {
    historyList.innerHTML = "";

    if (winners.length === 0) {
        historyList.innerHTML = `
            <div class="empty-history">
                Nenhum ganhador ainda.
            </div>
        `;

        updateStats();
        return;
    }

    winners.forEach((name, index) => {
        const item = document.createElement("div");

        item.className = "history-item";

        item.innerHTML = `
            <span class="history-number">
                ${String(index + 1).padStart(2, "0")}
            </span>

            <span class="history-name">
                ${escapeHtml(name)}
            </span>
        `;

        historyList.appendChild(item);
    });

    updateStats();
}


/* ======================================================
   SEGURANÇA HTML
====================================================== */

function escapeHtml(text) {
    return String(text)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* ======================================================
   ADICIONAR PARTICIPANTES
====================================================== */

function addParticipants() {
    const texto = namesInput.value.trim();

    if (texto === "") {
        showMessage("Digite pelo menos um nome para adicionar.");
        return;
    }

    const nomesDigitados = texto
        .split(/\r?\n|,/)
        .map(nome => nome.trim())
        .filter(nome => nome !== "");

    let adicionados = 0;

    nomesDigitados.forEach(nome => {
        const nomeNormalizado = normalizarNome(nome);

        const jaExiste = participants.some(participante => {
            return normalizarNome(participante) === nomeNormalizado;
        });

        if (!jaExiste) {
            participants.push(nome);
            originalParticipants.push(nome);
            adicionados++;
        }
    });

    namesInput.value = "";

    if (adicionados === 0) {
        showMessage("Todos os nomes já estão cadastrados.");
    } else {
        showMessage(
            `${adicionados} participante(s) adicionado(s) com sucesso!`
        );
    }

    renderParticipants();
    renderHistory();

    drawButton.disabled = participants.length === 0;
}


/* ======================================================
   SORTEIO COM EFEITO
====================================================== */

function drawWinner() {
    if (participants.length === 0) {
        showMessage("Não há participantes disponíveis.");
        return;
    }

    drawButton.disabled = true;
    addButton.disabled = true;
    clearButton.disabled = true;
    resetButton.disabled = true;

    const indiceGanhador = Math.floor(
        Math.random() * participants.length
    );

    const ganhador = participants[indiceGanhador];

    let contador = 0;
    let velocidade = 55;

    const totalPassos = 45;

    const label = document.querySelector(".winner-label");

    label.textContent = "🎲 SORTEANDO...";
    winnerName.textContent = "PREPARANDO...";

    winnerBox.classList.remove("winner-animation");

    function passarNomes() {
        if (participants.length === 0) {
            finalizarSorteio();
            return;
        }

        const nomeAtual =
            participants[contador % participants.length];

        winnerName.textContent = nomeAtual;

        contador++;

        if (contador >= totalPassos) {
            finalizarSorteio();
            return;
        }

        if (contador > 35) {
            velocidade += 90;
        } else if (contador > 27) {
            velocidade += 35;
        } else if (contador > 18) {
            velocidade += 12;
        }

        setTimeout(passarNomes, velocidade);
    }

    function finalizarSorteio() {
        const posicao = participants.indexOf(ganhador);

        if (posicao !== -1) {
            participants.splice(posicao, 1);
        }

        winners.push(ganhador);

        winnerName.textContent = ganhador;

        winnerBox.classList.remove("winner-animation");

        void winnerBox.offsetWidth;

        winnerBox.classList.add("winner-animation");

        label.textContent = "🎉 GANHADOR SORTEADO";

        renderParticipants();
        renderHistory();

        launchConfetti();

        showMessage("Sorteio realizado com sucesso!");

        addButton.disabled = false;
        clearButton.disabled = false;
        resetButton.disabled = false;

        drawButton.disabled = participants.length === 0;
    }

    passarNomes();
}


/* ======================================================
   LIMPAR TUDO
====================================================== */

function clearAll() {
    const confirmed = confirm(
        "Deseja realmente limpar todos os participantes e ganhadores?"
    );

    if (!confirmed) {
        return;
    }

    participants = [];
    winners = [];
    originalParticipants = [];

    winnerName.textContent = "—";

    document.querySelector(".winner-label").textContent =
        "AGUARDANDO SORTEIO";

    namesInput.value = "";

    showMessage("Todos os participantes foram removidos.");

    renderParticipants();
    renderHistory();
}


/* ======================================================
   REINICIAR SORTEIOS
====================================================== */

function resetDraws() {
    const confirmed = confirm(
        "Deseja recomeçar os sorteios? Os participantes voltarão para a lista."
    );

    if (!confirmed) {
        return;
    }

    participants = [...originalParticipants];
    winners = [];

    winnerName.textContent = "—";

    document.querySelector(".winner-label").textContent =
        "AGUARDANDO SORTEIO";

    showMessage(
        "Sorteios reiniciados. Todos os participantes estão disponíveis novamente."
    );

    renderParticipants();
    renderHistory();
}


/* ======================================================
   CONFETES
====================================================== */

function launchConfetti() {
    confetti.innerHTML = "";

    const symbols = ["●", "■", "◆", "✦", "★"];

    for (let i = 0; i < 90; i++) {
        const piece = document.createElement("span");

        piece.className = "confetti";

        piece.textContent =
            symbols[Math.floor(Math.random() * symbols.length)];

        piece.style.left = `${Math.random() * 100}%`;

        piece.style.animationDuration =
            `${2 + Math.random() * 3}s`;

        piece.style.animationDelay =
            `${Math.random() * 0.5}s`;

        piece.style.fontSize =
            `${8 + Math.random() * 12}px`;

        piece.style.color = [
            "#00d4a8",
            "#61f3d5",
            "#ffc928",
            "#ff9d22",
            "#3d8bff",
            "#ff5573"
        ][Math.floor(Math.random() * 6)];

        confetti.appendChild(piece);
    }

    setTimeout(() => {
        confetti.innerHTML = "";
    }, 5500);
}


/* ======================================================
   EVENTOS DOS BOTÕES
====================================================== */

addButton.addEventListener("click", addParticipants);

drawButton.addEventListener("click", drawWinner);

clearButton.addEventListener("click", clearAll);

resetButton.addEventListener("click", resetDraws);


/* ======================================================
   CTRL + ENTER PARA ADICIONAR
====================================================== */

namesInput.addEventListener("keydown", event => {
    if (event.ctrlKey && event.key === "Enter") {
        addParticipants();
    }
});


/* ======================================================
   INICIAR SISTEMA
====================================================== */

renderParticipants();

renderHistory();