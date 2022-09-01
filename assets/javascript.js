const appid = '91ea7f389e76582e309295deb4709dea';

async function forecastSearch(search){
    const geoquery = `https://api.openweathermap.org/geo/1.0/direct?q=${search}&limit=1&appid=${appid}`;
    let weatherquery;

    await fetch(geoquery)
    .then(res => res.json())
    .then(result => {
        weatherquery = `https://api.openweathermap.org/data/3.0/onecall?lat=${result[0].lat}&lon=${result[0].lon}&appid=${appid}&units=imperial`;
    })
    .catch(err => {
        window.alert('Could not find a city with that name! Please try again')
    })

    if(weatherquery){
        await fetch(weatherquery)
        .then(res => res.json())
        .then(result => {
            appendCurrentCity(result, search);
            appendFiveDayForecast(result, search);
        })
        .catch(err => console.log(err));
    }
}

async function appendCurrentCity(data, city){
    const current = data.current;
    const date = new Date(current.dt * 1000).toLocaleDateString('en-US');
    const iconQuery = current.weather[0].icon;
    const icon = `https://openweathermap.org/img/wn/${current.weather[0].icon}.png`;

    let uviSeverity;
    
    // UV Index Severity Color Code
    if(current.uvi <= 2){
        uviSeverity = 'favorable';
    }else if(current.uvi > 2 && current.uvi <= 5){
        uviSeverity = 'moderate';
    }else if(current.uvi > 5){
        uviSeverity = 'severe';
    }

    const currentHtml = `<h2>${city} (${date})</h2>
                        <img src='${icon}'>
                        <p>Temp: ${current.temp}°F</p>
                        <p>Humidity: ${current.humidity}%</p>
                        <p>Wind Speed: ${current.wind_speed} MPH</p>
                        <p>UV Index: <span class='${uviSeverity}'>${current.uvi}</span></p>`;

    $('#today-content').html('');
    $('#today-content').append(currentHtml);

    addToSearchHistory(city);
}

function appendFiveDayForecast(data, city){
    const daily = data.daily;

    $('#forecast-container').html('');

    daily.forEach((day, index) => {
        if(index < 5){

            const i = daily[index];

            const icon = `http://openweathermap.org/img/wn/${i.weather[0].icon}.png`;

            const date = new Date(i.dt * 1000).toLocaleDateString('en-US');

            const dayHtml = `<div class='day-forecast'>
                                <h3>${date}</h3>
                                <img src='${icon}'></img>
                                <p>Temperature: ${i.temp.day}°F</p>
                                <p>Wind Speed: ${i.wind_speed} MPH</p>
                                <p>Humidity: ${i.humidity}%</p>
                            </div>`;

            $('#forecast-container').append(dayHtml);
        }
    });
}

/*

  Search History Functionality

*/

function addToSearchHistory(city){
    let history = getSearchHistory();
    let newHist = [];

    if(history){
        newHist = history.filter(function(item){
            console.log(item);
            return item !== city
        })
    }

    newHist.unshift(city);

    if(newHist.length > 10) newHist.pop();

    localStorage.setItem('history', JSON.stringify(newHist));

    refreshHistoryButtons();
}

function getSearchHistory(){
    const history = JSON.parse(localStorage.getItem('history')) || [];

    return history;
}

function searchSubmitHandler() {
    const search = $('#search-input').val();
    
    // forecastSearch(search);
    if(search){
        forecastSearch(search);
    }
}

function refreshHistoryButtons(){
    const history = JSON.parse(localStorage.getItem('history'));

    $('#history-container').html('');

    if(history){
        history.forEach((item) => {
            const html = `<button class='hist-btn btn btn-primary m-2 col-10'>${item}</button>`;

            $('#history-container').append(html);
        })
    }

    $('.hist-btn').on('click', function(e){
        forecastSearch($(this).html());
    });
}

refreshHistoryButtons();

$('#search-form').submit(function(e){
    e.preventDefault();

    searchSubmitHandler();
});