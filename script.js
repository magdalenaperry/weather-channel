containerEl = document.querySelector('container')
containerEl.classList.add('row');

var API = 'dbadba3b6a415a81ba40263bf08007ee';
var openCallWeatherUrl = 'https://api.openweathermap.org/data/2.5/onecall?';
var geoCodeWeatherUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=';

// header create
var header = document.createElement('header');
header.classList.add('col-12', 'display-3', 'text-center', 'pt-4', 'pb-4', 'bg-primary', 'text-light');
containerEl.appendChild(header);
header.textContent = 'Weather Dashboard';

// aside semantic div
var asideEl = document.createElement('aside');
asideEl.classList.add('testclass1', 'col-3', 'h4', 'pt-5', 'pb-5');
containerEl.appendChild(asideEl);

// create main body
var mainEl = document.createElement('main');
mainEl.classList.add('testclass', 'col-9', 'h3', 'mt-5', 'mb-5');
containerEl.appendChild(mainEl);

var currentWeatherEl = document.createElement('div')
currentWeatherEl.classList.add('padding');
mainEl.appendChild(currentWeatherEl);
currentWeatherEl.textContent = 'Current Weather';

// 5 day forecast div 
var fiveDayForecastEl = document.createElement('div');
fiveDayForecastEl.classList.add('0');
mainEl.appendChild(fiveDayForecastEl);
fiveDayForecastEl.textContent = '5 Day Weather Forecast';

// search input and button
var searchEl = document.createElement('div');
searchEl.textContent = 'Search for a City:'
searchEl.classList.add('ms-4')
asideEl.appendChild(searchEl);

var searchInput = document.createElement('input');
searchInput.classList.add('testclass2');
searchInput.placeholder = 'Charlotte, NC'
searchEl.appendChild(searchInput);

var searchBtn = document.createElement('button');
searchBtn.textContent = 'Search';
searchBtn.classList.add('text-center')
searchEl.appendChild(searchBtn);

// local storage
var displayHistory = [];

// local storage check for cities input with key 'city' in string
var city = localStorage.getItem('city')
if (city) {
    displayHistory = JSON.parse(city);
    console.log(displayHistory);
    

    for (let i = 0; i < displayHistory.length; i++) {
        var cityLocalEl = document.createElement('button');
        cityLocalEl.classList.add('test');
        cityLocalEl.textContent = displayHistory[i];
        asideEl.appendChild(cityLocalEl);
    }
    
}






// function to search information 
var searchHandler = function (event) {
    event.preventDefault();
    // console.log('you clicked search button');
    // removes white space .trim()
    var citySearch = searchInput.value.trim();
    if (citySearch) {
        getCityInfoByName(citySearch);
        searchInput.value = citySearch;
        searchInput.value = '';

        var duplicateCities = false;
        for (let i = 0; i < displayHistory.length; i++) {
            if (displayHistory[i] === citySearch){
                duplicateCities = true;
            }
        }
        if(!duplicateCities){
            displayHistory.push(citySearch);
        }
        localStorage.setItem('city', JSON.stringify(displayHistory));
    } else {
        alert('Please enter a valid city.');
    }
};


// function to access API within the search button function for a city with lats/lons
var getCityInfoByName = function (city) {
    // var apiUrl =
    var cityRequestUrl = geoCodeWeatherUrl + city + '&appid=' + API;

    fetch(cityRequestUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    displayWeather(data, city);
                });
            } else {
                alert('Error: ' + response.statusText);
            }
        })
        .catch(function (error) {
            alert('Unable to find data for this city');
        });

};
// connect the city name API to lat/l
var displayWeather = function (weatherData, searchTerm) {
    if (weatherData.length === 0) {
        mainEl.textContent = 'No data found';
        return;
    }

    var lat = weatherData[0].lat
    var lon = weatherData[0].lon

    // fetch information by coordinates
    var coordinateRequestUrl = openCallWeatherUrl + 'lat=' + lat + '&lon=' + lon + '&appid=' + API + '&units=imperial';
    // console.log(coordinateRequestUrl);

    fetch(coordinateRequestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {

            // console.log(data.current.temp);
            // adds temperature to current weather
            var temp = document.createElement('div');
            temp.classList.add('test');
            currentWeatherEl.appendChild(temp);
            temp.textContent = 'Temp: ' + data.current.temp + 'F';
            // adds wind speed to current weather
            var wind = document.createElement('div');
            wind.classList.add('test');
            currentWeatherEl.appendChild(wind);
            wind.textContent = 'Wind: ' + data.current.wind_speed + 'mph';
            // adds humidity to current weather
            var humidity = document.createElement('div');
            humidity.classList.add('test');
            currentWeatherEl.appendChild(humidity);
            humidity.textContent = 'Humidity: ' + data.current.humidity + '%';
            // adds uvi index to current weather
            var uvi = document.createElement('div');
            uvi.classList.add('test');
            currentWeatherEl.appendChild(uvi);
            uvi.textContent = 'UV index: ' + data.current.uvi;



            for (let i = 0; i < 5; i++) {

                // date changed to momentum
                // console.log(data.daily[i].dt);
                var dtUnixFormatting = moment.unix(data.daily[i].dt).format('MM DD, YYYY');
                // console.log(dtUnixFormatting);
                var tempDay = data.daily[i].temp.day;
                var windSpeed = data.daily[i].wind_speed;
                var humidity = data.daily[i].humidity;
                var weatherIcon = data.daily[i].weather.id;
                console.log(data.daily[i].weather[0].id)

                var dateEl = document.createElement('div');
                dateEl.classList.add('test');
                fiveDayForecastEl.appendChild(dateEl);
                dateEl.textContent = dtUnixFormatting;

                var tempEl = document.createElement('p');
                tempEl.classList.add('test');
                dateEl.appendChild(tempEl);
                tempEl.textContent = 'Temp ' + tempDay;

                var windSpeedEl = document.createElement('p');
                windSpeedEl.classList.add('test');
                dateEl.appendChild(windSpeedEl);
                windSpeedEl.textContent = windSpeed + ' mph';

                var humidityEl = document.createElement('p');
                humidityEl.classList.add('test');
                dateEl.appendChild(humidityEl);
                humidityEl.textContent = humidity + '%';
            }
            // icons? 
        })
        .catch(function (err) {
            console.log(err);
        });
    return;
};


// local storage?

// keep the search button to stay on after initial search;

// start screen loads local storage to show previous searches


// add search history to initial screen


// create an add event listener for search button
searchBtn.addEventListener('click', searchHandler);