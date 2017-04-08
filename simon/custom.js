var isStrict = false,
    isPlaying = false,
    intervalID,
    counter,
    moves = [],
    isPlayerTurn,
    timeoutSpeed = 3 * 1000,
    moveSpeed = 0.6 * 1000,
    btnArray = ['#red-btn', '#green-btn', '#yellow-btn', '#blue-btn'];

$('document').ready(function(){

  resetBoard();
  // Bind functions to events after document has loaded
  $('.cell-btn').click( (e) => cellClicked( $(e.currentTarget).attr('id')) );
  $('#play').click( () => startStop() );
  $('#strict').click( () => setStrictMode() );

});




var cellClicked = cellid => {

  playSound(cellid);
  if (isPlayerTurn){
    clearInterval(intervalID);
    playerTurn();
  }

};

var startStop = () => {
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

  computerTurn();

};


var computerTurn = () => {

  moves.push(getRandColor());

  

  iterateMoves();

  // Switch to player
  // playerTurn();
  // Stop if counter reaches 20
};


var iterateMoves = () => {

  // Disable user input until moves have been displayed
  $('#display').addClass('disabled');

  var i = 0;
  intervalID = setInterval( () => {
    console.log(i, moves.length, i===moves.length);
    if (i === moves.length) {
      console.log("i===counter.length, clearing display and clearing interval");
      resetDisplay();
      clearInterval(intervalID);
      playerTurn();
    }
    displayMove(moves[i]);
    i++;

  }, moveSpeed);

};

var displayMove = move => {
  resetDisplay();
  setTimeout( () => {
    color = $(move);
    color.click();
    color.css('opacity', '1');
  }, 100); // End setTimeout
};

var playerTurn = () => {
  $('#display').removeClass('disabled');
  isPlayerTurn = true;
  intervalID = setTimeout( () => {
    isPlayerTurn = false;
    iterateMoves(); 
  }, timeoutSpeed);

};







var getRandColor = () => btnArray[Math.floor(Math.random() * btnArray.length)];
var playSound = id => $('#' + id + '-audio').get(0).play();

var resetDisplay = () => { $('.cell-btn', '#display').removeAttr('style'); };


var resetBoard = () => {
  $('#display').removeClass('disabled');
  clearInterval(intervalID);
  isPlaying = false;
  isPlayerTurn = false;
  counter = 1;
  $('#play').attr('title', 'Play!');
  resetDisplay();

};


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



