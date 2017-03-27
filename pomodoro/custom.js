var timers = {
      sessionTime: 25,
      breakTime: 5
    },
    resumeTimer = {
      sessionTime: 25,
      breakTime: 5,
      secs: 25 * 60,
      current: "Session"
    },
    intervalID = 0,
    $title,
    title,
    paused = false,
    stopped = true;

$('document').ready(function(){

  $title = $('html head').find('title');
  title = $title.text();
  $('button').click(function(){ $(this).blur(); });
  $('input[type="range"]').on("input change", function(){ sliderChange($(this)); });
  $('.stepper').click(function(){ addSubClick( $(this) ); });
  $('#start-btn').click(function(){ startCountdown(timers.sessionTime, timers.breakTime); });
  $('#pause-btn').click(function(){ pauseCountdown(); });
  $('#stop-btn').click(function(){ stopCountdown(); });

});


function getMins(secs){
  return Math.floor(secs / 60);
}


function getSecs(secs){
  return Math.ceil(secs % 60);
}

function startCountdown( sessionTime, breakTime, resumeTime) {

  resumeTimer.secs = resumeTime || sessionTime * 60;
  resumeTimer.sessionTime = sessionTime;
  resumeTimer.breakTime = breakTime;

  // Stop the previous countdown then set display to latest sessionTime value
  stopCountdown();
  setCountDown(getMins(resumeTimer.secs), getSecs(resumeTimer.secs));
  stopped = false;
  paused = false;

  intervalID = setInterval( function() {

    resumeTimer.secs -= 1;
    if (resumeTimer.secs < 0){
      if (resumeTimer.current === "Session"){
        resumeTimer.secs = breakTime * 60;
        resumeTimer.current = "Break!";
      } else {
        resumeTimer.secs = sessionTime * 60;
        resumeTimer.current = "Session";
      }
      $("#display").toggleClass('break');
      $("#clock-phase").text(resumeTimer.current);
    }
    // Get minutes and seconds for clock display
    minstr = getMins(resumeTimer.secs);
    secstr = getSecs(resumeTimer.secs);

    setCountDown(String(minstr), String(secstr));

    if (resumeTimer.secs % 2 === 0){
      $("#sep").fadeTo("fast", 0.1);
      $("#sep").fadeTo("fast", 1);
    } else {
      $("#sep").fadeTo("fast", 0.1);
      $("#sep").fadeTo("fast", 1);
    }
  }, 1000);

  console.log("Timer " + intervalID + " started");
}

function pauseCountdown() {
  if (!stopped){
    if (paused){
      startCountdown( resumeTimer.sessionTime, 
                      resumeTimer.breakTime, 
                      resumeTimer.secs );
      paused = false;
    } else {
      clearInterval(intervalID);
      paused = true;
    }
    $("#pause-icon").toggleClass("fa-play fa-pause");
  }
}

function stopCountdown() {
  
  if (intervalID) { clearInterval(intervalID); }
  if (paused){ $("#pause-icon").toggleClass("fa-play fa-pause"); }
  $("#display").removeClass('break');
  $("#clock-phase").text("Session");

  paused = false;
  stopped = true;

  setCountDown();
}

function displayValue( $t, val ){
  $t.text(val);
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

  displayValue($("#mins"), minstr);
  displayValue($("#secs"), secstr);
  $title.text("[" + minstr + ":" + secstr + "] " + title);
}


function sliderChange( $s ){
  var sval = $s.val(),
      $label = $( $s.attr("data-display") ),
      labelID = $label.attr("id");

  timers[labelID] = Number(sval);
  if (stopped){ setCountDown(); }
  displayValue($label, timers[labelID]);
}


function addSubClick( $t ){
  var $s = $($t.attr("data-target"));
  $s.val(Number($s.val()) + Number($t.attr("data-increment")));
  sliderChange($s);
}