const appid = '91ea7f389e76582e309295deb4709dea';

async function todaysForecastSearch(search){
    const geoquery = `http://api.openweathermap.org/geo/1.0/direct?q=${search}&limit=1&appid=${appid}`;
    let weatherquery;

    await fetch(geoquery)
    .then(res => res.json())
    .then(result => {
        weatherquery = `https://api.openweathermap.org/data/2.5/onecall?lat=${result[0].lat}&lon=${result[0].lon}&appid=${appid}`;
    })
    .catch(err => {
        console.log(err);
    })

    if(weatherquery){
        await fetch(weatherquery)
        .then(res => res.json())
        .then(result => {
            console.log(result);
        })
        .catch(err => console.log(err));
    }
}

function fiveDayForecastSearch(search){

}

function searchSubmitHandler() {
    const search = $('#search-input').val();
    
    todaysForecastSearch(search);
    fiveDayForecastSearch(search);
}

$('#search-submit').on("click", searchSubmitHandler);