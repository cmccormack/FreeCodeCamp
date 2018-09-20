## Use the Twitch JSON API

**Objective:** Build an app that is functionally similar to [this](https://codepen.io/freeCodeCamp/full/Myvqmo/).

Fulfill the below user stories:
* User Story: I can see whether freeCodeCamp is currently streaming on Twitch.tv.
* User Story: I can click the status output and be sent directly to the freeCodeCamp's Twitch.tv channel.
* User Story: if a Twitch user is currently streaming, I can see additional details about what they are streaming.
* Hint: See an example call to Twitch.tv's JSONP API at http://forum.freecodecamp.org/t/use-the-twitchtv-json-api/19541.
* Hint: The relevant documentation about this API call is here: https://dev.twitch.tv/docs/v5/reference/streams/#get-stream-by-user.
* Hint: Here's an array of the Twitch.tv usernames of people who regularly stream: ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"]
* UPDATE: Due to a change in conditions on API usage explained here Twitch.tv now requires an API key, but we've built a workaround. Use https://wind-bow.glitch.me/twitch-api instead of twitch's API base URL (i.e. https://api.twitch.tv/kraken ) and you'll still be able to get account information, without needing to sign up for an API key.