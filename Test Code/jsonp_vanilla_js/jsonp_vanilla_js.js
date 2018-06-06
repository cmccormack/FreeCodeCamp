var url = "https://wind-bow.gomix.me/twitch-api/channels/${channel}?callback=handleResponse",
    channels = ["Swag", "Sodapoppin", "Trumpsc", "ESL_SC2", "freecodecamp",
    "habathcx", "RobotCaleb", "noobs2ninjas", "OgamingSC2",
    "imaqtpie", "riotgames", "Tidesoftime", "nl_Kripp",
    "battletaure", "Dota2ruhub"]


function createElement(e, props) {
  var element = document.createElement(e);
  for (prop in props) {
    if (typeof props[prop] === "object") {
      Object.assign(element[prop], props[prop]);
    } else {
      element[prop] = props[prop];
    }
  }
  return element;
}

document.body.append(
  createElement("p", {
    textContent: "Working with Vanilla JS and JSONP!",
    style: {
      fontFamily: "Monospace",
      fontSize: "48px"
    }
  })
);

document.body.append(
  createElement("button", {
    type: "button",
    textContent: "Click for Random Twitch User!",
    onclick: handleClickTwitch
  })
);


document.body.append(
  createElement("div", {
    id: "channel-user",
    style: {
      border: "2px solid black",
      display: 'none',
      marginTop: '20px',
      width: '500px',
      minHeight: '300px'
    }
  })
);

function handleClickTwitch() {
  document.getElementById("channel-user").innerHTML = ""
  
  var channel = channels[Math.floor(Math.random() * channels.length)],
      url = `https://wind-bow.gomix.me/twitch-api/channels/${channel}?callback=handleResponse`
  
  getJSONP(url, {
    callback: "handleResponse",
    success: handleSuccess,
    failure: handleTimeout,
    timeout: 5
  });
}


function displayChannel(jsonp){
  var channelDiv = document.getElementById("channel-user"),
      h1 = createElement("h1"),
      h3 = createElement("h3")
  channelDiv.style.display = "block"
  channelDiv.append(h1)
  h1.append(createElement("p", {textContent: 'Name: ' + jsonp.display_name}))
  channelDiv.append(h3)
  h3.append(createElement("p", {textContent: 'Game: ' + jsonp.game}))
  console.log(jsonp);
}



// JSONP Function to bypass CORS issues, using Vanilla JS

function getJSONP(url, options) {
  var callback = options.callback || "callback",
    onSuccess = options.success || function() {},
    onTimeout = options.failure || function() {},
    timeout = options.timeout || 5; // in seconds

  var timeoutTrigger = window.setTimeout(function() {
    window[callback] = function() {};
    onTimeout();
  }, timeout * 1000);

  window[callback] = function(response) {
    window.clearTimeout(timeoutTrigger);
    onSuccess(response);
  };

  var scriptProps = {
    type: "text/javascript",
    async: true,
    src: url
  };

  document.head.appendChild(createElement("script", scriptProps));
}

function handleSuccess(jsonp) {
  console.log("Success!")
  displayChannel(jsonp)
}

function handleTimeout(json) {
  console.log("Timed out");
}

