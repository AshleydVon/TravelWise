const cityEl = document.querySelector('#weather');
let city= document.getElementById('city');
let cityWeather=fetch(`api.openweathermap.org/data/2.5/forecast?q=${city}&appid={25382a741e6bced20fc1f59a53126a82}`);

function displayCity(){
    console.log(city);
    return city;
}

function promptUser(){
    if (city != ""){
        window.prompt("Please enter a city");
    } else if (city !=cityWeather) {
        window.prompt("Weather for this city is not available, please select a different city.")
    }
}

localStorage.setItem('city', document.getElementById('city').value);
