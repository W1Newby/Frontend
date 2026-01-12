//Pull air quality data (US AQI + pollutants) from Open-Meteo's air API

export async function getAirQuality(lat, lon) {
  const url =
    "https://air-quality-api.open-meteo.com/v1/air-quality" +
    `?latitude=${lat}` +
    `&longitude=${lon}` +
    "&current=us_aqi,pm2_5,pm10,ozone,nitrogen_dioxide,sulphur_dioxide,carbon_monoxide" +
    "&timezone=auto";

  const res = await fetch(url);
  const data = await res.json();
  return data;
}
