const API_KEY = 'YOUR_API_KEY_HERE'; 

const locationElement = document.getElementById('location');
const descriptionElement = document.getElementById('description');
const temperatureElement = document.getElementById('temperature');
const humidityElement = document.getElementById('humidity');
const windElement = document.getElementById('wind');
const weatherCard = document.getElementById('weatherResult');
const errorElement = document.getElementById('error');

function displayWeather(data) {
  locationElement.textContent = `${data.name}, ${data.sys.country}`;
  descriptionElement.textContent = data.weather[0].description;
  temperatureElement.textContent = Math.round(data.main.temp);
  humidityElement.textContent = data.main.humidity;
  windElement.textContent = data.wind.speed;
  weatherCard.classList.remove('hidden');
  errorElement.textContent = '';
}

function showError(message) {
  weatherCard.classList.add('hidden');
  errorElement.textContent = message;
}

function getWeatherByCity() {
  const city = document.getElementById('cityInput').value;
  if (!city) {
    showError('Please enter a city name.');
    return;
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error('City not found');
      return res.json();
    })
    .then(data => displayWeather(data))
    .catch(err => showError(err.message));
}

function getWeatherByLocation() {
  if (!navigator.geolocation) {
    showError('Geolocation is not supported by your browser.');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;

      fetch(url)
        .then(res => {
          if (!res.ok) throw new Error('Location not found');
          return res.json();
        })
        .then(data => displayWeather(data))
        .catch(err => showError(err.message));
    },
    () => {
      showError('Unable to retrieve your location.');
    }
  );
}
