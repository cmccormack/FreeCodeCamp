var isStrict = false,
    isPlaying = false,
    playerIntervalId,
    moveIntervalId,
    counter,
    moves = [],
    playerCnt,
    isPlayerTurn,
    timeoutSpeed = 3 * 1000,
    moveSpeed = 0.7 * 1000,
    btnArray = ['#red-btn', '#green-btn', '#yellow-btn', '#blue-btn'];

$('document').ready(function(){

  resetBoard();
  // Bind functions to events after document has loaded
  $('.cell-btn').click( (e) => cellClicked( "#" + $(e.currentTarget).attr('id')) );
  $('#play').click( () => startStop() );
  $('#strict').click( () => setStrictMode() );

});



var cellClicked = cellid => {

  playSound(cellid);

  if (isPlayerTurn){
    clearInterval(playerIntervalId);
    if (cellid === moves[playerCnt]){
      console.log("cellid: " + cellid, "matches moves[playerCnt]: " + moves[playerCnt]);
      playerCnt++;
      playerTurn();
    } else {
      iterateMoves();
    }
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

};


var playerTurn = () => {

  $('#display').removeClass('disabled');

  // Reset player turn if timeout
  playerIntervalId = setTimeout( () => {
    console.log("Player timed out - id: " + playerIntervalId);
    iterateMoves();
  }, timeoutSpeed);

  console.log("Player timer started with id: " + playerIntervalId);

};


var iterateMoves = () => {

  // Disable user input until moves have been displayed
  $('#display').addClass('disabled');

  playerCnt = 0;
  isPlayerTurn = false;

  var i = 0;
  moveIntervalId = setInterval( () => {
    console.log(i, moves.length, i===moves.length);
    if (i === moves.length) {
      resetDisplay();
      clearInterval(moveIntervalId);
      isPlayerTurn = true;
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








var getRandColor = () => btnArray[Math.floor(Math.random() * btnArray.length)];
var playSound = id => $(id + '-audio').get(0).play();
var displayCounter = () => $("#counter").val(playerCnt + 1);
var resetDisplay = () => { $('.cell-btn', '#display').removeAttr('style'); };


var resetBoard = () => {
  $('#display').removeClass('disabled');
  clearInterval(playerIntervalId);
  clearInterval(moveIntervalId);
  isPlaying = false;
  isPlayerTurn = false;
  counter = 1;
  playerCnt = 0;
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



