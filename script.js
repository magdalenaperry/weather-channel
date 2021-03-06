containerEl = document.querySelector('container');
containerEl.classList.add('row');

var API = 'dbadba3b6a415a81ba40263bf08007ee';
var openCallWeatherUrl = 'https://api.openweathermap.org/data/2.5/onecall?';
var geoCodeWeatherUrl = 'https://api.openweathermap.org/geo/1.0/direct?q=';

// header create
var header = document.createElement('header');
header.classList.add('col-12', 'display-1', 'text-center', 'py-5', 'bg-secondary', 'text-light');
containerEl.appendChild(header);
header.textContent = "weather dashboard";

// aside semantic div
var asideEl = document.createElement('aside');
asideEl.classList.add('col-3', 'h5', 'py-5');
containerEl.appendChild(asideEl);

// button area so that it isn't cleared 
var buttonArea = document.createElement('div');
asideEl.appendChild(buttonArea);

// create main body
var mainEl = document.createElement('main');
mainEl.classList.add('col-8', 'margin-main');
containerEl.appendChild(mainEl);

var currentWeatherEl = document.createElement('div');
currentWeatherEl.classList.add('title', 'col-12','py-5', 'h2');
mainEl.appendChild(currentWeatherEl);

var fiveDayForecastEl = document.createElement('div');
fiveDayForecastEl.classList.add('col-12', 'h3');
fiveDayForecastEl.style.width = '8-rem;';
mainEl.appendChild(fiveDayForecastEl);

// search input and button
var searchEl = document.createElement('div');
searchEl.textContent = 'Search for a City:';
searchEl.classList.add('ms-4', 'mb-5');
// adds this element before the previous element
asideEl.prepend(searchEl);

var searchInput = document.createElement('input');
searchInput.classList.add('col-12', 'mb-3', 'py-2');
searchInput.placeholder = 'City';
searchEl.appendChild(searchInput);

var searchBtn = document.createElement('button');
searchBtn.textContent = 'Search';
searchBtn.classList.add('col-12','btn', 'btn-lg', 'btn-outline-secondary', 'px-5');
searchBtn.type = 'button';
searchEl.appendChild(searchBtn);

// local storage
var displayHistory = [];

// local storage check for cities input with key 'city' in string


// local storage in function so that they can be accessed to display information 
var renderButtons = function (){
var city = localStorage.getItem('city')
if (city) {
    displayHistory = JSON.parse(city);
    // console.log(displayHistory);
    buttonArea.innerHTML = '';
    for (let i = 0; i < displayHistory.length; i++) {
        (function () {
            var cityLocalEl = document.createElement('button');

            cityLocalEl.textContent = displayHistory[i];
            cityLocalEl.classList.add('col-11', 'list-group-item', 'ms-4');
            var cityList = displayHistory[i];
            buttonArea.appendChild(cityLocalEl);


            cityLocalEl.addEventListener('click', function () {
                getCityInfoByName(cityLocalEl.innerText);
            })
        })();
    };
}
}

// function to search information 
var searchHandler = function (event) {
    event.preventDefault();

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
        // local storage is synchronous action function has to be after set item
        renderButtons();
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

// connect the city name API to lat/lon
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

            // adds icon to current weather
            var iconCurrEl = document.createElement('img');
            iconCurrEl.src = 'https://openweathermap.org/img/wn/' + data.current.weather[0].icon + '@2x.png';
            iconCurrEl.alt = data.current.weather[0].description;
            iconCurrEl.title = data.current.weather[0].description;
            iconCurrEl.classList.add('d-block');
            currentWeatherEl.appendChild(iconCurrEl);

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
            if (data.current.uvi >= 6) {
                 var uvi = document.createElement('button');
                 uvi.classList.add('btnUVI', 'py-2', 'mx-4', 'btn', 'btn-danger');
                 currentWeatherEl.appendChild(uvi);
                 uvi.textContent = 'UVI: ' + data.current.uvi;
            } else if (data.current <= 2){
                var uvi = document.createElement('button');
                uvi.classList.add('btnUVI', 'py-2', 'mx-4', 'btn', 'btn-success');
                currentWeatherEl.appendChild(uvi);
                uvi.textContent = 'UVI: ' + data.current.uvi;
            } else {
                var uvi = document.createElement('button');
                uvi.classList.add('btnUVI', 'py-2', 'mx-4', 'btn', 'btn-primary');
                currentWeatherEl.appendChild(uvi);
                uvi.textContent = 'UVI: ' + data.current.uvi;
            }

            for (let i = 0; i < 5; i++) {
                // date changed to momentum
                var dtUnixFormatting = moment.unix(data.daily[i].dt).format('MMMM Do, YYYY');
                var tempDay = data.daily[i].temp.day;
                var windSpeed = data.daily[i].wind_speed;
                var humidity = data.daily[i].humidity;
                var weatherIcon = data.daily[i].weather[0].icon;
                var weatherDescription = data.daily[i].weather[0].description;
                var iconSource = 'https://openweathermap.org/img/wn/' + weatherIcon + '@2x.png';

                var card = document.createElement('div');
                card.classList.add('card-body', 'm-3');
                fiveDayForecastEl.appendChild(card);

                var dateEl = document.createElement('h5');
                dateEl.classList.add('card-text');
                card.appendChild(dateEl);
                dateEl.textContent = dtUnixFormatting;

                var iconEl = document.createElement('img');
                iconEl.src = iconSource;
                iconEl.alt = weatherDescription;
                iconEl.title = weatherDescription;
                iconEl.classList.add('d-block');
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
        })
        .catch(function (err) {
            console.log(err);
        });
    return;
};

// add event listener for search button
searchBtn.addEventListener('click', searchHandler);
renderButtons();
