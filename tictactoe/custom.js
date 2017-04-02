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
  if (winner){
    if (checkForWin() === 10){ 
      console.log(player + " is the winner!"); 
    }
    else if (checkForWin() === -10) { 
      console.log(opponent + "is the winner!");
    }
  } else {
    switchPlayer();
  }
  console.log(player, x,y, JSON.stringify(board));
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

  // Check rows
  for (var row = 0; row < 3; row++){
    if (board[row][0] == board[row][1] && board[row][1] == board[row][2]){
      if (board[row][0] == player){
        return 10;
      } else if (board[row][0] == opponent){
        return -10;
      }
    }
  }

  // Check cols
  for (var col = 0; col < 3; col++){
    if (board[0][col] == board[1][col] && board[1][col] == board[2][col]){
      if (board[0][col] == player){
        return 10;
      } else if (board[0][col] == opponent){
        return -10;
      }
    }
  }

  // Check diagonals
  if (board[0][0] == board[1][1] && board[1][1] == board[2][2]){
    if (board[0][0] == player){
      return 10;
    } else if (board[0][0] == opponent){
      return -10;
    }
  }

  if (board[0][2] == board[1][1] && board[1][1] == board[2][0]){
    if (board[0][2] == player){
      return 10;
    } else if (board[0][2] == opponent){
      return -10;
    }
  }

  // Return 0 if no winner
  return 0;
}