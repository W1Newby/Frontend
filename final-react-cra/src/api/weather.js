//weather api page
//URL to pull data from open-meteo.
const BASE_URL = "https://api.open-meteo.com/v1/forecast";

export async function getWeather(lat, lon) {
  const url =
    `${BASE_URL}?latitude=${lat}&longitude=${lon}` +
    //want in "current"
    "&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,pressure_msl,visibility" +
    //sunrise/sunset data
    "&daily=sunrise,sunset" +
    //HOURLY data for mini charts (may not use)
    "&hourly=temperature_2m,precipitation,relative_humidity_2m,wind_speed_10m" +
    //pull preferred units
    "&temperature_unit=fahrenheit" +
    "&wind_speed_unit=mph" +
    "&precipitation_unit=inch" +
    "&timezone=auto";

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Weather API error: " + res.status);
  }
  const data = await res.json();
  return data;
}
