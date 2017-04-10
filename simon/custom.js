var isStrict = false,
    isPlaying = false,
    playerIntervalId,
    moveIntervalId,
    counter = 0,
    audio = true,
    moves = [],
    playerCnt = 0,
    maxturns = 2,
    isPlayerTurn = false,
    timeoutSpeed = 5 * 1000,
    moveSpeed = 0.75 * 1000,
    btnArray = ['#red-btn', '#green-btn', '#blue-btn', '#yellow-btn'];

$('document').ready(function(){

  resetBoard();
  // Bind functions to events after document has loaded
  $('#volume-btn').click(function(){ volumeChange(); });
  $('.cell-btn').click( (e) => cellClicked( "#" + $(e.currentTarget).attr('id')) );
  $('#play').click( () => startStop() );
  $('#strict').click( () => setStrictMode() );

});



var cellClicked = cellid => {

  playSound(cellid);

  if (!isPlayerTurn){ return; }

  clearInterval(playerIntervalId);

  // Check if wrong color clicked
  if (cellid !== moves[playerCnt]){
    iterateMoves();
    return;
  }

  console.log("cellid: " + cellid, "matches moves[playerCnt]: " + moves[playerCnt]);
  playerCnt++;
  if(playerCnt === moves.length){
    clearInterval(playerIntervalId);

    // Check for win
    if(playerCnt === maxturns){
      playerWin();
    } else {
      computerTurn();
    }
  } else {
    playerTurn();
  }
};


var playerWin = () => {
  startStop();
  displayCounter("=)");
  displayStatus("You Win!");
  lockBoard();

  var i = 0,
      t = audio;
  audio = false;
  winIntervalId = setInterval( () => {
    if (i === 18){
      audio = t;
      resetBoard();
      clearInterval(winIntervalId);
    } else {
      displayMove(btnArray[i % 4]);
      i++;
    }
  }, 150);
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
  displayStatus("");
  $('#play').attr('title', 'Quit!');
  console.log('Game started, isPlaying: ' + isPlaying);

  computerTurn();

};


var computerTurn = () => {

  moves.push(getRandColor());
  displayCounter(moves.length);
  iterateMoves();

};


var playerTurn = () => {

  console.log(moves);

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
  lockBoard();

  playerCnt = 0;
  isPlayerTurn = false;

  var i = 0;
  moveIntervalId = setInterval( () => {
    console.log("iterateMoves i: " + i, "moves.length: " + moves.length, "i===moves.length: " + (i === moves.length));
    if (i === moves.length) {
      resetDisplay();
      clearInterval(moveIntervalId);
      isPlayerTurn = true;
      playerTurn();
    } else {
      console.log("iterateMoves calling displayMove(" + moves[i] + ")");
      displayMove(moves[i]);
      
    }
    i++;

  }, moveSpeed);

};


var displayMove = move => {
  // console.log("displayMove move: " + move, moves);
  resetDisplay();
  setTimeout( () => {
    color = $(move);

    playSound(move);
    color.css('opacity', '1');
  }, 100); // End setTimeout
};


var getRandColor = () => btnArray[Math.floor(Math.random() * btnArray.length)];
var playSound = id => { if(audio) { $(id + '-audio').get(0).play(); }};
var displayCounter = count => $("#counter").val(count<=9?'0'+count:count);
var displayStatus = status => $("#status").text(status);
var resetDisplay = () => { $('.cell-btn', '#display').removeAttr('style'); };
var lockBoard = () => $('#display').addClass('disabled');


var resetBoard = () => {
  $('#display').removeClass('disabled');
  clearInterval(playerIntervalId);
  clearInterval(moveIntervalId);
  displayCounter("--");
  displayStatus("");
  isPlaying = false;
  isPlayerTurn = false;
  counter = 0;
  playerCnt = 0;
  moves = [];
  $('#play').attr('title', 'Play!');
  resetDisplay();

};


// Toggles audio
function volumeChange() {
  if (audio) { audio = false; } else { audio = true; }
  $("#volume-btn i").toggleClass("fa-volume-up fa-volume-off");
}


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



