$(document).ready(function() {
    const weatherApiKey = '25382a741e6bced20fc1f59a53126a82';
    const unsplashAccessKey = '0if3GrDUIH6iysaGK3ST5e-E-EBHqEfaRjhEcoPySwE'; // Your Unsplash API key
  
    function getWeather(location) {
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${weatherApiKey}&units=metric`;
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${weatherApiKey}&units=metric`;
  
      fetch(weatherUrl)
        .then(response => response.json())
        .then(data => {
          console.log('Current Weather Data:', data);
          if (data.cod === 200) {
            updateCurrentWeather(data);
          } else {
            console.error('Error:', data.message);
          }
        })
        .catch(error => console.error('Error:', error));
  
      fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
          console.log('Forecast Data:', data);
          if (data.cod === "200") {
            updateForecast(data);
          } else {
            console.error('Error:', data.message);
          }
        })
        .catch(error => console.error('Error:', error));
    }
  
    function updateCurrentWeather(data) {
      $('#weather-info').html(`
        <p>Location: ${data.name}</p>
        <p>Temperature: ${data.main.temp}°C</p>
        <p>Wind: ${data.wind.speed} m/s</p>
        <p>Humidity: ${data.main.humidity}%</p>
      `);
    }
  
    function updateForecast(data) {
      $('#forecast').empty();
      for (let i = 0; i < data.list.length; i += 8) {
        const forecast = data.list[i];
        const card = `
          <div class="col-md-2 card">
            <h5>${new Date(forecast.dt_txt).toLocaleDateString()}</h5>
            <p>Temp: ${forecast.main.temp}°C</p>
            <p>Wind: ${forecast.wind.speed} m/s</p>
            <p>Humidity: ${forecast.main.humidity}%</p>
          </div>
        `;
        $('#forecast').append(card);
      }
    }
  
    function getActivities(location) {
      // Dummy list of activities
      const activities = [
        'Visit the local museum',
        'Go on a city tour',
        'Check out the best restaurants',
        'Take a walk in the park',
        'Attend a cultural event'
      ];
      $('#activities-list').empty();
      activities.forEach(activity => {
        $('#activities-list').append(`<li>${activity}</li>`);
      });
  
      updateBackgroundImage(location);
    }
  
    function updateBackgroundImage(location) {
      const unsplashUrl = `https://api.unsplash.com/search/photos?query=${location}&client_id=${unsplashAccessKey}`;
  
      fetch(unsplashUrl)
        .then(response => response.json())
        .then(data => {
          if (data.results.length > 0) {
            const imageUrl = data.results[0].urls.regular;
            $('#activities').css('background-image', `url(${imageUrl})`);
          } else {
            console.error('No images found for the location.');
          }
        })
        .catch(error => console.error('Error fetching image:', error));
    }
  
    $('#check').click(function() {
      const location = $('#location').val();
      if (location) {
        getWeather(location);
        getActivities(location);
      } else {
        alert('Please enter a location.');
      }
    });
  });
  