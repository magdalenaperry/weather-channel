containerEl = document.querySelector('container')
containerEl.classList.add('row');

var API = 'dbadba3b6a415a81ba40263bf08007ee';
var openCallWeatherUrl = 'https://api.openweathermap.org/data/2.5/onecall?';
var geoCodeWeatherUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=';

// header create
var header = document.createElement('header');
header.classList.add('col-12', 'display-1', 'text-center', 'py-5', 'bg-secondary', 'text-light');
containerEl.appendChild(header);
header.textContent = "how is the weather up there?";

// aside semantic div
var asideEl = document.createElement('aside');
asideEl.classList.add('col-3', 'h5', 'py-5');
containerEl.appendChild(asideEl);

// create main body
var mainEl = document.createElement('main');
mainEl.classList.add('col-8', 'margin-main');
containerEl.appendChild(mainEl);

var currentWeatherEl = document.createElement('div')
currentWeatherEl.classList.add('title', 'col-12','py-5', 'h2');
mainEl.appendChild(currentWeatherEl);


var fiveDayForecastEl = document.createElement('div');
fiveDayForecastEl.classList.add('col-12', 'h3');
fiveDayForecastEl.style.width = '8-rem;'
mainEl.appendChild(fiveDayForecastEl);

// search input and button
var searchEl = document.createElement('div');
searchEl.textContent = 'Search for a City:'
searchEl.classList.add('ms-4', 'mb-5')
asideEl.appendChild(searchEl);

var searchInput = document.createElement('input');
searchInput.classList.add('col-12', 'mb-3', 'py-2');
searchInput.placeholder = 'City'
searchEl.appendChild(searchInput);

var searchBtn = document.createElement('button');
searchBtn.textContent = 'Search';
searchBtn.classList.add('col-12','btn', 'btn-lg', 'btn-outline-secondary', 'px-5')
searchBtn.type = 'button'
searchEl.appendChild(searchBtn);

// local storage
var displayHistory = [];

// local storage check for cities input with key 'city' in string
var city = localStorage.getItem('city')
if (city) {
    displayHistory = JSON.parse(city);
    console.log(displayHistory);

    for (let i = 0; i < displayHistory.length; i++) {
        var cityLocalEl = document.createElement('li');
        cityLocalEl.classList.add('col-11','list-group-item', 'ms-4');
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

    fetch(coordinateRequestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {

            // clears out previous search requests
            currentWeatherEl.innerHTML = '';
            fiveDayForecastEl.innerHTML = '';

            var cityName = searchTerm;
            console.log(cityName);
            var printCity = document.createElement('h2');
            printCity.classList.add('test');
            currentWeatherEl.appendChild(printCity);
            printCity.textContent = 'weather for: ' + cityName;

            // adds temperature to current weather
            var temp = document.createElement('p');
            temp.classList.add('h4', 'py-3', 'px-4');
            currentWeatherEl.appendChild(temp);
            temp.textContent = 'Temp: ' + data.current.temp + ' F';

            // adds wind speed to current weather
            var wind = document.createElement('p');
            wind.classList.add('h4', 'pb-3', 'px-4');
            currentWeatherEl.appendChild(wind);
            wind.textContent = 'Wind: ' + data.current.wind_speed + ' mph';

            // adds humidity to current weather
            var humidity = document.createElement('p');
            humidity.classList.add('h4', 'pb-3', 'px-4');
            currentWeatherEl.appendChild(humidity);
            humidity.textContent = 'Humidity: ' + data.current.humidity + '%';

            // adds uvi index to current weather
            var uvi = document.createElement('button');
            uvi.classList.add('btnUVI', 'py-2', 'mx-4','btn', 'btn-warning');
            currentWeatherEl.appendChild(uvi);
            uvi.textContent = 'UVI: ' + data.current.uvi;

            for (let i = 0; i < 5; i++) {

                // date changed to momentum
                var dtUnixFormatting = moment.unix(data.daily[i].dt).format('MMMM Do, YYYY');
                var tempDay = data.daily[i].temp.day;
                var windSpeed = data.daily[i].wind_speed;
                var humidity = data.daily[i].humidity;
                var weatherIcon = data.daily[i].weather[0].icon;
                var weatherDescription = data.daily[i].weather[0].description
                var iconSource = 'https://openweathermap.org/img/wn/' + weatherIcon + '@2x.png'
                // console.log(data.daily[i].weather[0].icon)
                // console.log(iconSource);

                var card = document.createElement('div');
                card.classList.add('card-body', 'm-3')
                fiveDayForecastEl.appendChild(card);
                console.log(card)

                var dateEl = document.createElement('h5');
                dateEl.classList.add('card-text');
                card.appendChild(dateEl);
                dateEl.textContent = dtUnixFormatting;

                var iconEl = document.createElement('img');
                iconEl.src = iconSource;
                iconEl.alt = weatherDescription;
                iconEl.title = weatherDescription;
                iconEl.classList.add('d-block')
                card.appendChild(iconEl);


                var tempEl = document.createElement('p');
                tempEl.classList.add('card-text', 'lh-lg');
                card.appendChild(tempEl);
                tempEl.textContent = 'Temp: ' + tempDay;

                var windSpeedEl = document.createElement('p');
                windSpeedEl.classList.add('card-text', 'lh-lg');
                card.appendChild(windSpeedEl);
                windSpeedEl.textContent = 'Wind: '+ windSpeed + ' mph';

                var humidityEl = document.createElement('p');
                humidityEl.classList.add('card-text', 'lh-lg');
                card.appendChild(humidityEl);
                humidityEl.textContent = 'Humidity: ' + humidity + '%';
            }
            // icons? 
        })
        .catch(function (err) {
            console.log(err);
        });
    return;
};

// add event listener for search button
searchBtn.addEventListener('click', searchHandler);