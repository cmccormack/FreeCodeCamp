var isStrict = true;

$('document').ready(function(){

  // Bind functions to events after document has loaded
  $('.cell-btn').click(function(){ playSound(this.getAttribute('id')); });
  $('#strict').click(function(){ setStrictMode(); });

});


function setStrictMode(){
  $('#strict').toggleClass('strike');
  if (isStrict){
    isStrict = false;
  }
}

function playSound(id){
  $('#' + id + '-audio').get(0).play();
}