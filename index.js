function ElementFactory (type, text = null, className = null, callback = null) {
  const element = document.createElement(type);
  if (type === "button") element.type = "button";
  if (text) element.innerText = text;
  if (className) element.className = className;
  if (callback) element.addEventListener("click", callback);
  return element;
}

const gameboard = (() => {
  let state = new Map();
  const players = {};
  let previousPlayer = null;
  let currentPlayer = null;
  const gameboardContainer = document.querySelector(".gameboard-container");

  const createEmptyBoard = () => {
    for (let counter = 1; counter < 10; counter++) {
      state.set(counter, '');
      const square = ElementFactory("div", null, "gameboard-square", (event) => handleClick(currentPlayer, event));
      square.id = counter;
      gameboardContainer.appendChild(square);
    }
  };
  createEmptyBoard();

  const passInfo = (sign, name) => {
    players[sign] = name;
  }


  const clear = () => {
    state.clear();
    previousPlayer = null;
    const overlay = document.querySelector(".winner-container");
    if (overlay) {
      overlay.remove();
    }
    gameboardContainer.innerHTML = '';
    createEmptyBoard();
  };
  const clearButton = ElementFactory("button", "clear", "clear", clear);
  gameboardContainer.parentNode.insertAdjacentElement('beforeend', clearButton);

  const checkForWinner = () => {
    const winningCombos = [
      [1, 2, 3],
      [1, 4, 7],
      [1, 5, 9],
      [2, 5, 8],
      [4, 5, 6],
      [3, 5, 7],
      [7, 8, 9],
      [3, 6, 9]
    ];
    for (let i = 0; i < winningCombos.length; i++) {
      const [square1, square2, square3] = winningCombos[i];
      if (state.get(square1) && state.get(square1) === state.get(square2) && state.get(square2) === state.get(square3)) {
        return state.get(square1);
      }
    }
  };
  
  const handleClick = (player, event) => {
    if (player !== previousPlayer) {
      const targetNode = event.target;
      const mapValue = state.get(parseInt(targetNode.id));
      if (targetNode.className === "gameboard-square" && mapValue === '') {
        previousPlayer = player;
        targetNode.innerHTML = `<p>${player}</p>`;
        state.set(parseInt(targetNode.id), player);
      }
    }

    const winner = checkForWinner();
    if (winner) {
      const winnerDiv = ElementFactory("div", null, "winner-container");
      const winnerText = ElementFactory("p", `${winner} won!`);
      winnerDiv.appendChild(winnerText);
      // Creates an overlay effect due to grid config
      gameboardContainer.parentNode.insertAdjacentElement('beforeend', winnerDiv);
    } else {
      currentPlayer = player === 'X' ? 'O' : 'X';
    }
  };
  return {
    passInfo,
    log: () => console.log(state),
  }
})();


function Player (sign, name, parentDiv) {
  gameboard.passInfo(sign, name);
  (function editPlayerDiv () {
    const signPara = ElementFactory("p", `"${sign}"`);
    const infoPara = ElementFactory("p", name);
    [signPara, infoPara].forEach(element => parentDiv.appendChild(element));
  })(sign, name, parentDiv);
}

const player1 = Player('X', 'Sally', document.querySelector(".player1-container"));
const player2 = Player('O', 'Lisa', document.querySelector(".player2-container"));
