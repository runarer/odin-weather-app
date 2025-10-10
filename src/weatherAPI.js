async function getWeatherDataFromAPI(location) {
  console.log(location);
  try {
    let response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&key=${process.env.API_KEY}&contentType=json`,
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new Error(response.status);
    }
  } catch (err) {
    throw err;
  }
}

async function getOldWeatherDataFromAPI(location, datetime) {
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
}

function prosessWeatherData(json) {
  return json.days.map((day) => {
    return {
      datetime: day.datetime,
      hours: day.hours.map((hour) => {
        return {
          icon: hour.icon,
          temp: hour.temp,
        };
      }),
    };
  });
}

async function getWeatherData(location) {
  try {
    let json = await getWeatherDataFromAPI(location);
    // console.log(json);
    return prosessWeatherData(json);
  } catch (err) {
    throw err;
  }
}

async function getOldWeatherData(location, date) {
  // ISO string is: "YYYY-MM-DDTHH:mm:ss.sssZ"
  let datetime = date.toISOString().substring(0, 10);
  try {
    let json = await getOldWeatherDataFromAPI(location, datetime);
    //console.log(json);
    return prosessWeatherData(json)[0];
  } catch (err) {
    throw err;
  }
}
export { getWeatherData, getOldWeatherData };
