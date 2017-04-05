
var board,
    player,
    currentPlayer,
    opponent,
    opponentType,
    gameStarted;

$('document').ready(function(){

  resetGame();
  
  // Bind functions to events
  $('button').click(function(){ $(this).blur(); });
  $('.board-cell').click(function(){ cellClicked($(this).attr("id").split("_").map(Number)); });
  $('#playerSelect input').on('change', function(){ setPlayer(this.getAttribute("name")); });
  $('#opponentSelect input').on('change', function(){ opponentType = this.getAttribute("name"); });
  $('#reset').click(function(){ resetGame(); });

});


function lockRadios(){
  // Lock board once first move has been made
  $(".radio", "#buttons").addClass("disabled");
  $("input", "#buttons").prop("disabled", true);
}


// Action when a cell on the board is clicked.  pos=[row, col]
function cellClicked(pos){

  var row = pos[0], 
      col = pos[1];

  lockRadios();
  gameStarted = true;

  // Make move if cell is available
  if (!board[row][col]){ 
    board[row][col] = currentPlayer;
    displayMove(currentPlayer, row, col);
    if (movesLeft()){
      switchPlayer();
    }
  }

  // Check for a winner
  var winner = checkForWin(), i;
  if (winner.score){
    $(".board-cell").prop("disabled", true);

    if (winner.score === -10){ 
      console.log(player + " is the winner!!"); 
      for (i in winner.pos){
        $("#" + winner.pos[i]).addClass("winner");
      }
    }
    else if (winner.score === 10) { 
      console.log(opponent + " is the winner!!");
      for (i in winner.pos){
        $("#" + winner.pos[i]).addClass("loser");
      }
    }
    setTimeout(function(){ resetGame(); }, 2000);
  } else {
    if (!movesLeft()){
      console.log("Draw!");
      setTimeout(function(){ resetGame(); }, 2000);
    }
  }

  // console.log(player, row, col, JSON.stringify(board), "movesLeft: " + movesLeft());
}



function setPlayer(name){
  currentPlayer = player = name;
  if (player == "X") { opponent = "O"; }
  else { opponent = "X"; }
} 


function switchPlayer(){

  if (currentPlayer == player){
    currentPlayer = opponent;
  } else {
    currentPlayer = player;
  }

  if (gameStarted){
    if (currentPlayer == opponent && opponentType == "computer"){
      var best = bestMove();
      cellClicked([best.row, best.col]);
    } 
  } 
  console.log("switchPlayer currentPlayer: " + currentPlayer, "player: " + player, "opponent: " + opponent);
}


function displayMove(currPlayer, x, y){
  var $cellIcon = $("#" + x + "_" + y + " i"); 
  if (currPlayer == "X"){
    $cellIcon.addClass("fa-times");
  } else {
    $cellIcon.addClass("fa-circle-o");
  }
}


function resetGame() {
  board = [ ["","",""], ["","",""], ["","",""] ];
  $(".cell-i").removeClass("fa-times");
  $(".cell-i").removeClass("fa-circle-o");
  $("label", "#buttons").removeClass("disabled");
  $("input", "#buttons").prop("disabled", false);
  $(".board-cell").prop("disabled", false);
  $(".board-cell").removeClass("winner loser");

  // Set initial values for player and oppenent selections
  currentPlayer = player = $("#playerSelect label.active input").attr('name');
  if (player == "O") { opponent = "X"; } else { opponent = "O"; }
  opponentType = $("#opponentSelect label.active input").attr('name');
  gameStarted = false;
}


function checkForWin(){
  var result = {pos: [], score: 0};

  function threeInARow(pos) {
    var r = {pos:pos, score:0};

    if (pos[0] == pos[1] && pos[1] == pos[2]){
      if (pos[0] == player){
        r.score = -10;
      } else if (pos[0] == opponent){
        r.score = 10;
      }
    }
    return r;
  }

  // Check rows
  for (var i = 0; i < 3; i++){
    result = threeInARow([ board[i][0], board[i][1], board[i][2] ]);
    if (result.score){ 
      result.pos = [ i+"_0", i+"_1", i+"_2" ];
      return result; 
    }
    result = threeInARow([ board[0][i], board[1][i], board[2][i] ]);
    if (result.score){ 
      result.pos = [ "0_"+i, "1_"+i, "2_"+i ];
      return result; 
    }
  }

  // Check diagonals
  result = threeInARow([ board[0][0], board[1][1], board[2][2] ]);
  if (result.score){ 
    result.pos = [ "0_0", "1_1", "2_2"];
    return result; 
  }

  result = threeInARow([ board[0][2], board[1][1], board[2][0] ]);
  if (result.score){ 
    result.pos = [ "0_2", "1_1", "2_0" ];
    return result; 
  }

  // Return results with score of 0 if no winner
  return result;
}


function movesLeft(){
  for (var row = 0; row < 3; row++){
    for (var col = 0; col < 3; col++){
      if (!board[row][col]){
        return true;
      }
    }
  }
  return false;
}


// minimax function from https://goo.gl/Se8kN4
function minimax(depth, isMaximizingPlayer){
  var score = checkForWin().score,
      best, row, col;

  // console.log("minimax score: " + score, "board: " + board);

  // Return score if player or opponent has won the game
  if (score == 10 || score == -10){
    return score;
  }

  if (!movesLeft()){ return 0; }

  // Computer's turn
  if (isMaximizingPlayer){
    best = -1000;

    // Iterate over board
    for (row = 0; row < 3; row++){
      for (col = 0; col < 3; col++){

        // Make a move at first empty position then recursively choose the best
        if (!board[row][col]) {
          board[row][col] = opponent;
          best = Math.max( best, minimax(depth + 1, false) );

          // Undo move
          board[row][col] = "";
        }
      }
    }
    return best;
  } else {
    best = 1000;

    // Iterate over board
    for (row = 0; row < 3; row++){
      for (col = 0; col < 3; col++){

        // Make a move at first empty position then recursively choose the worst
        if (!board[row][col]){
          board[row][col] = player;
          best = Math.min( best, minimax(depth + 1, true) );
          
          // Undo move
          board[row][col] = "";
        } 
      }
    }
    return best;
  }
}


function bestMove(){
  var bestVal = -1000,
      move = {row: -1, col: -1},
      row, col;

  // Iterate over board
  for (row = 0; row < 3; row++){
    for (col = 0; col < 3; col++){

      // Check if cell is empty
      if (!board[row][col]){
        board[row][col] = opponent;

        // Compute evaluation function for this move
        var moveVal = minimax(0, false);

        // Undo the move
        board[row][col] = "";

        // If value of current move is greater than best value, update best
        if (moveVal > bestVal){
          move.row = row;
          move.col = col;
          bestVal = moveVal;
        }
      }
    }
  }
  console.log("bestMove bestVal: " + bestVal, "row: " + move.row, "col: " + move.col);
  return move;
}