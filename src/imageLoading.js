/**
 * Is there a better way to import these images and use them?
 */
import day_clear from "./icons/day.svg";
import night_clear from "./icons/night.svg";
import cloudy_cloudy4 from "./icons/cloudy.svg";

import day_cloudy1 from "./icons/cloudy-day-1.svg";
import day_cloudy2 from "./icons/cloudy-day-2.svg";
import day_cloudy3 from "./icons/cloudy-day-3.svg";
import night_cloudy1 from "./icons/cloudy-night-1.svg";
import night_cloudy2 from "./icons/cloudy-night-2.svg";
import night_cloudy3 from "./icons/cloudy-night-3.svg";

import day_rain1 from "./icons/rainy-1.svg";
import day_rain2 from "./icons/rainy-2.svg";
import day_rain3 from "./icons/rainy-3.svg";
import cloudy_rain1 from "./icons/rainy-4.svg";
import cloudy_rain2 from "./icons/rainy-5.svg";
import cloudy_rain3 from "./icons/rainy-6.svg";

import day_snow1 from "./icons/snowy-1.svg";
import day_snow2 from "./icons/snowy-2.svg";
import day_snow3 from "./icons/snowy-3.svg";
import cloudy_snow1 from "./icons/snowy-4.svg";
import cloudy_snow2 from "./icons/snowy-5.svg";
import cloudy_snow3 from "./icons/snowy-6.svg";

let images = new Map();
images.set("day_clear", day_clear);
images.set("night_clear", night_clear);
images.set("cloudy_cloudy4", cloudy_cloudy4);

images.set("day_cloudy1", day_cloudy1);
images.set("day_cloudy2", day_cloudy2);
images.set("day_cloudy3", day_cloudy3);
images.set("night_cloudy1", night_cloudy1);
images.set("night_cloudy2", night_cloudy2);
images.set("night_cloudy3", night_cloudy3);

images.set("day_rain1", day_rain1);
images.set("day_rain2", day_rain2);
images.set("day_rain3", day_rain3);
images.set("night_rain1", cloudy_rain1);
images.set("night_rain2", cloudy_rain2);
images.set("night_rain3", cloudy_rain3);
images.set("cloudy_rain1", cloudy_rain1);
images.set("cloudy_rain2", cloudy_rain2);
images.set("cloudy_rain3", cloudy_rain3);

images.set("day_snow1", day_snow1);
images.set("day_snow2", day_snow2);
images.set("day_snow3", day_snow3);
images.set("night_snow1", cloudy_snow1);
images.set("night_snow2", cloudy_snow2);
images.set("night_snow3", cloudy_snow3);
images.set("cloudy_snow1", cloudy_snow1);
images.set("cloudy_snow2", cloudy_snow2);
images.set("cloudy_snow3", cloudy_snow3);

export default images;
