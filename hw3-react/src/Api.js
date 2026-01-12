const API_URL = "https://restcountries.com/v3.1/region/south%20america";

export function fetchCountries() {
  return fetch(API_URL).then((res) => res.json());
}
