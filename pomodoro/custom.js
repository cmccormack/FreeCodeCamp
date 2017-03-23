var timers = {
  sessionTime: 25,
  breakTime: 5
}

$('document').ready(function(){
  console.log("Document loaded!")

  $clockDisplay = $("#display-time");
  $phase = $("clock-phase");

  $('button, input').click(function(){ console.log(JSON.stringify(timers)); }); // For debug purposes
  $('button').click(function(){ $(this).blur(); });
  $('input[type="range"]').on("input change", function(e){ sliderChange($(this)); });
  $('.stepper').click(function(e){ addSubClick( $(this) ); });
  $('#start-btn').click(function(e){ startCountdown(); });

  
});

function startCountdown() {

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