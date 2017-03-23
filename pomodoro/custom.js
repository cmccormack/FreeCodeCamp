var sessionTime = 25,
    breakTime = 5;

$('document').ready(function(){
  console.log("Document loaded!")

  $('button').click(function(){ $(this).blur(); });
  $('input[type="range"]').on("input change", function(e){ updateLabelTime($(this)); });
  $('.stepper').click(function(e){ addSubClick( $(this) ); console.log(e.target); });
  
});

function updateLabelTime($t){
  $time = findClosest($t, ".range-group", ".slider-label-time");
  $time.text($t.val());
  // console.log($time.text());
}

function addSubClick($t){
  var $s = $($t.attr("data-target")),
      inc = $t.attr("data-increment");

  $s.val(Number($s.val()) + Number(inc));
  updateLabelTime($s);
}

function findClosest($t, parentSel, targetSel){
  return $t.closest(parentSel).find(targetSel);
}