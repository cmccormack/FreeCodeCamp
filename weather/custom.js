
var unit = "us", // Celsius:si, Farhenheit:us
    dsapi = {
      url: "https://api.darksky.net/forecast/",
      k: "ffb654af71fb3be46e3fd5e502b54751/",
      params: { 
        "exclude": "minutely,hourly,alerts",
        "units": "us"  // si for celsius
      }
    },
    locapi = {
      url: "https://freegeoip.net/json/?callback=?",
      lat: "",
      lon: "",
      city: "", 
      state: "",
      country: "",
      countrycode: "",
    },
    temps = {
      "us": "",
      "si": ""
    },
    conditions = {
      "clear-day": ['day-sunny'],
      "clear-night": ['night-clear'],
      "rain": ['rain'],
      "snow": ['snow'],
      "sleet": ['sleet'],
      "wind": ['wind'],
      "fog": ['fog'],
      "cloudy": ['cloudy'],
      "partly-cloudy-day": ['day-cloudy'],
      "partly-cloudy-night": ['alt-cloudy']
    };


$('document').ready( () => {

  // Display spinning icon until API loads
  $('#temp').html("<i class='fa fa-spinner fa-spin'></i>");
  
  // Call geo API first then weather API once completed
  getLatLong().done(getWeather);

  // Bind functions to events
  $('.btn-toggle').click(toggleUnits);
});


var getWeather = () => {

  var latlon = [locapi.lat,locapi.lon].join(','),
      url = dsapi.url + dsapi.k + latlon + "?callback=?";

  $.getJSON(url, dsapi.params, function(response) {

    weather_icon = response.currently.icon;
    weather_desc = response.currently.summary;
    dsapi.params.units = response.flags.units;
    $('#condition').text(weather_desc);

    displayTemp(unit, response.currently.temperature, conditions[weather_icon]);
    convertTemp(response.currently.temperature);
  });
};


var getLatLong = () => {
  
  var geoApiCall = $.getJSON(locapi.url, function(data) {

    locapi.lat = data.latitude;
    locapi.lon = data.longitude;
    locapi.city = data.city;
    locapi.state = data.region_name;
    locapi.country = data.country_name;
    locapi.countrycode = data.country_code;
    $('#location').text(locapi.city + ", " + locapi.state);
  });

  return geoApiCall;
};


var toggleUnits = () => {
  $('.btn', '#unit-selector').toggleClass('btn-primary btn-secondary');
  unit = $(".btn-primary", "#unit-selector").attr('id');
  displayTemp(unit, temps[unit]);
};


var displayTemp = (unit, temp, icon) => {

  $('#temp').text(temp);
  $('#weather-icon').addClass("wi wi-" + icon);

  $("#units").removeClass();
  if (unit === "us") {
    $("#units").addClass("wi wi-fahrenheit");
  } else if (unit === "si") {
    $('#units').addClass("wi wi-celsius");
  } 
};


var convertTemp = temp => {

  var ftoc = () => (temp - 32) * 5 / 9;
  var ctof = () => (temp * 9 / 5) + 32;

  if (unit == "us") {
    temps.us = temp;
    temps.si = ftoc().toFixed(1);
  }

  if (unit == "si") {
    temps.si = temp;
    temps.us = ctof().toFixed(1);
  }

};