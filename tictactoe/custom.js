Array.prototype.clone = function() {
  return this.slice(0);
};

var grid,
    currentPlayer,
    $playerSelect;

$('document').ready(function(){

  // Initialize variables
  $playerSelect = $("#playerSelect label.active input");
  currentPlayer = $playerSelect.attr('name');

  resetGame();
  
  // Bind functions to events
  $('button').click(function(){ $(this).blur(); });
  $('.board-cell').click(function(){ cellClicked($(this)); });
  $('#playerSelect input').on('change', function(){ currentPlayer = this.getAttribute("name"); });
  $('#reset').click(function(){ resetGame(); });
});



function cellClicked($cell){
  var pos = $cell.attr("id").split("_").map(Number),
      x = pos[0], y = pos[1];

  $(".radio", "#buttons").addClass("disabled");
  $("input", "#buttons").prop("disabled", true);

  if (!grid[x][y]){ 
    grid[x][y] = currentPlayer;
    displayMove(currentPlayer, x, y);
  }
  console.log(currentPlayer, x,y, JSON.stringify(grid));
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
  grid = [ ["","",""], ["","",""], ["","",""] ];
  console.log("reset: " + JSON.stringify(grid));
  $(".cell-i").removeClass("fa-times");
  $(".cell-i").removeClass("fa-circle-o");
  $("label", "#buttons").removeClass("disabled");
  $("input", "#buttons").prop("disabled", false);

}