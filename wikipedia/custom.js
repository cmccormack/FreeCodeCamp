var dim = {
  width: 0,
  height: 0,
  view: {
    size: "small",
    small: "#navbar-search-form",
    large: "#main-search-form",
    scroll: false
  },
  minWidth: 768,
  searchBarMarginTop: "100px",
  searchBarMarginMid: "300px"
};

var apiURL = "https://en.wikipedia.org/w/api.php?callback=?";
var pageURL = "https://en.wikipedia.org/wiki/";

var searchParams = {
  action: "query",
  format: "json",
  list: "search",
  srsearch: ""
};

var randomAPIParams = {
  action: "query",
  rnnamespace: 0,
  list: "random",
  rnlimit: 5,
  format: "json"
};

var pageAPIParams = {
  "action": "query",
  "format": "json",
  "prop": "info|extracts",
  "pageids": "",
  "inprop": "url",
  "exintro": 1,
  "explaintext": 1,
  "exlimit": 5,
  "exsectionformat": "plain",
  "exsentences": 3
};



// ====== Run only when the page DOM is ready for JS code execution ===========
$("document").ready(function() {

  // Detach HTML of content-row for later resuse
  $template = $("article").detach();
  $template.css("display", "block");

  // Move search bar down and hide the content container when page loads
  searchBarMid();

  // Set dim.view.size then toggle display as appropriate
  window.onresize = viewPortChange;
  viewPortChange();



  // Bind actions a function
  $(".btn-search").click(searchButtonClick);
  $(".btn-random").click(randomButtonClick);
  $(window).scroll(scrolling);

  // Prevents default submit action then simulates a click on the search button
  $('#form-search').submit(function(event) {
    event.preventDefault();
    searchButtonClick();
  });

  // Toggle display of clear button depending on val() of text field
  $(".text-input").on("input", function() {
    if ($(".text-input").val()) {
      $(".btn-cancel").show();
    } else {
      $(".btn-cancel").hide();
    }
  });

  // Clear text field and hide button
  $(".btn-cancel").click(function() {
    $(".text-input").val("");
    $(".btn-cancel").hide();
    searchBarMid();
    searchParams.srsearch = "";
  });

}); // End Document Ready


// Replace contents of content container with new results
function searchButtonClick() {
  var query = $("#search-input").val();

  // Do nothing if current query is the same as the previous query
  if (searchParams.srsearch == query) {
    return 0; }

  if (!query) {
    console.log("No search input provided.");
    searchBarMid();
    return 0;
  }

  showLoadingAnimation();

  searchParams.srsearch = query;
  console.log("Search Input: " + query);

  // Call Wikipedai API with searchParams
  var wikiSearch = $.getJSON(apiURL, searchParams);
  wikiSearch.fail(function(data) {
    console.log("wikiSearch.fail");
    showApiFailMsg();
  });
  wikiSearch.always(function() {
    searchParams.srsearch = "";
    $(".btn-cancel").show();
  })
  wikiSearch.done(function(data) {
    console.log("wikiSearch.done");
    searchBarTop();
    results = data.query[searchParams.list];
    if (!results.length) {
      createArticle("No results found.", "The page \"" + query +
        "\" does not exist.<br/>There were no results matching the query.",
        pageURL + query);
    } else {
      results.forEach(function(result) {
        createArticle(result.title, result.snippet, pageURL + result.title);
      });
    }
  });
}


function randomButtonClick() {
  showLoadingAnimation();
  $(".text-input").val("");
  var randomWiki = $.getJSON(apiURL, randomAPIParams);
  randomWiki.fail(function(data) {
    console.log("randomWiki.fail");
    showApiFailMsg();
  });
  randomWiki.always(function(data) {
    searchParams.srsearch = "";
  });
  pageids = [];
  randomWiki.done(function(data) {
    console.log("randomWiki.done");
    data.query.random.forEach(function(item) {
      pageids.push(item.id);
    });
    pageAPIParams.pageids = pageids.join("|");
  });
  randomWiki.done(function(data) {
    var pageidsWiki = $.getJSON(apiURL, pageAPIParams);
    pageidsWiki.fail(function(data) {
      console.log("pageidsWiki.fail");
      showApiFailMsg();
    });
    pageidsWiki.always(function(data) {
      $(".btn-cancel").show();
    });
    pageidsWiki.done(function(data) {
      searchBarTop();
      results = data.query.pages;
      $.each(results, function(key, value) {
        createArticle(value.title, value.extract, value.fullurl);
      });
    });
  });
}


// Build content-row html
function createArticle(title, snippet, url) {
  console.log("Creating Article: " + title);
  var $article = $template.clone();
  $article.find("a").attr("href", url);
  $article.find("h3>a").text(sentenceCase(title));
  $article.find(".snippet").html(sentenceCase(snippet));
  $(".container .content").append($article);

  function sentenceCase(sentence) {
    return sentence[0].toUpperCase() + sentence.substring(1);
  }
}

function searchBarTop() {
  $(".container .content").empty();
  $(".container.main").css("margin-top", dim.searchBarMarginTop);
  $(".container .content").show();
}

function searchBarMid() {
  $(".container .content").empty();
  $(".container.main").css("margin-top", dim.searchBarMarginMid);
  $(".container .content").hide();
  $(".btn-cancel").hide();
}

function showApiFailMsg() {
  $(".container .content").empty();
  createArticle("Failed to connect to the Wikipedia API...",
    "Unable to reach the destination URL.  Try your search again at " +
    pageURL + ".", pageURL);
  $(".container .content").show();
  console.log("Failed to reach API");
}

function showLoadingAnimation() {
  $(".container .content").empty()
  $(".container .content").html(
    "<i class=\"fa fa-spinner fa-pulse\"></i>"
  );
  $(".container .content").show();
}

// Modify the placement of the search bar for viewports < 768px
function viewPortChange() {
  dim.width = $(window).width();
  dim.height = $(window).height();

  if (dim.width >= dim.minWidth && dim.view.size == "small") {
    // Small to Large
    dim.view.size = "large";
    if (!dim.view.scroll) {
      searchbarViewSwap(dim.view.small, dim.view.large, rndBtnTxt = "Random");
    }

    console.log("Viewport switched to " + dim.view.size);
  } else if (dim.width < dim.minWidth && dim.view.size == "large") {
    // Large to Small
    dim.view.size = "small";
    if (!dim.view.scroll) {
      searchbarViewSwap(dim.view.large, dim.view.small,
        rndBtnTxt = '<i class="fa fa-random"></i>');
    }
    console.log("Viewport switched to " + dim.view.size);
  }
  // Ensure the search form is always visible somewhere
  $(".search-form").show();
} // End viewPortChange function

function searchbarViewSwap(oldView, newView, rndBtnTxt) {
  $(oldView).children().appendTo($(newView));
  $("#form-search").toggleClass("navbar-form navbar-right form-group shadow");
  $(".btn-random").html(rndBtnTxt);
}

function scrolling() {
  if (!dim.view.scroll && dim.view.size == "large" && $(this).scrollTop() > 150) {
    searchbarViewSwap(dim.view.large, dim.view.small,
      rndBtnTxt = '<i class="fa fa-random"></i>');
    dim.view.scroll = true;
  }
  if (dim.view.scroll && dim.view.size == "large" && $(this).scrollTop() <= 150) {
    searchbarViewSwap(dim.view.small, dim.view.large,
      rndBtnTxt = "Random");
    dim.view.scroll = false;
  }
  // console.log("scrolling... " + $(this).scrollTop());
}
