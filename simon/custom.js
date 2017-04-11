// Global Variables
var isStrict = false,
    isPlaying = false,
    isPlayerTurn = false,
    audio = true,
    playerIntervalId,
    moveIntervalId,
    moves = [],
    playerCnt = 0,
    maxturns = 3,
    timeoutSpeed = 5 * 1000,
    moveSpeed = 0.75 * 1000,
    btnArray = ['#red-btn', '#green-btn', '#blue-btn', '#yellow-btn'];


$('document').ready(function(){


  resetBoard();

  // Bind functions to events after document has loaded
  $('#volume-btn').click(function(){ toggleAudio(); });
  $('.cell-btn').click( (e) => cellClicked( "#" + $(e.currentTarget).attr('id')) );
  $('#play').click( () => togglePlay() );
  $('#strict').click( () => toggleStrictMode() );
});


var togglePlay = () => {
  // $('#play i').toggleClass('fa-play fa-stop');

  // Stop game if currently playing
  if (isPlaying){
    stopGame();
  } else {
    startGame();
  }
};


var startGame = () => {
  isPlaying = true;
  $("#strict").addClass("disabled");
  displayStatus("");
  $('#play').attr('title', 'Quit!');
  $('#play i').addClass('fa-stop');
  $('#play i').removeClass('fa-play');

  computerTurn();

};


var stopGame = () => {
  $('#play').attr('title', 'Play!');
  $('#play i').addClass('fa-play');
  $('#play i').removeClass('fa-stop');
  
  resetBoard();
  console.log('Game stopped, resetting board, isPlaying: ' + isPlaying);
};


var computerTurn = () => {

  moves.push(getRandColor());
  iterateMoves();
};


var iterateMoves = () => {

  lockBoard();
  displayCounter(moves.length);

  playerCnt = 0;
  isPlayerTurn = false;

  var i = 0;
  moveIntervalId = setInterval( () => {
    if (i === moves.length) {
      resetDisplay();
      clearInterval(moveIntervalId);
      isPlayerTurn = true;
      playerTurn();
    } else {
      displayMove(moves[i], true);
    }
    i++;
  }, moveSpeed);
};


var displayMove = (move, sound) => {
  
  resetDisplay();

  setTimeout( () => {
    if (sound) { playSound(move + '-audio'); }
    color = $(move);
    color.css('opacity', '1');
  }, 100);
};


var playerTurn = () => {

  unlockBoard();

  // Reset player turn if timeout
  playerIntervalId = setTimeout( () => {
    playSound("#buzzer-audio");
    displayCounter("!!");
    setTimeout( () => iterateMoves(), 1500);
  }, timeoutSpeed);
};


var cellClicked = cellid => {

  clearInterval(playerIntervalId);

  if (!isPlaying) {
    playSound(cellid + "-audio");
    displayMove(cellid);
    return;
  }

  // Check if wrong cell clicked by player during game
  if (cellid !== moves[playerCnt]){
    playSound('#buzzer-audio');
    if (isStrict){
      togglePlay();
      resetBoard();
      setTimeout( () => { togglePlay(); }, 1000);
    } 
    else { setTimeout( () => { iterateMoves(); }, 1000); }
    return;
  }

  playSound(cellid + "-audio");

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

  togglePlay();
  lockBoard();
  displayCounter("=)");
  displayStatus("You Win!");
  playSound('#cheering-audio');
  $("#play").addClass("disabled");
  $("#strict").addClass("disabled");

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





// Utility Functions
var getRandColor = () => btnArray[Math.floor(Math.random() * btnArray.length)];
var playSound = id => { if(audio) { $(id).get(0).play(); }};
var displayCounter = count => $("#counter").val(count<=9?'0'+count:count);
var displayStatus = status => $("#status").text(status);
var resetDisplay = () => { $('.cell-btn', '#display').removeAttr('style'); };
var lockBoard = () => $('#display').addClass('disabled');
var unlockBoard = () => $('#display').removeClass('disabled');

var resetBoard = () => {
  $('#display').removeClass('disabled');
  $('#strict').removeClass('disabled');
  $("#play").removeClass("disabled");
  clearInterval(playerIntervalId);
  clearInterval(moveIntervalId);
  displayCounter("--");
  displayStatus("");
  isPlaying = false;
  isPlayerTurn = false;
  playerCnt = 0;
  moves = [];
  
  resetDisplay();
};

var toggleAudio = () => {
  if (audio) { audio = false; } else { audio = true; }
  $("#volume-btn i").toggleClass("fa-volume-up fa-volume-off");
};


var toggleStrictMode = () => {
  $('#strict-i').toggleClass('fa-chain-broken fa-chain');
  if (isStrict){
    isStrict = false;
    $('#strict').attr('title', 'Enable Strict Mode');
  } else {
    isStrict = true;
    $('#strict').attr('title', 'Disable Strict Mode');
  }
};



