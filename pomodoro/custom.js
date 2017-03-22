var sessionTime = 25,
    breakTime = 5,
    step = {
      "add": 1,
      "sub": -1
    };

$('document').ready(function(){
  console.log("Document loaded!")

  $('input[type="range"]').on("input change", function(e){
    updateLabelTime($(e.target));
  });

  $('.sub, .add').click(function(e){ addSubClick( $(e.target) ); });




});

function updateLabelTime($t){
  $time = findClosest($t, ".range-group", ".slider-label-time");
  $time.text($t.val() + " min");
  console.log($time.text());
}

function addSubClick($t, direction){
  var $s = $($t.attr("data-target")),
      direction = $t.attr("data-op");

  $s.val(Number($s.val()) + step[direction]);
  updateLabelTime($s);
}

function findClosest($t, parentSel, targetSel){
  return $t.closest(parentSel).find(targetSel);
}