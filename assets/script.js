const countryEl = document.querySelector('#country');
let country= prompt("Enter desired country: ");
let countryWeather=fetch(`api.openweathermap.org/data/2.5/forecast?q=${country}&appid={25382a741e6bced20fc1f59a53126a82}`);

function displayCountry(){
    console.log(country);
    return country;
}

function promptUser(){
    if (country != ""){
        window.prompt("Please enter a country");
    } else if (country !=countryWeather) {
        window.prompt("Weather for this country is not available, please select a different country.")
    }
}

