var isStrict = false,
    isPlaying = false,
    intervalID,
    moveIntervalID,
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
  $('.cell-btn').click( (e) => cellClicked( $(e.currentTarget).attr('id')) );
  $('#play').click( () => startStop() );
  $('#strict').click( () => setStrictMode() );

});



var cellClicked = cellid => {

  playSound(cellid);
  if (isPlayerTurn){
    clearInterval(intervalID);
    if ("#" + cellid === moves[playerCnt]){
      console.log("cellid: #" + cellid, "matches moves[playerCnt]: " + moves[playerCnt]);
    } else {
      iterateMoves();
    }
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

};


var playerTurn = () => {

  $('#display').removeClass('disabled');

  // Reset player turn if timeout
  intervalID = setTimeout( () => {
    isPlayerTurn = false;
    iterateMoves();
    playerCnt = 0;
  }, timeoutSpeed);

};


var iterateMoves = () => {

  // Disable user input until moves have been displayed
  $('#display').addClass('disabled');

  var i = 0;
  moveIntervalID = setInterval( () => {
    console.log(i, moves.length, i===moves.length);
    if (i === moves.length) {
      console.log("i===counter.length, clearing display and clearing interval");
      resetDisplay();
      clearInterval(intervalID);
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
var playSound = id => $('#' + id + '-audio').get(0).play();
var displayCounter = () => $("#counter").val(playerCnt + 1);
var resetDisplay = () => { $('.cell-btn', '#display').removeAttr('style'); };


var resetBoard = () => {
  $('#display').removeClass('disabled');
  clearInterval(intervalID);
  clearInterval(moveIntervalID);
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



