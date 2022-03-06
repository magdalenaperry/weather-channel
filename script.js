
containerEl = document.querySelector('container')
containerEl.classList.add('row');

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
mainEl.textContent = '5 Day Forecast';

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







//create a search button
    // add classes to buttons
//create 5 day forecast div
    // col-10 for section

// create 5 divs inside the forecast div  

//fetch API
var requestURL = 'https://api.openweathermap.org/data/2.5/onecall?lat=41.878113&lon=-87.629799&appid=8a4f71946c01452c9735df61812f9851& units=imperial';

fetch(requestURL)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data);
    })
    .catch(function (err) {
        console.log(err);
    });