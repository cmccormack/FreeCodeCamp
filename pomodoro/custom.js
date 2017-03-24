var timers = {
      sessionTime: 25,
      breakTime: 5,
      stopped: true
    },
    intervalID = 0,
    $clockDisplay,
    $phase;
    MIN = 60 * 1000,
    SEC = 1000;

$('document').ready(function(){
  console.log("Document loaded!");

  $clockDisplay = $("#display-time");
  $phase = $("clock-phase");

  $('button').click(function(){ $(this).blur(); });
  $('input[type="range"]').on("input change", function(e){ sliderChange($(this)); });
  $('.stepper').click(function(e){ addSubClick( $(this) ); });
  $('#start-btn').click(function(e){ startCountdown(timers.sessionTime, timers.breakTime); });
  $('#stop-btn').click(function(e){ stopCountdown(); });
  $('button, input').click(function(){ console.log(JSON.stringify(timers)); });

});


function startCountdown( sessionTime, breakTime ) {

  var time = sessionTime,
      secs = sessionTime * SEC,
      mins = sessionTime * MIN;

  // Stop the previous countdown then set display to latest sessionTime value
  clearInterval(intervalID);
  setCountDown();

  timers.stopped = false;

  intervalID = setInterval( function() {

    // Convert minutes to milliseconds
    var delta = countDownTime - new Date().getTime();
    var minutes = Math.floor((delta % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.ceil((delta % (1000 * 60)) / 1000);
    if (seconds < 10) { seconds = "0" + seconds; }
    setCountDown(String(minutes), String(seconds));

    if (delta < 0) {
      // what to do here??
    }

    if (seconds % 2 === 0){
      $("#sep").fadeTo("fast", 0.1);
      $("#sep").fadeTo("fast", 1);
    } else {
      $("#sep").fadeTo("fast", 0.1);
      $("#sep").fadeTo("fast", 1);
    }
  }, 1000);

  console.log("Timer " + intervalID + " started");
}

function stopCountdown() {
  timers.stopped = true;
  if (intervalID) { 
    clearInterval(intervalID);
    console.log("Timer " + intervalID + " stopped"); 
  }
  console.log(timers.sessionTime);
  setCountDown();
}

function displayValue( $t, val ){
  $t.text(val);
}


function setCountDown( mins, secs ){
  displayValue($("#mins"), mins || timers.sessionTime);
  displayValue($("#secs"), secs || "00");
}


function sliderChange( $s ){
  var sval = $s.val(),
      $label = $( $s.attr("data-display") ),
      labelID = $label.attr("id");

  timers[labelID] = Number(sval);
  if (timers.stopped){ setCountDown(); }
  displayValue($label, timers[labelID]);
}


function addSubClick( $t ){
  var $s = $($t.attr("data-target"));
  $s.val(Number($s.val()) + Number($t.attr("data-increment")));
  sliderChange($s);
}