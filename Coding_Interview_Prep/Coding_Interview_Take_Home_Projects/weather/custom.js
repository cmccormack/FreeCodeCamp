const fccapi = {
  url: "https://fcc-weather-api.glitch.me/api/current",
}

const temps = {
  "us": {temp: "", icon: "wi wi-fahrenheit"},
  "si": {temp: "", icon: "wi wi-celsius"},
  "current_unit": "si",
  "location": "Location Unknown",
}

const conditions = {
  "clear-day": ['day-sunny'],
  "clear-night": ['night-clear'],
  "rain": ['rain'],
  "snow": ['snow'],
  "sleet": ['sleet'],
  "wind": ['wind'],
  "fog": ['fog'],
  "cloudy": ['cloudy'],
  "partly-cloudy-day": ['day-cloudy'],
  "partly-cloudy-night": ['night-alt-cloudy']
}

const unitSelector = document.getElementById('unit-selector')
const unitsIcon = document.getElementById('units')
const tempDisplay = document.getElementById('temp-display')
const locationDisplay = document.getElementById('location')
const weatherIcon = document.getElementById('weather-icon')
const conditionDisplay = document.getElementById('condition')

const fetchJSON = (endpoint, method="GET", body=undefined) => (
  fetch(endpoint, {
    method,
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  })
    .then(res => res.text())
    .then(text => {
      try {
        return JSON.parse(text)
      } catch (e) {
        return text
      }
    })
)

const ctof = temp => (temp * 9 / 5) + 32;
const ftoc = temp => (temp - 32) * 5 / 9;

const getLatLong = () => {
  return new Promise((resolve, reject) => {
    if (!'geolocation' in navigator) {
      reject('Geolocation not available')
    }
    navigator.geolocation.getCurrentPosition(pos => resolve(pos.coords), err => reject(err))
  })
};


const getWeather = (lat, lon) => {
  const url = `${fccapi.url}?lat=${lat}&lon=${lon}`
  return fetchJSON(url)
}


const toggleUnits = () => {
  unitSelector.querySelectorAll('.btn').forEach(btn => {
    btn.classList.toggle('btn-primary')
    btn.classList.toggle('btn-secondary')
  })
  temps.current_unit = temps.current_unit === 'us' ? 'si' : 'us'
  displayTemp();
}


var displayTemp = () => {
  tempDisplay.textContent = temps[temps.current_unit].temp
  locationDisplay.textContent = temps.location
  unitsIcon.className = `${temps[temps.current_unit].icon}`
  unitSelector.classList.remove('hidden')
}


const initialize = async () => {

  try {
    const {latitude: lat, longitude: lon} = await getLatLong()
    unitSelector.addEventListener('click', toggleUnits)
    const weatherResults = await getWeather(lat, lon)
    const { name, weather, main: { temp } } = weatherResults
    const { description, icon } = weather[0]
    temps.si.temp = temp.toFixed(1)
    temps.us.temp = ctof(temp).toFixed(1)
    temps.location = name
    weatherIcon.src = icon
    conditionDisplay.textContent = description
    displayTemp()
  } catch(err) {
    console.log(err)
    tempDisplay.textContent = err.message
  }
}

initialize()