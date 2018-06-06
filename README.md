# FreeCodeCamp
FreeCodeCamp Projects


## Build a Tribute Page

**Objective:** Build a CodePen.io app that is functionally similar to [this](https://codepen.io/FreeCodeCamp/full/NNvBQW/).

Fulfill the below user stories:
* User Story: I can view a tribute page with an image and text.
* User Story: I can click on a link that will take me to an external website with further information on the topic.


## Build a Random Quote Machine

**Objective:** Build a CodePen.io app that is functionally similar to [this](https://codepen.io/FreeCodeCamp/full/ONjoLe/).

Fulfill the below user stories:
* User Story: I can click a button to show me a new random quote.
* User Story: I can press a button to tweet out a quote.


## Show the Local Weather

**Objective:** Build a CodePen.io app that is functionally similar to [this](http://codepen.io/FreeCodeCamp/full/bELRjV).

Fulfill the below user stories:
* User Story: I can see the weather in my current location.
* User Story: I can see a different icon or background image (e.g. snowy mountain, hot desert) depending on the weather.
* User Story: I can push a button to toggle between Fahrenheit and Celsius.

It is recommended to use the [Open Weather API](https://openweathermap.org/current#geo). This will require creating a free API key. Normally you want to avoid exposing API keys on CodePen, but it is difficult to find keyless API for weather.


## Build a Wikipedia Viewer 

**Objective:** Build a CodePen.io app that is functionally similar to [this](https://codepen.io/FreeCodeCamp/full/wGqEga/).

Fulfill the below user stories:
* User Story: I can search Wikipedia entries in a search box and see the resulting Wikipedia entries.
* User Story: I can click a button to see a random Wikipedia entry.

Hint #1: Here's a URL you can use to get a random Wikipedia article: `https://en.wikipedia.org/wiki/Special:Random`.

Hint #2: Here's an entry on using Wikipedia's API: `https://www.mediawiki.org/wiki/API:Main_page`.

Hint #3: Use this [link](https://en.wikipedia.org/wiki/Special:ApiSandbox#action=query&titles=Main%20Page&prop=revisions&rvprop=content&format=jsonfm) to experiment with Wikipedia's API.


## Use the Twitchtv JSON API

**Objective:** Build a CodePen.io app that is functionally similar to [this](https://codepen.io/FreeCodeCamp/full/Myvqmo/).

Fulfill the below user stories:
* User Story: I can see whether Free Code Camp is currently streaming on Twitch.tv.
* User Story: I can click the status output and be sent directly to the Free Code Camp's Twitch.tv channel.
* User Story: if a Twitch user is currently streaming, I can see additional details about what they are streaming.
* User Story: I will see a placeholder notification if a streamer has closed their Twitch account (or the account never existed). You can verify this works by adding brunofin and comster404 to your array of Twitch streamers.

Hint: See an example call to Twitch.tv's JSONP API at http://forum.freecodecamp.com/t/use-the-twitchtv-json-api/19541.

Hint: The relevant documentation about this API call is here: https://github.com/justintv/Twitch-API/blob/master/v3_resources/streams.md#get-streamschannel.

Hint: Here's an array of the Twitch.tv usernames of people who regularly stream: ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"]

UPDATE: Due to a change in conditions on API usage explained here Twitch.tv now requires an API key, but FCC has built a workaround. Use https://wind-bow.gomix.me/twitch-api instead of twitch's API base URL (i.e. https://api.twitch.tv/kraken ) and you'll still be able to get account information, without needing to sign up for an API key.  Use callback=? in the URL for JSONP response.


## Build a JavaScript Calculator

**Objective:** Build a CodePen.io app that is functionally similar to [this](https://codepen.io/FreeCodeCamp/full/rLJZrA/). 

Fulfill the below user stories:
* User Story: I can add, subtract, multiply and divide two numbers.
* User Story: I can clear the input field with a clear button.
* User Story: I can keep chaining mathematical operations together until I hit the equal button, and the calculator will tell me the correct output.


## Build a Pomodoro Clock

**Objective:** Build a CodePen.io app that is functionally similar to [this](https://codepen.io/FreeCodeCamp/full/aNyxXR/).

Fulfill the below user stories:
* User Story: I can start a 25 minute pomodoro, and the timer will go off once 25 minutes has elapsed.
* User Story: I can reset the clock for my next pomodoro.
* User Story: I can customize the length of each pomodoro.


## Build a Simon Game

**Objective:** Build a CodePen.io app that is functionally similar to [this](https://codepen.io/FreeCodeCamp/full/obYBjE).

Fulfill the below user stories.
* User Story: I am presented with a random series of button presses.
* User Story: Each time I input a series of button presses correctly, I see the same series of button presses but with an additional step.
* User Story: I hear a sound that corresponds to each button both when the series of button presses plays, and when I personally press a button.
* User Story: If I press the wrong button, I am notified that I have done so, and that series of button presses starts again to remind me of the pattern so I can try again.
* User Story: I can see how many steps are in the current series of button presses.
* User Story: If I want to restart, I can hit a button to do so, and the game will return to a single step.
* User Story: I can play in strict mode where if I get a button press wrong, it notifies me that I have done so, and the game restarts at a new random series of button presses.
* User Story: I can win the game by getting a series of 20 steps correct. I am notified of my victory, then the game starts over.

