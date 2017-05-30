var apiurl = "https://mackville.net/quotes/csquotes.json"
var twitter_url = "https://twitter.com/intent/tweet?related=freecodecamp&text="


function displayQuote(author, quote) {

    // Add quote and author to well elements
    $("#quote_msg").html(quote)
    $("#author_name").text(author)
}


function displayTweet (author, quote) {
  var sep = " --",
    ellipse = "...",
    maxChars = 140,
    tweetLen = quote.length + sep.length + author.length
  
  // Shorten tweet if longer than 140 characters
  if (tweetLen > maxChars) {
    quote = quote.substring(0,maxChars - (sep.length + author.length + ellipse.length))
    quote += ellipse
  }
  
  $("#btn-tweet").attr("href", twitter_url + fixedEncodeURIComponent(quote + sep + author))
}


function fixedEncodeURIComponent (str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
    return '%' + c.charCodeAt(0).toString(16)
  })
}


$(document).ready(function() {

  $newQuote = $("#btn-new-quote")

  $newQuote.on("click", function(e) {
    e.preventDefault()

    var response = $.getJSON(apiurl)
    response.fail(function(e){console.log("Failed to reach " + apiurl)})
    response.then( function(data){
      quoteObj = data[Math.floor(Math.random() * data.length)]
      displayQuote(quoteObj.author, quoteObj.quote)
      displayTweet(quoteObj.author, quoteObj.quote)
    })
  })
  // Initial Quote when page loads
  $newQuote.click()
})