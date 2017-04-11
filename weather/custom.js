var locApiUrl = "http://ipinfo.io/json";
var owmURL = "http://api.openweathermap.org/data/2.5/weather?callback=?";

var ak = "a9d11dcfa9a27225404a44952890d6ea";
var unit = "imperial"; // Default: Kelvin.  Celsius:metric, Farhenheit:imperial
var appid = "&APPID=" + ak;
var units = "&units=" + unit;
var weather = "";

var time = {};

var temps = {
  "imperial": "",
  "metric": "",
  "kelvin": ""
};

var conditionsold = {
  "clear sky": ['sunny', 'clear'],
  "few clouds": ['cloudy', 'alt-cloudy'],
  "scattered clouds": ['cloudy', 'alt-cloudy'],
  "broken clouds": ['cloudy', 'alt-cloudy'],
  "shower rain": ['rain', 'alt-rain'],
  "rain": ['rain', 'alt-rain'],
  "thunderstorm": ['thunderstorm', 'alt-thunderstorm'],
  "snow": ['snow', 'alt-snow'],
  "mist": ['sleet', 'alt-sleet']
};

var conditions = {
  "Clear": ['sunny', 'clear'],
  "Clouds": ['cloudy', 'alt-cloudy'],
  "Atmosphere": ['cloudy', 'alt-cloudy'],
  "Drizzle": ['rain', 'alt-rain'],
  "Rain": ['rain', 'alt-rain'],
  "Thunderstorm": ['thunderstorm', 'alt-thunderstorm'],
  "Snow": ['snow', 'alt-snow']
};

function getWeather(url) {
  console.log("Inside getWeather() function");

  console.log("getJSON call with " + url);
  $.getJSON(url, function(json) {
    console.log(json);

    weather = json.weather[0].main;
    weather_desc = json.weather[0].description;
    $('#condition').text(weather_desc);

    // Determine if it is day or night
    time.received = json.dt;
    time.sunrise = json.sys.sunrise;
    time.sunset = json.sys.sunset;
    if (time.received >= time.sunrise &&
      time.received < time.sunset) {
      time.daynight = ['day', 0];
    } else {
      time.daynight = ['night', 1];
    }

    // Build icon class string for displaying weather icon
    console.log("Day or night?: " + time.daynight);
    console.log("Weather: " + weather);
    condition = conditions[weather][time.daynight[1]];
    console.log("Condition: " + condition);
    var icon = "wi wi-" + time.daynight[0] + "-" + condition;
    console.log("icon: " + icon);
    setTemp(unit, json.main.temp, icon);
    convertTemp(json.main.temp);

  });
}

function setTemp(unit, temp, icon) {
  console.log("Inside setTemp() function [unit:" + unit + "][temp:" + temp + "]");
  $('#temp').text(temp);
  $('#weather-icon').addClass(icon);

  $("#units").removeClass();
  if (unit == "imperial") {
    $("#units").addClass("wi wi-fahrenheit");
  } else if (unit == "metric") {
    $('#units').addClass("wi wi-celsius");
  } else {
    $('#units').removeClass();
    $('#temp').append("K");
  }
  console.log("Leaving setTemp() function");
}

function getLatLong() {
  console.log("Inside getLatLong() function");

  $.getJSON(locApiUrl, function(json) {
      console.log("getLatLong JSON request successful");

      var city = json.city;
      var state = json.region;
      var loc = json.loc.split(",");
      var lat = loc[0];
      var lon = loc[1];
      console.log("getLatLong Results: [city:" + city + "][state:" + state +
        "][location: " + lat + ", " + lon + "]");

      // Display city and state in location element
      $('#location').text(city + ", " + state);

      latlon = "&lat=" + lat + "&lon=" + lon;
      var url = owmURL + appid + units + latlon;
      getWeather(url);

    })
    .fail(function() {
      console.log("getLatLong: Location lookup failed.");
    })
    .always(function() {
      console.log("getLatLong: Completed call.");
    });
}

function getLatLongTest() {
  
  function getLatLong(position){
      latlon = "&lat=" + position.coords.latitude + "&lon=" + position.coords.longitude;
      getWeather(owmURL + appid + units + latlon);
  }
  
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(getLatLong);
      
  } else {
      getLatLongHttp();
  }
  
}


$('document').ready(function() {
  $('#temp').html("<i class='fa fa-spinner fa-spin'></i>");
  console.log("Calling getLatLong() function.");
  
  // Toggle conversion button if original unit is imperial
  if (unit == "imperial") {
    $('.btn').toggleClass('btn-primary');
    $('.btn').toggleClass('btn-secondary');
  }
  getLatLong();
  console.log("Returned from getLatLong() function.");



  // Toggle Celsius/Fahrenheight buttons and change units in temp
  $('.btn-toggle').click(function() {
    console.log("Clicked Unit Toggle.");
    $('.btn').toggleClass('btn-primary');
    $('.btn').toggleClass('btn-secondary');

    unit = $('.btn-toggle').find('.btn-primary').attr('id');
    console.log("Toggled Unit: " + unit + " Temp: " + temps[unit]);
    setTemp(unit, temps[unit]);
  });
});





// *** Conversion function 
// Celsius = (Farenheit - 32) * 5/9
// Celsius = Kelvin − 273.15
// Farenheit = (Celsius * 9/5) + 32
// Farenheit = Kelvin ×  9⁄5 − 459.67
// Kelvin = Celsius + 273.15
// Kelvin = (Farenheit + 459.67) × 5/9
function convertTemp(temp) {
  console.log("Inside convertTemp() function [temp:" + temp + "] " + unit);

  function ktof() {
    return temp * 9 / 5 - 459.67;
  }

  function ktoc() {
    return temp - 273.15;
  }

  function ftoc() {
    return (temp - 32) * 5 / 9;
  }

  function ftok() {
    return (temp + 459.67) * 5 / 9;
  }

  function ctof() {
    return (temp * 9 / 5) + 32;
  }

  function ctok() {
    return temp + 273.15;
  }

  if (unit == "imperial") {
    temps.imperial = temp;
    temps.metric = ftoc().toFixed(2);
    temps.kelvin = ftok().toFixed(2);
  }

  if (unit == "metric") {
    temps.metric = temp;
    temps.imperial = ctof().toFixed(2);
    temps.kelvin = ctok().toFixed(2);
  }
  if (unit == "kelvin" || unit === "") {
    temps.kelvin = temp;
    temps.imperial = ktof().toFixed(2);
    temps.metric = ktoc().toFixed(2);
  }
  console.log("Leaving convertTemp()");
}