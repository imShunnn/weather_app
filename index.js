const apikey = "4adf71ba0e00d7efbe904c6b937fe2ca";
const weatherDataEl = document.getElementById("weather-data");
const locationEl = document.querySelector(".location");
const x = document.getElementById("demo");

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    x.innerHTML = `Latitude: ${lat} <br>Longitude: ${lon}`;

    // Get the nearest city using reverse geocoding and then fetch weather data
    getCityAndWeather(lat, lon);

    //WITH MAP
        // var map = L.map('map').setView([lat, lon], 13);  // Coordinates of London (51.505, -0.09)
    
        //     // Step 3: Add a tile layer (this provides the visual tiles of the map)
        //     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        //         attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        //     }).addTo(map);
    
        //     // Step 4: Add a marker to the specified location
        //     var marker = L.marker([lat, lon]).addTo(map);
    
        //     // Optional: Add popup to the marker
        //     marker.bindPopup("<b>You are Here!</b><br>current location.").openPopup();
    
}


async function getCityAndWeather(lat, lon) {
    try {
        // Reverse geocoding to get city name from latitude and longitude
        const geoResponse = await fetch(`http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apikey}`);
        const geoData = await geoResponse.json();
        const city = geoData[0].name;
        locationEl.textContent = `Location: ${city}`;

        // Fetch weather data for the location
        getWeatherData(lat, lon);
    } catch (error) {
        locationEl.textContent = "Could not retrieve location.";
    }
}

async function getWeatherData(lat, lon) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apikey}&units=metric`);

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const data = await response.json();
        console.log(data);

        const temperature = Math.round(data.main.temp);
        const description = data.weather[0].description;
        const icon = data.weather[0].icon;

        const details = [
            `Feels like: ${Math.round(data.main.feels_like)}°C`,
            `Humidity: ${data.main.humidity}%`,
            `Wind Speed: ${data.wind.speed} m/s`,
        ];

        weatherDataEl.querySelector(".icon").innerHTML = `<img src="http://openweathermap.org/img/wn/${icon}.png" alt="Weather Icon">`;
        weatherDataEl.querySelector(".temperature").textContent = `${temperature}°C`;
        weatherDataEl.querySelector(".description").textContent = description;
        weatherDataEl.querySelector(".details").innerHTML = details.map((detail) => `<div>${detail}</div>`).join("");

    } catch (error) {
        weatherDataEl.querySelector(".icon").innerHTML = "";
        weatherDataEl.querySelector(".temperature").textContent = "";
        weatherDataEl.querySelector(".description").textContent = "An error happened while retrieving weather data.";
        weatherDataEl.querySelector(".details").innerHTML = "";
    }
}

function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            x.innerHTML = "User denied the request for Geolocation.";
            break;
        case error.POSITION_UNAVAILABLE:
            x.innerHTML = "Location information is unavailable.";
            break;
        case error.TIMEOUT:
            x.innerHTML = "The request to get user location timed out.";
            break;
        case error.UNKNOWN_ERROR:
            x.innerHTML = "An unknown error occurred.";
            break;
    }
}