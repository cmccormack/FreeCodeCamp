var apiurl = "http://quotes.stormconsultancy.co.uk/random.json";
var lqt = '<i class="fa fa-quote-left fa-2x fa-pull-left fa-border" aria-hidden="true"></i>'
var author_name = "";
var quote_text = "";
var twitter_url = "https://twitter.com/intent/tweet?related=freecodecamp&text="

// Request a new random quote using API
function getNewQuote() {
  $.getJSON(apiurl, function(json) {
    author_name = json.author;
    quote_text = json.quote;
    console.log(quote_text);
    
    // Add quote and author to well elements
    $("#quote_msg").empty();
    $("#quote_msg").append(lqt);
    $("#quote_msg").append(quote_text);
    //$("#quote_msg").append(rqt);
    $("#author_name").text(author_name);
    
    // Build tweet message into full twitter URL 
    var tweet = parseTweet(quote_text, author_name);
    $("#btn-tweet").attr("href", twitter_url + fixedEncodeURIComponent(tweet));
  });
}

// Shorten tweet if longer than 140 characters
function parseTweet (quote, author) {
  var sep = " --";
  var ellipse = "...";
  var maxChars = 140;
  var tweetLen = quote.length + sep.length + author.length;
  
  // Shorten tweet if longer than 140 characters
  if (tweetLen > maxChars) {
    quote = quote.substring(0,maxChars - (sep.length + author.length + ellipse.length));
    quote += ellipse;
  }
  
  return quote + sep + author;
}


$(document).ready(function() {
  getNewQuote();
  $("#btn-new-quote").on("click", function() {
    getNewQuote();
  });
});



function fixedEncodeURIComponent (str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
    return '%' + c.charCodeAt(0).toString(16);
  });
}