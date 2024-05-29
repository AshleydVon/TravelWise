const searchFormEl=document.querySelector('#city-input-form');
const cityNameInputEl=document.querySelector('#location');

const pointsOfInterestDisplayEl=document.querySelector('#current-card');
const pointsOfInterestContainerEl=document.querySelector('#city-links');
const pointOfInterestOneEl=document.querySelector('#dayone-card');
const pointOfInterestTwoEl=document.querySelector('#daytwo-card');
const pointOfInterestThreeEl=document.querySelector('#daythree-card');
const pointOfInterestFourEl=document.querySelector('#dayfour-card');
const pointOfInterestFiveEl=document.querySelector('#dayfive-card');
const cityLinkEl=document.querySelector('#city-links');
const apiKeyAmadeus='Ec4DHZL6kMcHpTShrIZ2RDmZiTsv2INs';
const apiKeyOpenWeather='0d552094f106990cbff9be54fa9c4761';

let accessToken ="";
let expiresAt = JSON.parse(localStorage.getItem('expires'));

//0d29kRuZRbWHcs6tXwquGbztzMUcMucaL4SB3Dhvop5AhAB6EdfWV0wb (Pexels API Key for Images)
//initiate the client object
const client = {
    clientId:'TjoaeFDE9hRkdigYZ5PvG6xgmnEprNWn',
    clientSecret: 'nysAxCYOo5UddBa8'
}
//set the client credientials variable
const clientCred='client_credentials'
//set the token buffer for the refresh
const TOKEN_BUFFER = 10;
//set the Amadeus url key for token
const amadeusUrl='https://test.api.amadeus.com/v1/security/oauth2/token';


const formSubmissionHandler = function(event){
    console.log("I am here2");
    event.preventDefault();
    const cityName=cityNameInputEl.value.trim();

    if (cityName){
        // pointsOfInterestDisplayEl.textContent = '';
        // pointOfInterestOneEl.textContent = '';
        // pointOfInterestTwoEl.textContent = '';
        // pointOfInterestThreeEl.textContent = '';
        // pointOfInterestFourEl.textContent = '';
        // pointOfInterestFiveEl.textContent = '';
        document.getElementById('city-input-form').reset();
        if (expiresAt < 0 || expiresAt == null){
            loadAccessToken(client);
        };
        getLocationData(cityName, apiKeyOpenWeather);
        
      
    }else{
        alert('No city name available')
        return;
    }
}
//Get the Geo Location for the Amadeus Request
const getLocationData = function (cityName, apiKey){
        if (typeof cityName==='undefined' || isNaN(cityName)!==true){
         return;
        }
         const apiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`
         
         
         fetch(apiUrl)
         .then(function(response){
             if (response.ok){
                 response.json().then(function (data){
                     // console.log(data);
                     getPointsOfInterests(data, cityName, apiKeyAmadeus);
                    
                 });
             }else {
                 alert(`Error:${response.statusText}`);
                 return;
             }
         })
         .catch(function (error){
             alert('Unable to connect to OpenWeather');
             return;
         });
     }
//get the points of interest or the activities from Amadeus API
const getPointsOfInterests = function (location, cityName, apiKey){
        if (location.length===0){
            alert(`No location data present!`);
            return;
        }
        let access = JSON.parse(localStorage.getItem('token'));
        const lat=location[0].lat;
        const lon=location[0].lon;
        if (access!=null){
            const apiUrl=`https://test.api.amadeus.com/v1/shopping/activities?latitude=${lat}&longitude=${lon}&radius=1`;
            fetch(apiUrl, {
                headers: {
                    'Authorization': `Bearer ${access}`
                    
                }
            }).then(res => {
                    
                    return res.json();
                }).then(function(data){
                    console.log(data);
                    localStorage.removeItem('activities');
                    localStorage.setItem('activities',JSON.stringify(data)); 
                });
                console.log(`Bearer ${access}`);
            }else{
                alert("No Token yet");
                return;
            }
    };
//url when server is back up 
    //https://test.api.amadeus.com/v1/reference-data/locations/pois?latitude=${lat}&longitude=${lon}&radius=1&page%5Blimit%5D=10&page%5Boffset%5D=0



//function to get the token with a HTML POST request
function loadAccessToken(client) {
    fetch(amadeusUrl, {
  method: 'POST',
  headers: {'Content-Type': 'application/x-www-form-urlencoded'},
  body: new URLSearchParams({
    'grant_type': 'client_credentials',
    'client_id': client.clientId,
    'client_secret': client.clientSecret
  })
}).then(res => {
    //return the response as JSON
       return res.json();
      })
      //extract the data with the token and the expire time and parse it to the function
      .then(function(data){
        console.log(data);
        storeAccessToken(data);
      });
        
    }

//store token and time in localStorage as "database" 
function storeAccessToken(response) {
    console.log(response);
    accessToken = response.access_token;
    localStorage.setItem('token',JSON.stringify(accessToken)); 
    expiresAt = response.expires_in; 'access_token'
    console.log(accessToken);
    localStorage.removeItem('expires');
    console.log(expiresAt);

    localStorage.setItem('expires',JSON.stringify(expiresAt)); 
    
  }
//load new token at the start of the web page and clear local storage to have full 30min with the new token
function start(){
    localStorage.clear();
    loadAccessToken(client);
}
//reduce the token time to determin when to get a new token
const timeCheck = function (expiresAt){
    console.log(expiresAt);
    if (expiresAt!=null){
        // console.log (expiresAt);
        expiresAt = JSON.parse(localStorage.getItem('expires'));
        expiresAt = expiresAt+TOKEN_BUFFER;
        console.log (expiresAt);
        const timeInterval = setInterval(function(){
             expiresAt = JSON.parse(localStorage.getItem('expires'));
             console.log("here2");
             expiresAt--;
             console.log (expiresAt);
             localStorage.setItem('expires',JSON.stringify(expiresAt)); 

             if (expiresAt<0 || expiresAt==null){
                //  clearInterval(timeInterval);
                 loadAccessToken(client);
                 timeCheck(expiresAt);
             }
         }, 1000)
        console.log(expiresAt);
    }else{
        expiresAt = JSON.parse(localStorage.getItem('expires'));
        timeCheck(expiresAt);
    }
}

start();

searchFormEl.addEventListener('submit', formSubmissionHandler);
timeCheck(expiresAt);




