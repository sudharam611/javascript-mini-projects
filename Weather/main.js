const apiKey = "18d4438187ea6be83ce01f0f5138e0d0";
const apiUrl =
  "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const formEl = document.getElementById("form");
const searchInput = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");

async function checkWeather(city) {
  const response = await fetch(apiUrl + city + `&appid=${apiKey}`);

  if (response.status == 404) {
    document.querySelector(".error-box").style.display = "flex";
    document.querySelector(".weather").style.display = "none";
    setTimeout(function () {
      document.querySelector(".error-box").style.display = "none";
      searchInput.value = "";
    }, 2000);
  } else {
    const data = await response.json();
    console.log(data);
    document.querySelector(".city-name").innerHTML = data.name;
    document.querySelector(".temperature").innerHTML =
      Math.round(data.main.temp) + `<sup>&deg;C</sup>`;
    document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
    document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";
    document.querySelector(".weather-name").innerHTML =
      data.weather[0].description.toUpperCase();
    weatherIcon.src = `images/${data.weather[0].main}.png`;

    document.querySelector(".weather").style.display = "block";
    document.querySelector(".error-box").style.display = "none";
    searchInput.value = "";
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log(searchInput.value);
  checkWeather(searchInput.value);
});
