
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


// Lock board once first move has been made
function lockRadios(){
  $(".radio", "#buttons").addClass("disabled");
  $("input", "#buttons").prop("disabled", true);
}


// Action performed when a cell on the board is clicked.  pos=[row, col]
function cellClicked(pos){
  var row = pos[0], 
      col = pos[1];

  lockRadios();
  gameStarted = true;

  // Make move if cell clicked is available else do nothing
  if (board[row][col]){
    return;
  } else { 
    board[row][col] = currentPlayer;
    displayMove(currentPlayer, row, col);
  }

  // Check for a winner
  var winner = checkForWin(), i;
  if (winner.score){
    $(".board-cell").prop("disabled", true);

    if (winner.score === -10){ 
      gameOver("Winner!");
      for (i in winner.pos){
        $("#" + winner.pos[i]).addClass("winner");
      }
    }
    else if (winner.score === 10) {
      gameOver("Loser!");
      for (i in winner.pos){
        $("#" + winner.pos[i]).addClass("loser");
      }
    }
    return;
  // End game as draw if no moves left and no winner
  } else {
    if (!movesLeft()){
      gameOver("Draw!");
      return;
    }
  }

  // Switch player if there are still moves available and no winner
  if (movesLeft()){
    switchPlayer();
  }
}


// Displays message and fades out board when game is over
function gameOver(message){
  $("#status").text(message);
  $(".board-cell").prop("disabled", true);
  $("#reset").addClass("disabled");
  $("#status, .cell-i").fadeOut(2000, function(){
    resetGame();
  });
  
}


// Sets player and opponent when user toggles playerSelect radio btn-group
function setPlayer(name){
  currentPlayer = player = name;
  if (player == "X") { opponent = "O"; }
  else { opponent = "X"; }
} 


// Switches currentPlayer when player completes a move
function switchPlayer(){
  if (currentPlayer == player){
    currentPlayer = opponent;
  } else {
    currentPlayer = player;
  }

  // Computer selects move based on minimax algorithm then pseudo clicks cell
  if (gameStarted && currentPlayer == opponent && opponentType == "computer"){
    var best = bestMove();
    cellClicked([best.row, best.col]);
  } 
}


// Displays move on board
function displayMove(currPlayer, x, y){
  var $cellIcon = $("#" + x + "_" + y + " i"); 
  if (currPlayer == "X"){
    $cellIcon.addClass("fa-times");
  } else {
    $cellIcon.addClass("fa-circle-o");
  }
}


// Resets game board to initial state
function resetGame() {

  // Set initial values for player and oppenent selections and empties board
  board = [ ["","",""], ["","",""], ["","",""] ];
  currentPlayer = player = $("#playerSelect label.active input").attr('name');
  if (player == "O") { opponent = "X"; } else { opponent = "O"; }
  opponentType = $("#opponentSelect label.active input").attr('name');
  gameStarted = false;

  // Set CSS and HTML to inital state
  $(".cell-i").removeClass("fa-times");
  $(".cell-i").removeClass("fa-circle-o");
  $("label", "#buttons").removeClass("disabled");
  $("input", "#buttons").prop("disabled", false);
  $(".board-cell").prop("disabled", false);
  $("#reset").removeClass("disabled");
  $(".board-cell").removeClass("winner loser");
  $("#status").text("");
  $("#status, .cell-i").show();

}


// Checks rows, cols, and diagnols for three of the same
function checkForWin(){
  var result = {pos: [], score: 0};

  // Checks if three values in row,col, or diagonal are same. Returns object
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

  // Check rows and columns
  for (var i = 0; i < 3; i++){
    // Check row
    result = threeInARow([ board[i][0], board[i][1], board[i][2] ]);
    if (result.score){ 
      result.pos = [ i+"_0", i+"_1", i+"_2" ];
      return result; 
    }
    // Check col
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


// Iterates over board and checks for available moves
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


// minimax function from https://goo.gl/Se8kN4 converted to JS
function minimax(depth, isMaximizingPlayer){
  var score = checkForWin().score,
      best, row, col;

  // Return score if player or opponent has won the game
  if (score == 10) {
    return score - depth;
  }
  if (score == -10){
    return score + depth;
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


// bestMove function from https://goo.gl/Se8kN4 converted to JS
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

  return move;
}