var isStrict = false;

$('document').ready(function(){

  // Bind functions to events after document has loaded
  $('.cell-btn').click( (e) => playSound( $(e.currentTarget).attr('id')) );
  $('#strict').click( () => setStrictMode() );

});


var setStrictMode = () => {
  $('#strict-i').toggleClass('fa-chain-broken fa-chain');
  if (isStrict){
    isStrict = false;
  } else {
    isStrict = true;
  }
  console.log("Strict mode set to " + isStrict);
};

function playSound(id){
  $('#' + id + '-audio').get(0).play();
}

function resetGame(){

}