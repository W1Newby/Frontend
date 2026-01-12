//wrapper around the Open-Meteo geocoding API.
//Turns a text query ("Evansville") into a list of possible locations
//lat, lon, and labels that can be shown as buttons

export async function geocodeCity(name) {
  const url =
    "https://geocoding-api.open-meteo.com/v1/search" +
    `?name=${encodeURIComponent(name)}` +
    "&count=5" +
    "&language=en" +
    "&format=json";

  const res = await fetch(url);
  const data = await res.json();

  return data?.results || [];
}
