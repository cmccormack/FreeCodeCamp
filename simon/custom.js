var isStrict = false,
    isPlaying = false,
    intervalID,
    counter,
    moves = [],
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

var playSound = id => $('#' + id + '-audio').get(0).play();


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

  moves.push(chooseRandomColor());



  iterateMoves();

  // Switch to player
  playerTurn();
  // Stop if counter reaches 20
  
};


var iterateMoves = () => {

  var i = 0;
  intervalID = setInterval( () => {
    console.log(i, moves.length, i===moves.length);
    if (i === moves.length) {
      console.log("i===counter.length, clearing display and clearing interval");
      resetDisplay();
      clearInterval(intervalID);
    }
    displayMove(moves[i]);

    i++;
  }, 600);

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

  intervalID = setTimeout( () => {


  }, 10000); // 10 Second timeout

};


var chooseRandomColor = () => btnArray[Math.floor(Math.random() * btnArray.length)];

var resetDisplay = () => {
  $('.cell-btn', '#display').removeAttr('style');
};

var resetBoard = () => {

  clearInterval(intervalID);
  isPlaying = false;
  counter = 1;
  $('#play').attr('title', 'Play!');
  resetDisplay();

};

