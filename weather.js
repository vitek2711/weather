'use strict'

// Variables
let btn;
let input;
let error = 'error';
let inputValue;
let cityName = 'Могилёв';
let body = document.querySelector('body');
let widget;
let iconCode;
let humidity;
let currentTemperature;
let weatherDescription;
let currentCityName;
let windSpeed;

//Render HTML function
function renderHtml(forecastObj, fDataList) {
    iconCode = forecastObj?.weather[0]?.icon;
    humidity = forecastObj?.main?.humidity;
    currentTemperature = Math.round(forecastObj?.main.temp - 273);
    weatherDescription = forecastObj?.weather[0]?.description;
    currentCityName = forecastObj?.name;
    windSpeed = Math.round(forecastObj?.wind?.speed);

    //html code
    let html = `
    <div class="widget">
        <p class="now">The weather is now</p>
        <!--Weather picture-->
        <div class="weather-icon">
            <img src="./img/${iconCode}.svg" alt="icon">
        </div>
        <!--Weather description-->
        <div class="weather-description">${weatherDescription}</div>
        <div class="city-name">${currentCityName}</div>
        <div class="items">
            <!--Curent wind speed-->
            <div class="part">
                <p class="param">Wind</p>
                <img class="wind-img" src="./img/tornado.svg" alt="wind">
                <p class="text-part">${windSpeed} m/s</p>
            </div>
            <p class="temperature">${currentTemperature}&deg;</p>
            <!-- Current Humidity-->
            <div class="part">
                <p class="param">Humidity</p>
                <img class="humidity-img" src="./img/wet.png" alt="humidity-img">
                <p class="text-part">${humidity} %</p>
            </div>
        </div>
       
    <!-- Weather forecast -->
        <p class="now">forecast for three days</p>
 <div class="forecast">
            <div class="forecast-block">
                <p class="param">${fDataList[0].dt_txt.split(' ')[0].slice(8,10)}</p>
                <img class="night-img" src="./img/${fDataList[0].weather[0].icon}.svg" alt="icon">
                <p class="forecast-temp">${fDataList[0].main.temp.toFixed(0)}&deg;</p>
            </div>
            <div class="forecast-block">
                <p class="param">${fDataList[1].dt_txt.split(' ')[0].slice(8,10)}</p>
                <img class="daytime-img" src="./img/${fDataList[1].weather[0].icon}.svg" alt="icon">
                <p class="forecast-temp">${fDataList[1].main.temp.toFixed(0)}&deg;</p>
            </div>
            <div class="forecast-block">
                <p class="param">${fDataList[2].dt_txt.split(' ')[0].slice(8,10)}</p>
                <img class="daytime-img" src="./img/${fDataList[2].weather[0].icon}.svg" alt="icon">
                <p class="forecast-temp">${fDataList[2].main.temp.toFixed(0)}&deg;</p>
            </div>
        </div>
        <!--input-->
        <div class="getcity">
            <input form="btn" placeholder="Enter the name of the city" class="city-input" type="text" size="30" value="" id="inputValue">
            <button id="btn" class="btn" id="btn"><i class="fa-solid fa-magnifying-glass"></i></button>
        </div>  
    </div>`;
    // insert HTML code
    body.insertAdjacentHTML('afterbegin', html);
    getOtherCity();
}


// Get other city function
function getOtherCity() {
    input = document.getElementsByTagName('input');
    btn = document.getElementById('btn');
    btn.addEventListener('click', () => {
        // Get input value
        inputValue = document.getElementById('inputValue').value;
        cityName = inputValue;
        widget = document.querySelector('.widget');
        if (inputValue === '') {
            return;
        } else {
            widget.remove();
        }
        (async function (){
            getCityName(cityName);
        })();
    });
}

//Get weather forecast
async function forecast(cityName) {
    let response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&cnt=25&appid=6a7a4d30f99d918e2254ddc1a283a131&units=metric`)
    let fData = await response.json();
    let date = 8;
    fData.list = fData.list.filter((item, index) => {
        if (index > date) date += 8;
        return index!==0 && index % date === 0;
    });
    return fData.list;
}

// forecast(cityName);


// Get city name & response function
async function getCityName(cityName) {
    let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=6a7a4d30f99d918e2254ddc1a283a131&lang`)
    let mainCityData = await response.json();
    let forecastData = await forecast(cityName);
    console.log(mainCityData);
    renderHtml(mainCityData, forecastData);
}

function nextDaysWeather(data) {
    let forecasts = document.querySelectorAll('.forecast-block');
    forecasts.forEach(item=>{
        let fParam = item.querySelector('.param');
        let fImg = item.querySelector('.daytime-img');
        let fTemp = item.querySelector('.forecast-temp');
    })
}
(async function (){
    getCityName(cityName);
})();