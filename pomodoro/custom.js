var timers = {
      sessionTime: 25,
      breakTime: 5,
    },
    intervalID = 0,
    $clockDisplay,
    $phase;

$('document').ready(function(){
  console.log("Document loaded!")

  $clockDisplay = $("#display-time");
  $phase = $("clock-phase");

  // $('button, input').click(function(){ console.log(JSON.stringify(timers)); });
  $('button').click(function(){ $(this).blur(); });
  $('input[type="range"]').on("input change", function(e){ sliderChange($(this)); });
  $('.stepper').click(function(e){ addSubClick( $(this) ); });
  $('#start-btn').click(function(e){ startCountdown(timers.sessionTime, timers.breakTime); });
  $('#stop-btn').click(function(e){ stopCountdown(); });

  
});

function startCountdown(sessionTime, breakTime) {

  // Stop the previous countdown first
  stopCountdown();
  var startTime = new Date(),
      countDownTime = startTime.setUTCMinutes(startTime.getUTCMinutes() + sessionTime)

  console.log("sessionTime: " + sessionTime, "breakTime: " + breakTime, 
    "startTime: " + startTime, "countDownTime: " + countDownTime);

  intervalID = setInterval( function() {
    
    var currentTime = new Date().getTime();
    var delta = countDownTime - currentTime;
    var minutes = Math.floor((delta % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.ceil((delta % (1000 * 60)) / 1000);
    if (seconds < 10) { seconds = "0" + seconds }
    $("#mins").text(minutes);
    $("#secs").text(seconds);
    if (seconds % 2 == 0){
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
  if (intervalID) { 
    clearInterval(intervalID);
    console.log("Timer " + intervalID + " stopped"); 
  }
  console.log(timers[sessionTime]);
  displayValue($("#mins"), timers[sessionTime]);
  displayValue($("#secs"), "00")
}

function displayValue( $t, val ){
  // console.log($t.attr('id'), val);
  $t.text(val);
}


function sliderChange( $s ){
  var sliderTime = $s.val(),
      $label = $( $s.attr("data-display") ),
      labelID = $label.attr("id");

  timers[labelID] = Number(sliderTime);
  displayValue($label, timers[labelID]);
}


function addSubClick( $t ){
  var $s = $($t.attr("data-target")),
      $label = $( $s.attr("data-display") ),
      labelID = $label.attr("id");
      inc = $t.attr("data-increment");

      // Update slider value after 
      $s.val(Number($s.val()) + Number(inc));
      timers[labelID] = Number($s.val());

  // Display new value
  displayValue($label, timers[labelID]);
}