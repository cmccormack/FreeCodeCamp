// Global Variables
var isStrict = false,
    isPlaying = false,
    isPlayerTurn = false,
    audio = true,
    playerIntervalId,
    moveIntervalId,
    moves = [],
    playerCnt = 0,
    maxturns = 20,
    timeoutSpeed = 5 * 1000,
    moveSpeed = 0.75 * 1000,
    btnArray = ['#red-btn', '#green-btn', '#blue-btn', '#yellow-btn'];


$('document').ready(function(){


  resetBoard();

  // Bind functions to events after document has loaded
  $('#volume-btn').click(function(){ toggleAudio(); })
  $('.cell-btn').click( function(e) {
    cellClicked( "#" + $(e.currentTarget).attr('id')) 
  })
  $('#play').click( function() { togglePlay() } )
  $('#strict').click( function() { toggleStrictMode() })
})


var togglePlay = function() {

  // Stop game if currently playing
  if (isPlaying){
    stopGame();
  } else {
    startGame();
  }
};


var startGame = function() {
  isPlaying = true;
  $("#strict").addClass("disabled");
  displayStatus("");
  $('#play').attr('title', 'Quit!');
  $('#play i').addClass('fa-stop');
  $('#play i').removeClass('fa-play');

  computerTurn();

};


var stopGame = function() {
  $('#play').attr('title', 'Play!');
  $('#play i').addClass('fa-play');
  $('#play i').removeClass('fa-stop');
  
  resetBoard();
};


function computerTurn () {

  moves.push(getRandColor());
  iterateMoves();
};


function iterateMoves() {

  lockBoard();
  displayCounter(moves.length);

  playerCnt = 0;
  isPlayerTurn = false;

  var i = 0;
  moveIntervalId = setInterval( function() {
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


function displayMove(move, sound) {
  
  resetDisplay();

  setTimeout( function() {
    if (sound) { playSound(move + '-audio'); }
    color = $(move);
    color.css('opacity', '1');
  }, 100);
};


function playerTurn() {

  unlockBoard();

  // Reset player turn if timeout
  playerIntervalId = setTimeout( function() {
    playSound("#buzzer-audio");
    displayCounter("!!");
    setTimeout( function() { iterateMoves() }, 1500);
  }, timeoutSpeed);
};


function cellClicked(cellid) {

  clearInterval(playerIntervalId);
  $(cellid).blur();

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
      setTimeout( function() { togglePlay(); }, 1000);
    } 
    else { setTimeout( function() { iterateMoves(); }, 1000); }
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


function playerWin() {

  togglePlay();
  lockBoard();
  displayCounter("=)");
  displayStatus("You Win!");
  playSound('#cheering-audio');
  $("#play").addClass("disabled");
  $("#strict").addClass("disabled");

  var i = 0,
  winIntervalId = setInterval( function() {
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
var getRandColor = function() {
  return btnArray[Math.floor(Math.random() * btnArray.length)];
}

var playSound = function(id) {
  if(audio) {
    $(id).get(0).play()
  }
}

var displayCounter = function(count) {
  $("#counter").val(count<=9?'0'+count:count)
}

var displayStatus = function(status) {
  $("#status").text(status)
}

var resetDisplay = function() {
  $('.cell-btn', '#display').removeAttr('style')
}

var lockBoard = function() {
  $('#display').addClass('disabled')
}

var unlockBoard = function(){
  $('#display').removeClass('disabled')
}

var resetBoard = function() {
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
}

var toggleAudio = function() {
  if (audio) { audio = false; } else { audio = true; }
  $("#volume-btn i").toggleClass("fa-volume-up fa-volume-off");
}

var toggleStrictMode = function() {
  $('#strict-i').toggleClass('fa-chain-broken fa-chain');
  if (isStrict){
    isStrict = false;
    $('#strict').attr('title', 'Enable Strict Mode');
  } else {
    isStrict = true;
    $('#strict').attr('title', 'Disable Strict Mode');
  }
};



