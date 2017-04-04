Array.prototype.clone = function() {
  return this.slice(0);
};

var board,
    player,
    currentPlayer,
    opponent,
    opponentType;

$('document').ready(function(){

  // Initialize variables
  

  resetGame();
  
  // Bind functions to events
  $('button').click(function(){ $(this).blur(); });
  $('.board-cell').click(function(){ cellClicked($(this)); });
  $('#playerSelect input').on('change', function(){ switchPlayer(); });
  $('#opponentSelect input').on('change', function(){ opponentType = this.getAttribute("name"); });
  $('#reset').click(function(){ resetGame(); });
});


function lockRadios(){
  // Lock board once first move has been made
  $(".radio", "#buttons").addClass("disabled");
  $("input", "#buttons").prop("disabled", true);
}


function cellClicked($cell){
  var pos = $cell.attr("id").split("_").map(Number),
      x = pos[0], y = pos[1];

  lockRadios();

  // Make move if cell is available
  if (!board[x][y]){ 
    board[x][y] = currentPlayer;
    displayMove(currentPlayer, x, y);
  }

  // Check for a winner
  var winner = checkForWin();
  if (winner.score){
    if (winner.score === 10){ 
      console.log(player + " is the winner!"); 
    }
    else if (winner.score === -10) { 
      console.log(opponent + " is the winner!");
    }
  } else {
    switchPlayer();
  }
  console.log(player, x,y, JSON.stringify(board), "movesLeft: " + movesLeft());
}


function switchPlayer(){
  console.log("switchPlayer currentPlayer: " + currentPlayer, "player: " + player, "opponent: " + opponent);
  if (opponentType == "human"){
    if (currentPlayer == player){
      currentPlayer = opponent;
    } else {
      currentPlayer = player;
    }
  }
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
  console.log("reset: " + JSON.stringify(board));
  $(".cell-i").removeClass("fa-times");
  $(".cell-i").removeClass("fa-circle-o");
  $("label", "#buttons").removeClass("disabled");
  $("input", "#buttons").prop("disabled", false);

  player = $("#playerSelect label.active input").attr('name');
  if (player == "O") { opponent = "X"; } else { opponent = "O"; }
  currentPlayer = player;
  opponentType = $("#opponentSelect label.active input").attr('name');
}


function checkForWin(){
  var result = {pos: [], score: 0};

  function threeInARow(pos) {
    var r = {pos:pos, score:0};

    if (pos[0] == pos[1] && pos[1] == pos[2]){
      if (pos[0] == player){
        r.score = 10;
      } else if (pos[0] == opponent){
        r.score = -10;
      }
    }
    return r;
  }

  // Check rows
  for (var i = 0; i < 3; i++){
    row = threeInARow([ board[i][0], board[i][1], board[i][2] ]);
    if (row.score){ return row; }
    col = threeInARow([ board[0][i], board[1][i], board[2][i] ]);
    if (col.score){ return col; }
  }

  // Check diagonals
  result = threeInARow([ board[0][0], board[1][1], board[2][2] ]);
  if (result.score){ return result; }

  result = threeInARow([ board[0][2], board[1][1], board[2][0] ]);
  if (result.score){ return result; }

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

function minimax(depth, isMax){
  var score = checkForWin();

  // Return score if player or opponent has won the game
  if (score === 10 || score === -10){
    return score;
  }



}