$('document').ready(function(){
  console.log("Document loaded!")

  $('input[type="range"]').on("input change", function(e){
    $target = $(e.target);
    console.log("Range " + $target.attr("id") + ": " + $target.val());
    changeSlider($(e.target)) 
  });

});

function changeSlider($target){

}