var twitch = {
    url: "https://wind-bow.gomix.me/twitch-api/",
    type: { channel: "channels/", stream: "streams/" }
  },
  
  placeholderimg = "http://mackville.net/twitch/images/placeholder.png",

  channels = ["Swag", "Sodapoppin", "Trumpsc", "ESL_SC2", "freecodecamp",
    "habathcx", "RobotCaleb", "noobs2ninjas", "OgamingSC2",
    "imaqtpie", "brunofin", "comster404", "riotgames", "Tidesoftime", "nl_Kripp",
    "battletaure", "Dota2ruhub"],

  channelObjs = {
    activeUsers: [],
    channels: {}
  },

  deferredArr = [],

  channeldefault = {
    logo: placeholderimg,
    status: "Unknown",
    statusicon: "led-gray",
    game: "Somewhere else...",
    active: "Recent"
  };



$("document").ready(function() {
  $template = $.trim($("#profile-template").html());

  main();

  $("#btn-online").click(function(event){
    event.preventDefault();
    $(".profile.online").show();
    $(".profile.offline").hide();
  });  
  $("#btn-offline").click(function(event){
    event.preventDefault();
    $(".profile.online").hide();
    $(".profile.offline").show();
  });  
  $('#btn-all').click(function(event){
    $(".profile.online").show();
    $(".profile.offline").show();
  });


});

function main(){
  
  // Create an array of deferred objects for use in .when
  var channelDeferredArr = $.map(channels, function(user) {
    var channel = channelObjs.channels[user] = $.extend({}, channeldefault);
    channel.name = channel.display_name = user;

    return getResponse(channel, twitch.type.channel, buildChannel);
  });

  // Only proceed once all deferrals have been resolved
  $.when.apply(this, channelDeferredArr).then(function() {
  }).then(function(){

    var streamDeferredArr = $.map(channelObjs.activeUsers, function(user) {
      channel = channelObjs.channels[user];
      var deferral = getResponse(channel, twitch.type.stream, buildStream);
      return deferral;
    });

    $.when.apply(this, streamDeferredArr).then(function() {
      for (var user in channelObjs.channels) {
        var channel = channelObjs.channels[user];
        buildHTML(channel);
        var container = $("#thumbs-" + channel.status.toLowerCase());
        container.append(channel.html);

      }
      console.log("All Channels loaded successfully!");
      $('.main').css('height', '100%');
    });

  });

}

// Calls Twitch API to retrieve channel information for user
//  Returns: Deferred object
function apiRequest(channel, channelType) {
  var url = twitch.url + channelType + channel.name + "?callback=?";
  return $.getJSON(url);
}

function getResponse(channel, type, buildFunc) {
    var deferred = $.Deferred(),
        request =  apiRequest(channel, type);
    
    request.fail(function(response){
      channel.game = "Unable to reach server...";
    });
    request.done(function(response){
      buildFunc(channel, response);
    });
    request.always(function(){ 
      return deferred.resolve();
    });

    return deferred.promise();
}


function buildChannel(channel, response) {

  // Break out early if user does not exist
  if (response.hasOwnProperty("error")) {
    console.log(JSON.stringify(response));
    return 0;
  }
  // channel.name = response.name;
  channel.display_name = response.display_name;
  channel.game = response.game || "Nothing";
  channel.logo = response.logo;
  channel.status = "Offline";
  channel.status_msg = response.status;
  channel.url = response.url;
  channel.stream = {};
  channel.statusicon = "led-red";

  channelObjs.activeUsers.push(channel.name);

}


function buildStream(channel, response) {

  // Break early if not currently streaming
  if (!response.stream) {
    return;
  }

  channel.active = "Current";
  channel.statusicon = "led-green";
  channel.status = "Online";
  channel.stream.game = response.stream.game;
  channel.stream.logo = response.stream.preview.medium;
}


function buildHTML (channel) {
  var $current = $template,
      id = "user-" + channel.name;

  $current = $current.replace(/{{ID}}/ig, id);
  $current = $current.replace(/{{LOGOBG}}/ig, channel.logo);
  $current = $current.replace(/{{LOGO}}/ig, channel.logo);
  $current = $current.replace(/{{LED}}/ig, channel.statusicon);
  $current = $current.replace(/{{STATUS}}/ig, channel.status);
  $current = $current.replace(/{{USERURL}}/ig, channel.url);
  $current = $current.replace(/{{STATUS_MSG}}/ig, channel.status_msg);
  $current = $current.replace(/{{USERNAME}}/ig, channel.display_name);
  $current = $current.replace(/{{ACTIVE}}/ig, channel.active);
  $current = $current.replace(/{{GAME}}/ig, channel.game);

  $current = channel.html = $($.parseHTML($.trim($current)));
  
  // Streaming
  if (!$.isEmptyObject(channel.stream)) {
    $current.toggleClass("online offline");
    $current.find(".thumbnail").addClass("shadow");
    $current.find(".logo").attr("src", channel.stream.logo);
  } else {
    $current.find(".logo").toggle();
  }
}




