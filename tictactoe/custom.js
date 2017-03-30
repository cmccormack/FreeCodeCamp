Array.prototype.clone = function() {
  return this.slice(0);
};

var board,
    player,
    opponent = "O";

$('document').ready(function(){

  // Initialize variables
  player = $("#playerSelect label.active input").attr('name');
  if (player == "O") { opponent = "X"; }

  resetGame();
  
  // Bind functions to events
  $('button').click(function(){ $(this).blur(); });
  $('.board-cell').click(function(){ cellClicked($(this)); });
  $('#playerSelect input').on('change', function(){ player = this.getAttribute("name"); });
  $('#reset').click(function(){ resetGame(); });
});



function cellClicked($cell){
  var pos = $cell.attr("id").split("_").map(Number),
      x = pos[0], y = pos[1];

  $(".radio", "#buttons").addClass("disabled");
  $("input", "#buttons").prop("disabled", true);

  if (!board[x][y]){ 
    board[x][y] = player;
    displayMove(player, x, y);
  }
  if (checkForWin() === 10){ console.log("Winner!"); };
  console.log(player, x,y, JSON.stringify(board));
}


function displayMove(player, x, y){
  var $cellIcon = $("#" + x + "_" + y + " i"); 
  if (player == "X"){
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