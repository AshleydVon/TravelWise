const searchFormEl=document.querySelector('#search-form');
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

const formSubmissionHandler = function(event){
    event.preventDefault();
    const cityName=cityNameInputEl.ariaValueMax.trim();

    if (cityName){
        pointsOfInterestDisplayEl.textContent = '';
        pointOfInterestOneEl.textContent = '';
        pointOfInterestTwoEl.textContent = '';
        pointOfInterestThreeEl.textContent = '';
        pointOfInterestFourEl.textContent = '';
        pointOfInterestFiveEl.textContent = '';
        document.getElementById('search-form').reset();
        getLocationData(cityName, apiKeyOpenWeather);
      
    }else{
        alert('No city name available')
        return;
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

const getPointsOfInterests = function (location, cityName, apiKey){
        if (location.length===0){
            alert(`No location data present!`);
            return;
        }
        const lat=location[0].lat;
        const lon=location[0].lon;
        const apiUrl=`https://api.amadeus.com/v1/reference-data/locations/pois?latitude=${lat}&longitude=${lon}`;
    }
}

const client = {
    clientId:'TjoaeFDE9hRkdigYZ5PvG6xgmnEprNWn',
    clientSecret: 'nysAxCYOo5UddBa8'
}
const clientCred='client_credentials'
// console.log(client);
const TOKEN_BUFFER = 10;
const amadeusUrl='https://test.api.amadeus.com/v1/security/oauth2/token';
// unauthenticatedRequest
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
        // console.log("Request complete! response:", res);
        storeAccessToken(res)
      });
        
    }

//JSON.stringify({grant_type: clientCred , client_id: client.clientId, client_secret: client.clientSecret})
    // `grant_type=client_credentials&client_id=${client.clientId}&client_secret=${client.clientSecret}`
    // grant_type=client_credentials&client_id=TjoaeFDE9hRkdigYZ5PvG6xgmnEprNWn&client_secret=nysAxCYOo5UddBa8
    // client.unau('POST', '/v1/security/oauth2/token', {
    //   'grant_type' : 'client_credentials',
    //   'client_id' : client.clientId,
    //   'client_secret' : client.clientSecret
    // }).then((response) => {
    //   storeAccessToken(response);
    //   this.emitOrLoadAccessToken(client, emitter);
    // }).catch((error) => {
    //   emitter.emit('reject', error);
    //   return;
    // });
//   }

function storeAccessToken(response) {
    console.log(response);
    let accessToken = response.result;
    // let expiresAt = Date.now() + (response.result['expires_in'] * 1000); 'access_token'
    console.log(accessToken);
    // console.log(expiresAt);
  }

function start(){
    loadAccessToken(client);
}

start();






// fetch (amadeusUrl,{
//     method: "POST",
//     headers: {'Content-Type': 'application/x-www-form-urlencoded'},
//     body: {
//         'grant_type' : 'client_credentials',
//         'client_id' : client.clientId,
//         'client_secret' : client.clientSecret
//       }