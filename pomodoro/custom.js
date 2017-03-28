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
    audio = true;

$('document').ready(function(){

  $title = $('html head').find('title');
  title = $title.text();
  $('button').click(function(){ $(this).blur(); });
  $('input[type="range"]').on("input change", function(){ sliderChange($(this)); });
  $('.stepper').click(function(){ addSubClick( $(this) ); });
  $('#start-btn').click(function(){ startCountdown(resumeTimer); });
  $('#pause-btn').click(function(){ pauseCountdown(); });
  $('#stop-btn').click(function(){ stopCountdown(); });
  $('#volume-btn').click(function(){ volumeChange(); });

  $('.btn').click(function(e){
    $t = $(e.target);
    console.log($t.attr("id"), JSON.stringify(resumeTimer), "paused: " + paused, "stopped: " + stopped);
  });

});


function getMins(secs){
  return Math.floor(secs / 60);
}


function getSecs(secs){
  return Math.ceil(secs % 60);
}

function toSecs(mins){
  return mins * 60;
}

function startCountdownOld( sessionTime, breakTime, resumeTime ) {

  resumeTimer.secs = resumeTime || toSecs(sessionTime);
  resumeTimer.sessionTime = sessionTime;
  resumeTimer.breakTime = breakTime;

  // Stop the previous countdown then set display to latest sessionTime value
  stopCountdown();
  setCountDown(getMins(resumeTimer.secs), getSecs(resumeTimer.secs));
  stopped = false;
  paused = false;

  intervalID = setInterval( function() { 
    countDown(); 
  }, 1000);

  console.log("Timer " + intervalID + " started");
}


function startCountdown() {

  stopCountdown();

  resumeTimer = Object.assign({}, timers);
  resumeTimer.secs = toSecs(resumeTimer.sessionTime);

  setCountDown(getMins(resumeTimer.secs), getSecs(resumeTimer.secs));
  countdown(resumeTimer);
}


function countdown( timer ){

  stopped = false;
  paused = false;

  intervalID = setInterval( function() { 
    timer.secs -= 1;

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
    // Get minutes and seconds for clock display
    minstr = getMins(timer.secs);
    secstr = getSecs(timer.secs);

    setCountDown(String(minstr), String(secstr));

    if (timer.secs % 2 === 0){
      $("#sep").fadeTo("fast", 0.1);
      $("#sep").fadeTo("fast", 1);
    } else {
      $("#sep").fadeTo("fast", 0.1);
      $("#sep").fadeTo("fast", 1);
    }
  }, 1000);
}


function pauseCountdown() {

  if (stopped) { return 0; }

  if (paused){
    countdown(resumeTimer);
  } else {
    clearInterval(intervalID);
    paused = true;
  }

  $("#pause-icon").toggleClass("fa-play fa-pause");
}


function stopCountdown() {
  
  clearInterval(intervalID);

  paused = false;
  stopped = true;

  resetDisplay();
}


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


function resetDisplay(){
  $("#pause-icon").addClass("fa-pause");
  $("#pause-icon").removeClass("fa-play");
  $("#display").removeClass('break');
  $("#clock-phase").text("Session");
  setCountDown();
}


function sliderChange( $s ){
  var sval = $s.val(),
      $label = $( $s.attr("data-display") ),
      labelID = $label.attr("id");

  timers[labelID] = Number(sval);
  if (stopped){ setCountDown(); }
  $label.text(timers[labelID]);
}


function addSubClick( $t ){
  var $s = $($t.attr("data-target"));
  $s.val(Number($s.val()) + Number($t.attr("data-increment")));
  sliderChange($s);
}


function volumeChange() {
  if (audio) {
    audio = false;
  } else {
    audio = true;
  }
  $("#volume-btn i").toggleClass("fa-volume-up fa-volume-off");
}
