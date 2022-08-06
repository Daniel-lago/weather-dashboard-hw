let historyBox = document.getElementById("historyBox");
let searchBox = document.getElementById("searchBox");
let infoBox = document.getElementById("infoBox");
let weatherBox = document.getElementById("weatherBox");
let forecastBox = document.getElementById("forecastBox");
let dailyForecast = document.getElementById("dailyForecast");

const keyAPI ="3f995a2d2c2b3676fa167de01264b50f"; 

let weatherData = {};

// Fetch API for weather today data
function searchCity () {
    searchInput = document.getElementById("searchInput").value;
    searchInput = searchInput.trim()

fetch(`https://api.openweathermap.org/data/2.5/weather?q=${searchInput}&appid=${keyAPI}&units=metric`) 
.then(function(response){
    return response.json();
})
//Create object with weather data information
.then(function(data){
     weatherData = {
        location: data.name,
        temperature: data.main.temp,
        wind: data.wind.speed,
        humidity: data.main.humidity,
        lat: data.coord.lat,
        lon: data.coord.lon
    } 
		saveFunction(weatherData.location)
})
.then(() => {
    let requestUrlUV =(`https://api.openweathermap.org/data/2.5/onecall?lat=${weatherData.lat}&lon=${weatherData.lon}&exclude={part}&appid=${keyAPI}`)
    fetch(requestUrlUV)
    .then(function(response){
        return response.json()
    })
		//We used also this api in order to get UV index value which was not provided by first api and we add it to main object
    .then(function(data){
        weatherData.uvi = data.current.uvi;
		buildTodayWeather(weatherData)
    })
})
// Get information for 5 day forecast
.then (() =>{
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${searchInput}&appid=${keyAPI}&units=metric`)
    .then(function(response){
        return response.json();
    })
    .then (function(data) {
        if (dailyForecast.hasChildNodes()) {
        dailyForecast.innerHTML=""
    } 
		//Iterate among objects delivered and create card with weather forecast.
			for (let i = 7; i < 40; i+=8) {
				forecastDayInfo = {
					day: data.list[i].dt,
					location: data.city.name,
					temperature: data.list[i].main.temp,
					icon: data.list[i].weather[0].icon,
					wind: data.list[i].wind.gust,
					humidity: data.list[i].main.humidity
				} 
        buildForecastDay(forecastDayInfo)
				
}})})
.catch(error =>alert("Please enter a valid location"));

}
//Put elements into HTML containers 
function buildTodayWeather (data) {
	//Clean container first if it's already done  
  infoBox.innerHTML=""
	// Create card with elements of today forecast
	infoBox.innerHTML = 
	`<div class="card-body-main">
		<h3 id="city-name" class="city-name align-middle"><b>${data.location}</b></h3>
		<p id="temperature"><b>Temperature:</b> ${data.temperature}&#176C</p>
		<p id="humidity"><b>Humidity:</b> ${data.humidity}%</p>
		<p id="wind-speed"><b>Wind Speed:</b> ${data.wind} KM/H</p>
		<p id="UV-index"><b>UV Index:</b> <i class="bg-success px-2 rounded"> ${data.uvi}</i></p>
	</div>`
	// Append main card into header
} 

function buildForecastDay(data) {
  // Create div cointainer for hold everycard  
	let dayCardForecast = document.createElement("div")
  // Convert timestamp into date 
	date = new Date (data.day *1000).getDate()
	month = new Date (data.day *1000).getUTCMonth()+1;
	year = new Date (data.day * 1000).getFullYear()
	fullDate = ` ${date} / ${month} / ${year}`    
//Create card with data for each forecast day
	dayCardForecast.innerHTML =
		`<div id="" class="card-body">
			<h3 id="day-time" class="day-time align-middle"><b>${fullDate}</b></h3>
			<img id="current-pic" src="https://openweathermap.org/img/wn/${data.icon}@2x.png" alt="">
			<p id="temperature"><b>Temperature:</b> ${data.temperature}&#176C</p>
			<p id="humidity"><b>Humidity: </b>${data.humidity}%</p>
			<p id="wind-speed"><b>Wind Speed:</b> ${data.wind} KM/H</p>
		</div>`
	//Append cards into div
	dailyForecast.appendChild(dayCardForecast)
};

// //Local storage for history search 

function saveFunction (value){
	let cityLog = JSON.parse(localStorage.getItem("search"))||[];
	cityLog.push(value);
	let cityLogJSON = JSON.stringify(cityLog);
	localStorage.setItem("search", cityLogJSON);
	console.log(cityLog);
	let titleForecast = document.getElementById("titleDays").style.display="";
}

function displayHistory(){
	if (localStorage.length > 0 ) {
		JSON.parse(localStorage.getItem("search")).forEach((element) => {
		let historyEl= document.createElement("div")
		historyEl.setAttribute("class", "card-body-history");
		historyEl.innerHTML =
			`<button id="city-past"> ${element} </button>`
		searchBox.append(historyEl)
		})
	}};

displayHistory();

//crear eventlistener en botones de ciudades.