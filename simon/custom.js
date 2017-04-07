var isStrict = false,
    isPlaying = false,
    intervalID,
    counter = 0,
    btnArray = ['#red-btn', '#green-btn', '#yellow-btn', '#blue-btn'];

$('document').ready(function(){

  resetBoard();
  // Bind functions to events after document has loaded
  $('.cell-btn').click( (e) => playSound( $(e.currentTarget).attr('id')) );
  $('#play').click( () => startStop() );
  $('#strict').click( () => setStrictMode() );

});


var setStrictMode = () => {
  $('#strict-i').toggleClass('fa-chain-broken fa-chain');
  if (isStrict){
    isStrict = false;
    $('#strict').attr('title', 'Enable Strict Mode');
  } else {
    isStrict = true;
    $('#strict').attr('title', 'Disable Strict Mode');
  }
  console.log('Strict mode set to ' + isStrict);
};

function playSound(id){
  $('#' + id + '-audio').get(0).play();
}


function startStop() {
  $('#startStop label i').toggleClass('fa-play fa-stop');

  // Stop game if currently playing
  if (isPlaying){
    resetBoard();
    console.log('Game stopped, resetting board, isPlaying: ' + isPlaying);
    return;
  }

  // Moving from Stopped state to Started state
  isPlaying = true;
  $('#play').attr('title', 'Quit!');
  console.log('Game started, isPlaying: ' + isPlaying);



}


function computerTurn(){

  $('#display').attr('disabled', true);
  intervalID = setInterval(function(){
    $('.cell-btn', '#display').css('opacity', '0.7');

    // Use a small delay to better see multiple clicks of same button
    setTimeout( () => {
      color = $(chooseRandomColor());
      color.click();
      color.css('opacity', '1');

    }, 100); // End setTimeout

  }, 1000); // End setInterval

}


function chooseRandomColor(){
  return btnArray[Math.floor(Math.random() * btnArray.length)];
}

function resetBoard(){

  clearInterval(intervalID);
  isPlaying = false;
  $('#play').attr('title', 'Play!');
  $('.cell-btn', '#display').removeAttr('style');

}