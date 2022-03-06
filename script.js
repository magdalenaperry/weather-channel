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





// create a header div
    // add a gradient class for header
//create elements for aside
    //add class lis to aside for bootstrap
    // col-2 for aside

//create a search button
    // add classes to buttons
//create 5 day forecast div
    // col-10 for section

// create 5 divs inside the forecast div  

