const gameBoard = (function () {
  let board = [[],[],[]];
  let winningCombinations = [
    [[0,0],[0,1],[0,2]], 
    [[1,0],[1,1],[1,2]], 
    [[2,0],[2,1],[2,2]],
    [[0,0],[1,0],[2,0]],
    [[0,1],[1,1],[2,1]],
    [[0,2],[1,2],[2,2]],
    [[0,0],[1,1],[2,2]],
    [[0,2],[1,1],[2,0]]]
  const boardLength = 3;
  const boardHeight = 3;
  function initBoard() {
    for(let i = 0; i < boardLength; i++) {
      for(let j = 0; j < boardHeight; j++) {
        board[i][j] = null;
      }
    }
  }
  function getBoard() {
    return board;
  }

  const setMark = (mark, row, column) => {
    board[row][column] = mark;
  }

  const checkWinningCombination = () => {
    for(i = 0; i < winningCombinations.length; i++) {
      let combo = winningCombinations[i];
      let result = board[combo[0][0]][combo[0][1]] + board[combo[1][0]][combo[1][1]] + board[combo[2][0]][combo[2][1]];
      if(result == 'OOO') {
        return 'O'
      } else if(result == 'XXX') {
        return 'X'
      }
    }
    return false;
  }
  return {
    initBoard,getBoard,setMark,checkWinningCombination
  }
})();

const displayController = (function() {
  const crossElement = `<img class="cross-image" src="${new URL('./assets/images/times.svg ', import.meta.url)}" alt="X">`;
  const circleElement = `<img class="circle-image" src="${new URL('./assets/images/circle.svg ', import.meta.url)}" alt="O">`;
  const renderBoard = () => {
    const gameBoardElement = document.getElementById('game-board');
    const board = gameBoard.getBoard();
    gameBoardElement.innerHTML = `
    <div data-row=0 class="board-row border-b-8 border-black">
      <div data-column=1 class="w-1/3"></div>
      <div data-column=2 class="w-1/3"></div>
      <div data-column=3 class="w-1/3"></div>
    </div>
    <div data-row=1 class="board-row border-b-8 border-black">
      <div data-column=1 class="w-1/3"></div>
      <div data-column=2 class="w-1/3"></div>
      <div data-column=3 class="w-1/3"></div>
    </div>
    <div data-row=2 class="board-row">
      <div data-column=1 class="w-1/3"></div>
      <div data-column=2 class="w-1/3"></div>
      <div data-column=3 class="w-1/3"></div>
    </div>`

    for(let i = 0; i < 3; i++) {
      for(let j = 0; j < 3; j++) {
        if(board[i][j] == 'O') {
          gameBoardElement.children[i].children[j].innerHTML = circleElement;
        } else if(board[i][j] == 'X') {
          gameBoardElement.children[i].children[j].innerHTML = crossElement;
        } else {
          gameBoardElement.children[i].children[j].innerHTML = '';
        }

        gameBoardElement.children[i].children[j].addEventListener('click', () => {
          game.placeMarkerOnBoard(i,j);
        })
      }
    }
  }

  const renderWinner = (winner) => {
    resetWinner();
    const headerElement = document.getElementById('header');
    headerElement.insertAdjacentHTML('afterend', `
    <h1 id="winner" class="text-center font-bold text-6xl uppercase">WINNER : ${winner}</h1>
    `)
  }

  const resetWinner = () => {
    const winnerElement = document.getElementById('winner');
    if (winnerElement != null) {
      winnerElement.remove();
    }
  }
  
  return { renderBoard, renderWinner, resetWinner };
})();

function Player(name) {
  let marker;
  const setMarker = (inputMarker) => {
    if(inputMarker == 'O' || inputMarker == 'X') {
      marker = inputMarker;
    }
  }

  const getMarker = () => {
    return marker;
  }

  return {
    setMarker, getMarker
  }
}

function Game(player1, player2) {
  let currentTurnPlayer = player1;
  let winner;
  const start = () => {
    gameBoard.initBoard();
    displayController.renderBoard();
  }

  const end = () => {
    currentTurnPlayer = player1;
    winner = false;
    setTimeout(() => {
      document.addEventListener('click', function () {
        displayController.resetWinner();
        gameBoard.initBoard();
        displayController.renderBoard();
      }, {once: true});
    }, 2000);
  }
  const placeMarkerOnBoard = (row, column) => {
    gameBoard.setMark(currentTurnPlayer.getMarker(), row, column);
    if(checkWinner())
    {
      displayController.renderWinner(winner);
      end();
    }
    displayController.renderBoard();
    changeTurn();
  }

  const changeTurn = () => {
    if(currentTurnPlayer == player1) {
      currentTurnPlayer = player2
    } else {
      currentTurnPlayer = player1
    }
  }

  const checkWinner = () => {
    winner = gameBoard.checkWinningCombination();
    return winner;
  }

  return { placeMarkerOnBoard,start,end };
}

const player1 = Player();
player1.setMarker('O');
const player2 = Player();
player2.setMarker('X');
let game = Game(player1,player2);
game.start();

