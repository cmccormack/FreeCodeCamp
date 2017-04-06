

$('document').ready(function(){

  // Bind functions to events after document has loaded
  $('.cell-btn').click(function(){ playSound(this.getAttribute("id")); });


});



function playSound(id){
  $("#" + id + "-audio").get(0).play();
}