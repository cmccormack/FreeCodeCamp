$('document').ready(function(){
  
  // Bind functions to events after document has loaded
  $('button').click(function(){ $(this).blur(); });
  $('.board-cell').click(function(){ cellClicked($(this)); });

  console.log($(".board-cell"));

});



function cellClicked($cell){
  var x = $cell.attr("data-row"),
      y = $cell.attr("data-col");
}