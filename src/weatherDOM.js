import { getWeatherData, getOldWeatherData } from "./weatherAPI";
/**
 * Is there a better way to import these images and use them?
 */
import clearDay from "./icons/clear-day.svg";
import clearNight from "./icons/clear-night.svg";
import partlyCloudyDay from "./icons/partly-cloudy-day.svg";
import partlyCloudyNight from "./icons/partly-cloudy-night.svg";
import cloudy from "./icons/cloudy.svg";
import rain from "./icons/rainy-5.svg";

let images = new Map();
images.set("clear-day", clearDay);
images.set("clear-night", clearNight);
images.set("partly-cloudy-day", partlyCloudyDay);
images.set("partly-cloudy-night", partlyCloudyNight);
images.set("cloudy", cloudy);
images.set("rain", rain);

const locationInput = document.getElementById("input-location");
let location = "Larvik,Norway";
const weatherDayDate = document.getElementById("weather-day-date");
const weatherDayWeekday = document.getElementById("weather-day-weekday");
let weatherHours = document.querySelector(".weather-hours");

const backwards = document.getElementById("weather-back");
const forwards = document.getElementById("weather-forward");

let weatherDataCache = undefined;
let dayIndex = 0;

/* Event listeners */
locationInput.addEventListener("focus", locationInput.select);
locationInput.addEventListener("focusout", updateLocation);
locationInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.target.blur();
  }
});

backwards.addEventListener("click", goBackward);
forwards.addEventListener("click", goForward);

function locationNotFound() {
  locationInput.classList.add("weather-location-not-found");
}

function goBackward() {
  if (dayIndex > -13) dayIndex--;
  else return;

  updateDisplay();
}

function goForward() {
  if (dayIndex < 14) dayIndex++;
  else return;

  updateDisplay();
}

async function updateDisplay() {
  if (dayIndex < 0) {
    const newIndex = 14 + Math.abs(dayIndex);
    if (weatherDataCache[newIndex] === undefined) {
      try {
        let date = new Date();
        date.setDate(date.getDate() + dayIndex);
        console.log(date);
        weatherDataCache[newIndex] = await getOldWeatherData(location, date);
      } catch (err) {
        locationNotFound();
        return;
      }
    }
    createWeatherDisplay(weatherDataCache[newIndex]);
  } else {
    createWeatherDisplay(weatherDataCache[dayIndex]);
  }
}

function updateLocation() {
  if (locationInput.value === "") locationInput.value = location;
  if (location === locationInput.value) return;

  locationInput.classList.remove("weather-location-not-found");

  dayIndex = 0;
  location = locationInput.value;
  displayWeatherData();
}

function setDate(datetime) {
  const date = new Date(datetime);
  let localMonth = date.toLocaleString("default", { month: "long" });
  localMonth = localMonth.replace(/^./, (char) => char.toUpperCase());

  let localWeekday = date.toLocaleString("default", {
    weekday: "long",
  });
  localWeekday = localWeekday.replace(/^./, (char) => char.toUpperCase());

  weatherDayDate.textContent = `${localMonth} ${date.getDate()}`;
  weatherDayWeekday.textContent = localWeekday;
}

function createWeatherTable(dayData) {
  const weatherHoursNew = document.createElement("div");
  weatherHoursNew.classList.add("weather-hours");

  dayData.hours.forEach((hour, i) => {
    const weatherHour = document.createElement("div");
    weatherHour.classList.add("weather-hour");

    const weatherHourNumber = document.createElement("div");
    weatherHourNumber.classList.add("weather-hour-number");
    weatherHourNumber.textContent = i < 10 ? "0" + i : i;
    weatherHour.appendChild(weatherHourNumber);

    const weatherIcon = document.createElement("img");
    weatherIcon.src = images.get(hour.icon);
    weatherIcon.alt = hour.icon; // Can be changed with something from the API.
    weatherHour.appendChild(weatherIcon);

    const weatherHourTemp = document.createElement("div");
    weatherHourTemp.classList.add("weather-hour-temp");
    weatherHourTemp.textContent = `${hour.temp}°`;
    if (hour.temp > 0) {
      weatherHourTemp.classList.add("weather-temp-warm");
    } else {
      weatherHourTemp.classList.add("weather-temp-cold");
    }
    weatherHour.appendChild(weatherHourTemp);

    weatherHoursNew.appendChild(weatherHour);
  });
  return weatherHoursNew;
}

function createWeatherDisplay(weatherData) {
  // Day and date
  setDate(weatherData.datetime);

  // weather by hour
  const weatherTable = createWeatherTable(weatherData);
  weatherHours.replaceWith(weatherTable);
  weatherHours = weatherTable;
}

async function displayWeatherData() {
  try {
    // Get weather data from location
    weatherDataCache = await getWeatherData(location);

    // Create html for weather
    createWeatherDisplay(weatherDataCache[dayIndex]);
  } catch (err) {
    locationNotFound();
  }
}

export { displayWeatherData };
