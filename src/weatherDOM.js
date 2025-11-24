import { getWeatherData } from "./weatherAPI";
import images from "./imageLoading";

// Location to display.
let location = "Larvik,Norway";

const locationInput = document.getElementById("input-location");
const weatherDayDate = document.getElementById("weather-day-date");
const weatherDayWeekday = document.getElementById("weather-day-weekday");
let weatherHours = document.querySelector(".weather-hours");

const backwards = document.getElementById("weather-back");
const forwards = document.getElementById("weather-forward");

// API calls back in time cost a lot more, so this stores data
// so that we don't pay going back and forth over allready queried data.
// Older days are appended to the end, from index 15 and so on.
// But the index uses negative values. I should find a better way to do the caching.
let weatherDataCache = undefined;
let dayIndex = 0;

const locationNotFound = () => {
  locationInput.classList.add("weather-location-not-found");
};

const goBackward = () => {
  if (dayIndex > -13) dayIndex--;
  else return;

  updateDisplay();
};

const goForward = () => {
  if (dayIndex < 14) dayIndex++;
  else return;

  updateDisplay();
};

const updateDisplay = async () => {
  if (dayIndex < 0) {
    const newIndex = 14 + Math.abs(dayIndex);
    if (weatherDataCache[newIndex] === undefined) {
      try {
        let date = new Date();
        date.setDate(date.getDate() + dayIndex);
        console.log(date);
        weatherDataCache[newIndex] = await getWeatherData(location, date);
      } catch (err) {
        locationNotFound();
        console.log(err);
        return;
      }
    }
    createWeatherDisplay(weatherDataCache[newIndex]);
  } else {
    createWeatherDisplay(weatherDataCache[dayIndex]);
  }
};

const updateLocation = () => {
  if (locationInput.value === "") locationInput.value = location;
  if (location === locationInput.value) return;

  locationInput.classList.remove("weather-location-not-found");

  dayIndex = 0;
  location = locationInput.value;
  displayWeatherData();
};

const setDate = (datetime) => {
  const date = new Date(datetime);
  let localMonth = date.toLocaleString("default", { month: "long" });
  localMonth = localMonth.replace(/^./, (char) => char.toUpperCase());

  let localWeekday = date.toLocaleString("default", {
    weekday: "long",
  });
  localWeekday = localWeekday.replace(/^./, (char) => char.toUpperCase());

  weatherDayDate.textContent = `${localMonth} ${date.getDate()}`;
  weatherDayWeekday.textContent = localWeekday;
};

const createWeatherTable = (dayData) => {
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
};

const createWeatherDisplay = (weatherData) => {
  // Day and date
  setDate(weatherData.datetime);

  // weather by hour
  const weatherTable = createWeatherTable(weatherData);
  weatherHours.replaceWith(weatherTable);
  weatherHours = weatherTable;
};

const displayWeatherData = async () => {
  try {
    // Get weather data from location
    weatherDataCache = await getWeatherData(location);
    console.log(weatherDataCache);

    // Create html for weather
    createWeatherDisplay(weatherDataCache[dayIndex]);
  } catch (err) {
    console.log(err);
    locationNotFound();
  }
};

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

export { displayWeatherData };
