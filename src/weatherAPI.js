const getWeatherDataFromAPI = async (location, datetime = null) => {
  console.log(location);
  let call = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&key=${process.env.API_KEY}&contentType=json`;
  try {
    let response = await fetch(call);

    if (response.ok) {
      return await response.json();
    } else {
      throw new Error(response.status);
    }
  } catch (err) {
    throw err;
  }
};

const getOneDayWeatherDataFromAPI = async (location, datetime) => {
  console.log(location);
  try {
    let response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/${datetime}?unitGroup=metric&key=${process.env.API_KEY}&contentType=json`,
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new Error(response.status);
    }
  } catch (err) {
    throw err;
  }
};

const roundToNearestHour = (time) => {
  const [hour, min] = time.split(":", 2).map((x) => parseInt(x)); // Why not just .map(parseInt) ?
  if (min >= 30) return hour + 1;
  return hour;
};

const snowLevel = (snow) => {
  if (snow === null) return 0;
  let mmSnow = parseFloat(snow);
  if (mmSnow == 0) return 0;
  if (mmSnow < 2.0) return 1;
  if (mmSnow < 5.0) return 2;

  return 3;
};

const rainLevel = (rain) => {
  if (rain === null) return 0;
  let mmRain = parseFloat(rain);
  if (mmRain == 0) return 0;
  if (mmRain < 1.5) return 1;
  if (mmRain < 3) return 2;
  return 3;
};

const cloudLevel = (cloudcover) => {
  if (cloudcover === null) return 0;
  let cloudines = parseFloat(cloudcover);
  if (cloudines < 20) return 0;
  if (cloudines < 50) return 1;
  if (cloudines < 70) return 2;
  if (cloudines < 90) return 3;
  return 4;
};

const hasDayAndNight = (day) => {
  // Do the day object have sunrise/sunset
  return Object.hasOwn(day, "sunset") && Object.hasOwn(day, "sunrise");
};

const dayOrNight = (day, hour, latitude) => {
  if (hasDayAndNight(day)) {
    const h = parseInt(hour.datetime.split(":", 1)[0]);
    const sunrise = roundToNearestHour(day.sunrise);
    const sunset = roundToNearestHour(day.sunset);
    return h < sunset && h >= sunrise ? "day" : "night";
  }

  // Midnight sun or darknes.
  const month = parseInt(day.datetime.split("-", 2)[1]);
  const lat = parseInt(latitude);
  if (latitude > 0) {
    //We are in the north
    if (month > 9 || month < 4) {
      return "night";
    }
    return "day";
  } else {
    //We are in the south
    if (month > 9 || month < 4) {
      return "day";
    }
    return "night";
  }
};

const createIconText = (json, day, hour) => {
  // Prefix, is it day night (or cloudy)
  let prefix = dayOrNight(day, hour, json.latitude);
  const cloudcover = cloudLevel(hour.cloudcover);
  if (cloudcover === 4) {
    prefix = "cloudy";
  }

  // Suffix, what is the weather
  let suffix = "clear";
  const snow = snowLevel(hour.snow);
  const rain = rainLevel(hour.precip);
  if (snow != 0) {
    suffix = "snow" + snow;
  } else if (rain != 0) {
    suffix = "rain" + rain;
  } else if (cloudcover > 0) {
    suffix = "cloudy" + cloudcover;
  }
  return `${prefix}_${suffix}`;
};

const prosessWeatherData = (json) => {
  return json.days.map((day) => {
    return {
      datetime: day.datetime,
      hours: day.hours.map((hour) => {
        return {
          temp: hour.temp,
          icon: createIconText(json, day, hour),
        };
      }),
    };
  });
};

const getWeatherData = async (location, date = null) => {
  try {
    if (date == null) {
      let json = await getWeatherDataFromAPI(location);
      return prosessWeatherData(json);
    } else {
      let datetime = date.toISOString().substring(0, 10);
      let json = await getOneDayWeatherDataFromAPI(location, datetime);
      return prosessWeatherData(json)[0];
    }
  } catch (err) {
    throw err;
  }
};

export { getWeatherData };
