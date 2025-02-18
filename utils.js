function navigateTo(viewId) {
    document.querySelectorAll('.view').forEach(view => view.classList.remove('active'));
    document.getElementById(viewId).classList.add('active');
}

function getView() {
  const activeView = document.querySelector('.view.active');
  return activeView ? activeView.id : null;
}

function addMLog(mensagem) {
  const logContainer = document.getElementById("log-messages");
  const messageElement = document.createElement("p");
  messageElement.textContent = mensagem;
  logContainer.appendChild(messageElement);

  logContainer.scrollTop = logContainer.scrollHeight;
}

function restartGame() {
  const tabuleiro = document.getElementById("tabuleiro");
  const redPieces = document.getElementById("red-pieces");
  const bluePieces = document.getElementById("blue-pieces");
  const logMessages = document.getElementById("log-messages");

  tabuleiro.innerHTML = "";
  redPieces.innerHTML = "";
  bluePieces.innerHTML = "";
  logMessages.innerHTML = "";

  addMLog("Game has restarted");
  main();

}

function quitGame() {
  if (confirm("Do you really want to quit?")) {
    const tabuleiro = document.getElementById("tabuleiro");
    const redPieces = document.getElementById("red-pieces");
    const bluePieces = document.getElementById("blue-pieces");
    const logMessages = document.getElementById("log-messages");

    tabuleiro.innerHTML = "";
    redPieces.innerHTML = "";
    bluePieces.innerHTML = "";
    logMessages.innerHTML = "";

    addMLog("Player quit from the game");

    navigateTo("menu-view");
  }
}

//how to play
let currentStepIndex = 0;

function showTutorialStep(index) {
    const steps = document.querySelectorAll('.tutorial-step');
    steps.forEach(step => step.classList.remove('active'));

    if (index >= 0 && index < steps.length) {
        steps[index].classList.add('active');
        currentStepIndex = index;
    }
}

function nextStep() {
    const steps = document.querySelectorAll('.tutorial-step');
    if (currentStepIndex < steps.length - 1) {
        showTutorialStep(currentStepIndex + 1);
    }
}

function previousStep() {
    if (currentStepIndex > 0) {
        showTutorialStep(currentStepIndex - 1);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    showTutorialStep(currentStepIndex);
});


function classifications(datatable) {
    navigateTo('cla-view');
    const claView = document.getElementById('cla-view');
    claView.innerHTML = '';
    const table = document.createElement('table');
    table.id = 'myTable';
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    console.log("Received datatable:", datatable);
    Object.keys(datatable[0]).forEach(key => {
        const th = document.createElement('th');
        th.textContent = key;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);
    const tbody = document.createElement('tbody');
    datatable.forEach(item => {
        const row = document.createElement('tr');
        Object.values(item).forEach(value => {
            const td = document.createElement('td');
            td.textContent = value;
            row.appendChild(td);
        });
        tbody.appendChild(row);
    });
    table.appendChild(tbody);

    claView.appendChild(table);
    console.log("Table created and appended:", table);
}