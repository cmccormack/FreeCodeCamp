var sessionTime = 25,
    breakTime = 5;

$('document').ready(function(){
  console.log("Document loaded!")

  $('input[type="range"]').on("input change", function(e){
    $target = $(e.target);
    changeSlider($(e.target)) 
  });

});

function changeSlider($target){
  $time = findClosest($target, ".range-group", ".slider-label-time");
  $time.text($target.val() + " min");
  console.log($time.text());

}

function findClosest($t, parentSel, targetSel){
  return $t.closest(parentSel).find(targetSel);
}