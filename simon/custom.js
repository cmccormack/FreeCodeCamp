var isStrict = false,
    isPlaying = false,
    playerIntervalId,
    moveIntervalId,
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

  
  clearInterval(playerIntervalId);

  // Check if wrong cell clicked by player
  if (cellid !== moves[playerCnt]){
    playSound('#buzzer-audio');
    if (isStrict){
      startStop();
      resetBoard();
      setTimeout( () => { startStop(); }, 1000);
    } 
    else { setTimeout( () => { iterateMoves(); }, 1000); }
    return;
  }

  playSound(cellid + "-audio");

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
  playSound('#cheering-audio');
  var i = 0,
  winIntervalId = setInterval( () => {
    if (i === 18){
      
      resetBoard();
      clearInterval(winIntervalId);
    } else {
      displayMove(btnArray[i % 4], false);
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
  
  iterateMoves();

};


var playerTurn = () => {

  unlockBoard();

  // Reset player turn if timeout
  playerIntervalId = setTimeout( () => {
    console.log("Player timed out - id: " + playerIntervalId);
    playSound("#buzzer-audio");
    displayCounter("!!");
    setTimeout( () => iterateMoves(), 1500);
  }, timeoutSpeed);

  console.log("Player timer started with id: " + playerIntervalId);

};


var iterateMoves = () => {

  // Disable user input until moves have been displayed
  lockBoard();

  displayCounter(moves.length);

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
      displayMove(moves[i], true);
      
    }
    i++;

  }, moveSpeed);

};


var displayMove = (move, sound) => {
  
  resetDisplay();
  setTimeout( () => {
    color = $(move);

    if (sound) { playSound(move + '-audio'); }
    color.css('opacity', '1');
  }, 100); // End setTimeout
};


var getRandColor = () => btnArray[Math.floor(Math.random() * btnArray.length)];
var playSound = id => { if(audio) { $(id).get(0).play(); }};
var displayCounter = count => $("#counter").val(count<=9?'0'+count:count);
var displayStatus = status => $("#status").text(status);
var resetDisplay = () => { $('.cell-btn', '#display').removeAttr('style'); };
var lockBoard = () => $('#display').addClass('disabled');
var unlockBoard = () => $('#display').removeClass('disabled');


var resetBoard = () => {
  $('#display').removeClass('disabled');
  clearInterval(playerIntervalId);
  clearInterval(moveIntervalId);
  displayCounter("--");
  displayStatus("");
  isPlaying = false;
  isPlayerTurn = false;
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



