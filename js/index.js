const citySearch = document.getElementById("enter-city");
const searchBtn = document.getElementById("search-btn");
const clearBtn = document.getElementById("clear-history");
let historyEl = document.getElementById("history");
let cityName = document.getElementById("city-name");
let timeEl = document.getElementById("time");
let tempEl = document.getElementById("temperature");
let humidityEl = document.getElementById("humidity");
let windSpeedEl = document.getElementById("wind-speed");
let uvIndexEl = document.getElementById("UV-index");
let fivedayEl = document.getElementById("fiveday-header");
const fiveDayForecast = document.getElementById("small-card");
let todayweatherEl = document.getElementById("todays-weather");
let searchHistory = JSON.parse(localStorage.getItem("search")) || [];
let i = 0;

console.log(searchHistory);

// === Asigned API Key for this project. === //
let APIKey = "a42588003d826e5d0df55563b9cec924";

// === Please if you are going to use api.opencagedata.com API, get your own API KEY at https://opencagedata.com/users/sign_up ! Thanks dear collega === //
let geoCodeKey = "d2e0dbd682fb4a8dbbffd87ef562fe17";

// === Search option by clicking the magnifier button === //
searchBtn.addEventListener("click", function () {
    if (citySearch.value === "") {
        alert("Introduce the city name")
    }
    else {
        searchHistory.push(citySearch.value);
        localStorage.setItem("search", JSON.stringify(searchHistory));
        getWeatherData();
    }
});

// === Search option by pressing the key Enter === //
citySearch.addEventListener("keyup", function (e) {
    if (e.key === 'Enter' || e.KeyboardEvent === 13) {
        if (citySearch.value === "") {
            alert("Introduce the city name")
        }
        else {
            searchHistory.push(citySearch.value);
            localStorage.setItem("search", JSON.stringify(searchHistory));
            getWeatherData();
        }
    }
});

// === Clears LocalStorage and searchHistory objet === //
clearBtn.addEventListener("click", function () {
    localStorage.clear();
    searchHistory = [];
    while (historyEl.firstChild) {
        historyEl.removeChild(historyEl.firstChild);
    }
    i = 0;
});


console.log(searchHistory);

for (; i < searchHistory.length; i++) {
    let eachNewHighScore = document.createElement("p");
    eachNewHighScore.setAttribute("class", "form-control d-block bg-white text-center");
    eachNewHighScore.innerHTML = searchHistory[i];
    historyEl.appendChild(eachNewHighScore);
}

historyEl.addEventListener('click', function handleClick(event) {
    let clickEvent = event.target.textContent;
    console.log(clickEvent);
    citySearch.value = clickEvent;
    console.log(citySearch.value);

    getWeatherData();
});



// === API called from openweathermap.org === //
function getWeatherData() {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${citySearch.value}&units=metric&appid=${APIKey}`)
        .then(res => res.json()).then(data => {
            console.log(data);
            console.log(citySearch.value);

            showWeatherData(data);
        });
}

// ===  Function to show the weather data acquired from the last API Call, pulling the 'data' from getWeatherData() === //
function showWeatherData(data) {
    console.log(data);
    let cityID = data.id;
    let { humidity, temp } = data.main;
    let windSpeedData = data.wind.speed;
    let cityName = data.name;

    // === Pull latitud and Longitud from the Weahter API Call. === //
    let lat = data.coord.lat;
    console.log(lat);
    let lon = data.coord.lon;
    console.log(lon);


    // === Forecast 5. === //
    fetch(`https://api.openweathermap.org/data/2.5/forecast?id=${cityID}&units=metric&appid=${APIKey}`)
        .then(res => res.json()).then(forecastData => {
            console.log(forecastData);



            // === API Request, to search for the continent of each city === //    
            fetch(`https://api.opencagedata.com/geocode/v1/json?q=${citySearch.value}&key=${geoCodeKey}`)
                .then(res => res.json()).then(continentAPI => {
                    let continent = continentAPI.results[0].components.continent;

                    // === API Request, to get UV index value. === //
                    fetch(`https://api.openweathermap.org/data/2.5/uvi/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}&cnt=1`)
                        .then(res => res.json()).then(forecastResponse => {
                            console.log(forecastResponse);

                            // === Formating the continent to only America === //  
                            if (continent === "North America" || continent === "South America") {
                                continent = "America";
                            }

                                // Block used to search for the international current hour in each city
                            // === replacing all the spaces with underscores, so we can search places like New York === //
                            // const UnderScores = citySearch.value.replaceAll(' ', '_');
                            // === Gives the time of specific cities based on TZ database name  === //
                            // let cityTime = new Date().toLocaleString("en-US", { timeZone: `${continent}/${UnderScores}`, dateStyle: 'long', timeStyle: 'short', hourCycle: 'h12' });
                            // console.log(cityTime);

                            todayweatherEl.classList.remove("d-none");
                            let UVIndex = forecastResponse[0].value;

                    
                                // === Displays in DOM (Main Card) the information we got from the APIs opencagedata & openweathermap === //
                                todayweatherEl.innerHTML =

                                    `<div class="card-body">
                                        <h3 id="city-name" class="city-name align-middle">${cityName} (${continent})</h3>
                                        <img id="current-pic" alt="">
                                        <p id="temperature">Temperature: ${temp}&#176C</p>
                                        <p id="humidity">Humidity: ${humidity}%</p>
                                        <p id="wind-speed">Wind Speed: ${windSpeedData} KM/H</p>
                                        <p id="UV-index">UV Index: <i class="bg-success px-2 rounded"> ${UVIndex}</i></p>
                                    </div>`

                        });
                });
            // === Five Day Forecast small cards === //  
            fivedayEl.classList.remove('d-none');
            fiveDayForecast.classList.remove('d-none');
            const forecastEls = document.querySelectorAll(".forecast");

            for (i = 0; i < forecastEls.length; i++) {
                forecastEls[i].innerHTML = "";
                // === Formula to select the proper dt information for each day === //
                const forecastIndex = i * 8 + 4;
                console.log(forecastIndex);
                const forecastDate = new Date(forecastData.list[forecastIndex].dt * 1000);
                console.log(forecastDate);
                const forecastDay = forecastDate.getDate();
                const forecastMonth = forecastDate.getMonth() + 1;
                const forecastYear = forecastDate.getFullYear();
                const forecastDateEl = document.createElement("p");
                forecastDateEl.setAttribute("class", "mt-3 mb-0 forecast-date");
                forecastDateEl.innerHTML = forecastMonth + "/" + forecastDay + "/" + forecastYear;
                forecastEls[i].append(forecastDateEl);
                const forecastWeatherEl = document.createElement("img");
                forecastWeatherEl.setAttribute("src", "https://openweathermap.org/img/wn/" + forecastData.list[forecastIndex].weather[0].icon + "@2x.png");
                forecastWeatherEl.setAttribute("alt", forecastData.list[forecastIndex].weather[0].description);
                forecastEls[i].append(forecastWeatherEl);
                const forecastTempEl = document.createElement("p");
                forecastTempEl.innerHTML = "Temp: " + forecastData.list[forecastIndex].main.temp + "  &#176C";
                forecastEls[i].append(forecastTempEl);
                const forecastHumidityEl = document.createElement("p");
                forecastHumidityEl.innerHTML = "Humidity: " + forecastData.list[forecastIndex].main.humidity + "%";
                forecastEls[i].append(forecastHumidityEl);

            }
        });
}