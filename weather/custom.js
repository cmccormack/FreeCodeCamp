
var unit = "us"; // Celsius:si, Farhenheit:us
var weather = "";

var dsapi = {
  url: "https://api.darksky.net/forecast/",
  k: "ffb654af71fb3be46e3fd5e502b54751/",
  params: { 
    "exclude": "minutely,hourly,alerts",
    "units": "us"  // si for celsius
  }
};

var locapi = {
  url: "https://freegeoip.net/json/?callback=?",
  lat: "",
  lon: "",
  city: "", 
  state: "",
  country: "",
  countrycode: "",
};

var time = {};

var temps = {
  "us": "",
  "si": ""
};


var conditions = {
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


function getWeather() {

  var url = dsapi.url + dsapi.k + locapi.lat + "," + locapi.lon + "?callback=?";
  $.getJSON(url, dsapi.params, function(json) {

    weather = json.currently.icon;
    weather_desc = json.currently.summary;
    dsapi.params.units = json.flags.units;
    console.log(json.flags.units);
    $('#condition').text(weather_desc);


    // Build icon class string for displaying weather icon
    setTemp(unit, json.currently.temperature, "wi wi-" + conditions[weather]);
    convertTemp(json.currently.temperature);

  });
}


function setTemp(unit, temp, icon) {

  $('#temp').text(temp);
  $('#weather-icon').addClass(icon);

  $("#units").removeClass();
  if (unit == "us") {
    $("#units").addClass("wi wi-fahrenheit");
  } else if (unit == "si") {
    $('#units').addClass("wi wi-celsius");
  } 
}


function getLatLong(){
  
  $.getJSON(locapi.url, function(data) {
    locapi.lat = data.latitude;
    locapi.lon = data.longitude;
    locapi.city = data.city;
    locapi.state = data.region_name;
    locapi.country = data.country_name;
    locapi.countrycode = data.country_code;

    $('#location').text(locapi.city + ", " + locapi.state);

    getWeather();
  });
  
}


$('document').ready(function() {

  $('#temp').html("<i class='fa fa-spinner fa-spin'></i>");
  
  // Toggle conversion button if original unit is imperial
  if (unit == "us") {
    $('.btn', '#unit-selector').toggleClass('btn-primary btn-secondary');
  }
  getLatLong();
  console.log("Returned from getLatLong() function.");

  // Bind functions to events
  $('.btn-toggle').click(convertUnit);

});


var convertUnit = () => {
  $('.btn').toggleClass('btn-primary');
  $('.btn').toggleClass('btn-secondary');

  unit = $('.btn-toggle').find('.btn-primary').attr('id');
  setTemp(unit, temps[unit]);
};





// Conversion functions
// Celsius = (Farenheit - 32) * 5/9
// Celsius = Kelvin − 273.15
// Farenheit = (Celsius * 9/5) + 32
// Farenheit = Kelvin ×  9⁄5 − 459.67
// Kelvin = Celsius + 273.15
// Kelvin = (Farenheit + 459.67) × 5/9
var convertTemp = temp => {

  var ktof = () => temp * 9 / 5 - 459.67;
  var ktoc = () => temp - 273.15;
  var ftoc = () => (temp - 32) * 5 / 9;
  var ftok = () => (temp + 459.67) * 5 / 9;
  var ctof = () => (temp * 9 / 5) + 32;
  var ctok = () => temp + 273.15;

  if (unit == "us") {
    temps.us = temp;
    temps.si = ftoc().toFixed(1);
    return;
  }

  if (unit == "si") {
    temps.si = temp;
    temps.us = ctof().toFixed(1);
    return;
  }


};