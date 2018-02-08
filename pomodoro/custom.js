var timers = {
      sessionTime: 25,
      breakTime: 5,
      current: "Session"
    },
    resumeTimer,
    intervalID = 0,
    $title,
    title,
    paused = false,
    stopped = true,
    audio = true,
    interval = 1000;

$('document').ready(function(){

  createPolyfills()
  
  // Grab title to use when updating clock in title area
  $title = $('html head').find('title');
  title = $title.text();
  
  // Bind functions to events after document has loaded
  $('button').click(function(){ $(this).blur(); });
  $('input[type="range"]').on("input change", function(){ sliderChange($(this)); });
  $('.stepper').click(function(){ addSubClick( $(this) ); });
  $('#start-btn').click(function(){ startCountdown(resumeTimer); });
  $('#pause-btn').click(function(){ pauseCountdown(); });
  $('#stop-btn').click(function(){ stopCountdown(); });
  $('#volume-btn').click(function(){ volumeChange(); });

  // For debug purposes
  $('.btn').click(function(e){
    $t = $(e.target);
    console.log($t.attr("id"), JSON.stringify(resumeTimer), "paused: " + paused, "stopped: " + stopped);
  });

});


// Converts seconds to minutes
function getMins(secs){
  return Math.floor(secs / 60);
}


// Converts total seconds to a value used in display
function getSecs(secs){
  return Math.ceil(secs % 60);
}


// Converts minutes to seconds
function toSecs(mins){
  return mins * 60;
}


// Sets up the timer when the start button is clicked
function startCountdown() {

  stopCountdown();

  resumeTimer = Object.assign({}, timers);
  resumeTimer.secs = toSecs(resumeTimer.sessionTime);

  setCountDown(getMins(resumeTimer.secs), getSecs(resumeTimer.secs));
  countdown(resumeTimer);
}


// Countdown timer using interval of 1 second
function countdown( timer ){

  stopped = false;
  paused = false;

  intervalID = setInterval( function() { 
    // Decrement timer by 1 second
    timer.secs -= 1;

    // Switch timers when a timer completes
    if (timer.secs < 0){
      if (timer.current === "Session"){
        timer.secs = toSecs(timer.breakTime);
        timer.current = "Break!";
        alarm = $("#break-alarm").get(0);
      } else {
        timer.secs = toSecs(timer.sessionTime);
        timer.current = "Session";
        alarm = $("#session-alarm").get(0);
      }
      if (audio){ alarm.play(); }
      $("#display").toggleClass('break');
      $("#clock-phase").text(timer.current);
    }

    // Get minutes and seconds string and display
    minstr = getMins(timer.secs);
    secstr = getSecs(timer.secs);
    setCountDown(String(minstr), String(secstr));

    // Animated blinking seperator
    if (timer.secs % 2 === 0){
      $("#sep").fadeTo("fast", 0.1);
      $("#sep").fadeTo("fast", 1);
    } else {
      $("#sep").fadeTo("fast", 0.1);
      $("#sep").fadeTo("fast", 1);
    }
  }, interval);
}


// Pause button pauses current countdown and resumes if already paused
function pauseCountdown() {

  if (stopped) { return 0; } // Break early if no timer
  if (paused){
    countdown(resumeTimer);
  } else {
    clearInterval(intervalID);
    paused = true;
  }
  // Toggle icon on pause button
  $("#pause-icon").toggleClass("fa-play fa-pause");
}


// Clears current timer and resets flags and display
function stopCountdown() {
  
  clearInterval(intervalID);

  paused = false;
  stopped = true;

  resetDisplay();
}


// Displays current countdown on display in human-readable format
function setCountDown( mins, secs ){

  var minstr = String(timers.sessionTime),
      secstr = "00";

  if (mins !== undefined){ 
    minstr = String(mins); 
  }

  if (secs !== undefined){ 
    secstr = String(secs);  
    if (secstr < 10) { secstr = "0" + secstr; }
  }

  $title.text("[" + minstr + ":" + secstr + "] " + title);
  $("#mins").text(minstr);
  $("#secs").text(secstr);
}


// Sets display to default values
function resetDisplay(){
  $("#pause-icon").addClass("fa-pause");
  $("#pause-icon").removeClass("fa-play");
  $("#display").removeClass('break');
  $("#clock-phase").text("Session");
  $("#current-session").text(timers.sessionTime + " Min");
  $("#current-break").text(timers.breakTime + " Min");
  setCountDown();
}


// Updtes timers and display when range slider is used
function sliderChange( $s ){
  var $label = $( $s.attr("data-display") ),
      labelID = $label.attr("id");

  timers[labelID] = Number($s.val());
  if (stopped){ setCountDown(); }
  $label.text(timers[labelID]);
}


// Updates slider when +/- buttons are clicked
function addSubClick( $t ){
  var $s = $($t.attr("data-target"));
  $s.val(Number($s.val()) + Number($t.attr("data-increment")));
  sliderChange($s);
}


// Toggles audio alarms
function volumeChange() {
  if (audio) {
    audio = false;
  } else {
    audio = true;
  }
  $("#volume-btn i").toggleClass("fa-volume-up fa-volume-off");
}


function createPolyfills() {
  if (typeof Object.assign != 'function') {
    // Must be writable: true, enumerable: false, configurable: true
    Object.defineProperty(Object, "assign", {
      value: function assign(target, varArgs) { // .length of function is 2
        'use strict';
        if (target == null) { // TypeError if undefined or null
          throw new TypeError('Cannot convert undefined or null to object');
        }
  
        var to = Object(target);
  
        for (var index = 1; index < arguments.length; index++) {
          var nextSource = arguments[index];
  
          if (nextSource != null) { // Skip over if undefined or null
            for (var nextKey in nextSource) {
              // Avoid bugs when hasOwnProperty is shadowed
              if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                to[nextKey] = nextSource[nextKey];
              }
            }
          }
        }
        return to;
      },
      writable: true,
      configurable: true
    });
  }
}