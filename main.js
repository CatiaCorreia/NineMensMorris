function main() {

    const gameView = document.getElementById('game-view');
    const controlButtons = document.getElementById('control-buttons');
  
    controlButtons.innerHTML = '';

    const restartButton = document.createElement('button');
    restartButton.textContent = 'Restart Game';
    restartButton.onclick = restartGame;
    controlButtons.appendChild(restartButton);
  
    const quitButton = document.createElement('button');
    quitButton.textContent = 'Quit';
    quitButton.onclick = quitGame;
    controlButtons.appendChild(quitButton);
    let game = new Game(document.getElementById('first-player'), 'blue', 'offlinemode');
    navigateTo('game-view');
}