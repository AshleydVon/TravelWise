const searchFormEl=document.querySelector('#city-input-form');
const cityNameInputEl=document.querySelector('#location');

const pointsOfInterestDisplayEl=document.querySelector('#current-card');
const pointsOfInterestContainerEl=document.querySelector('#city-links');

const cityLinkEl=document.querySelector('#city-links');
const apiKeyAmadeus='Ec4DHZL6kMcHpTShrIZ2RDmZiTsv2INs';
const apiKeyOpenWeather='0d552094f106990cbff9be54fa9c4761';
const unsplashAccessKey = '0if3GrDUIH6iysaGK3ST5e-E-EBHqEfaRjhEcoPySwE'; // Your Unsplash API key

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
    // console.log("I am here2");
    event.preventDefault();
    const cityName=cityNameInputEl.value.trim();
    localStorage.setItem('cities',JSON.stringify(cityName)); 
    
    if (cityName){
        document.getElementById('city-input-form').reset();
        if (expiresAt < 0 || expiresAt == null){
            loadAccessToken(client);
        };
        getLocationData(cityName, apiKeyOpenWeather);
        }else{
        alert('No city name available')
        return;
    }
    storeLocation(cityName);
}

const storeLocation = function (cityName){
    let cityCheck = false;
    let cityLinks=JSON.parse(localStorage.getItem('cityLinks'));
    
    console.log(cityName);
    console.log(cityLinks);
    if (!cityLinks){
        console.log("what??")
        cityLinks=[];
        cityLinks.push(cityName);
        localStorage.setItem('cityLinks',JSON.stringify(cityLinks));
    }else{
        
        for (i=0; i<cityLinks.length; i++){
            if (cityLinks[i] === cityName){
                
                cityCheck=true;   
            }
        }
        if (cityCheck===false){
            if (cityLinks.length != 10){
                console.log('here we are')
                cityLinks.push(cityName);
                localStorage.setItem('cityLinks',JSON.stringify(cityLinks));
            }else{
                cityLinks=[];
                cityLinks.push(cityName);
                cityCheck=false;
                localStorage.setItem('cityLinks',JSON.stringify(cityLinks));
            }
        }    
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
                    
                    localStorage.setItem('activities',JSON.stringify(data)); 
                    displayActivities();
                });
                
            }else{
                alert("No Token yet");
                return;
            }
    };

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
        // console.log(data);
        storeAccessToken(data);
      });
        
    }

//store token and time in localStorage as "database" 
function storeAccessToken(response) {
    // console.log(response);
    accessToken = response.access_token;
    localStorage.setItem('token',JSON.stringify(accessToken)); 
    expiresAt = response.expires_in; 'access_token'
    // console.log(accessToken);
    localStorage.removeItem('expires');
    console.log(expiresAt);

    localStorage.setItem('expires',JSON.stringify(expiresAt)); 
    
  }
//load new token at the start of the web page and clear local storage to have full 30min with the new token
function start(){
    // localStorage.clear();
    loadAccessToken(client);
}
//reduce the token time to determin when to get a new token
const timeCheck = function (expiresAt){
    // console.log(expiresAt);
    if (expiresAt!=null){
        // console.log (expiresAt);
        expiresAt = JSON.parse(localStorage.getItem('expires'));
        expiresAt = expiresAt+TOKEN_BUFFER;
        // console.log (expiresAt);
        const timeInterval = setInterval(function(){
             expiresAt = JSON.parse(localStorage.getItem('expires'));
            //  console.log("here2");
             expiresAt--;
            //  console.log (expiresAt);
             localStorage.setItem('expires',JSON.stringify(expiresAt)); 

             if (expiresAt<0 || expiresAt==null){
                //  clearInterval(timeInterval);
                 loadAccessToken(client);
                 timeCheck(expiresAt);
             }
         }, 1000)
        // console.log(expiresAt);
    }else{
        expiresAt = JSON.parse(localStorage.getItem('expires'));
        timeCheck(expiresAt);
    }
}
//display up to 20 Activities
const displayActivities = function(){
    activityData = JSON.parse(localStorage.getItem('activities'));
    // console.log(activityData);
    if (activityData.length==0 || typeof activityData == 'undefined' || activityData == null || activityData.data.length==0){
        // console.log("here");
        alert("No Activities Posted. Was a City selected?");
        return;
    }
   
    // console.log(activityData.data[0].name)
    $('#activities-list').empty();  
    for (let i=0; i < activityData.data.length; i++){
        // console.log("here2");
        if (typeof activityData.data[i].name == 'undefined' || activityData.data[i].name == null){
            alert("no data present");
            return;
        }else{
            if (i<20){
                console.log(i);
                $('#activities-list').append(`<li>${activityData.data[i].name}</li>`);
            }
          }
    }
    let location = JSON.parse(localStorage.getItem('cities'));
    console.log(location);
    updateBackgroundImage(location);
};
//update the Background per location searched for
const updateBackgroundImage = function (location) {
    console.log("here I am")
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

start();

searchFormEl.addEventListener('submit', formSubmissionHandler);
timeCheck(expiresAt);




