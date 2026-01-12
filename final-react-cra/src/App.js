// Main file for "River Watch" application.
// Has React Router, the navbar, and all the API calls for the selected city.

import { useState, useEffect } from "react";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";

import Home from "./pages/Home";
import Weather from "./pages/Weather";
import River from "./pages/River";
import Tides from "./pages/Tides";
import Air from "./pages/Air";

import { cities } from "./data/cities";

// separate API files for specific categories
import { getWeather } from "./api/weather";
import {
  getRiver,
  readLatestRiverValues,
  findNearestRiverSite,
} from "./api/river";
import { getTides, findNearestTideStation } from "./api/tides";
import { getAirQuality } from "./api/air";
import { geocodeCity } from "./api/geocode";

export default function App() {
  // all the data that depends on the currently selected city
  const [weatherData, setWeatherData] = useState(null);
  const [riverData, setRiverData] = useState(null);
  const [tidesData, setTidesData] = useState(null);
  const [airData, setAirData] = useState(null);

  // which city is “active” and what’s in the search boxes
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCityId, setSelectedCityId] = useState(cities[0].id);

  // user-added cities from the geocoding search
  const [customCities, setCustomCities] = useState([]);

  // Add city search box and results
  const [cityQuery, setCityQuery] = useState("");
  const [geoMatches, setGeoMatches] = useState([]);

  // built-in cities and any custom cities that were added
  const allCities = [...cities, ...customCities];

  // dropdown filter for the top-right select box
  const filteredCities = allCities.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // if the selected id disappears, falls back to the first city
  const selectedCity =
    allCities.find((c) => c.id === selectedCityId) || allCities[0];

  // Weather
  useEffect(() => {
    // simple guard in case something is weird
    if (!selectedCity) return;

    getWeather(selectedCity.lat, selectedCity.lon).then((data) => {
      setWeatherData(data);
    });
  }, [selectedCity]);

  // River (USGS data)
  useEffect(() => {
    // if we don’t have a site id (yet), just clear the river data
    if (!selectedCity?.usgsSite) {
      setRiverData(null);
      return;
    }

    getRiver(selectedCity.usgsSite).then((data) => {
      setRiverData(readLatestRiverValues(data));
    });
  }, [selectedCity]);

  // Try to auto-discover a nearby USGS river site for custom cities only.
  //BROKEN - FIX IF POSSIBLE.
  useEffect(() => {
    if (!selectedCity) return;

    // only auto-fill sites for custom cities (so we don’t overwrite the hard-coded ones)
    if (!selectedCity.isCustom) return;

    // if already have a site, nothing to do here
    if (selectedCity.usgsSite) return;

    let cancelled = false;

    findNearestRiverSite(selectedCity.lat, selectedCity.lon, 50)
      .then((site) => {
        if (!site || cancelled) return;

        // update city inside customCities with the found site + name
        setCustomCities((prev) =>
          prev.map((c) =>
            c.id === selectedCity.id
              ? { ...c, usgsSite: site.id, usgsName: site.name }
              : c
          )
        );
      })
      .catch((err) => {
        console.error("Nearest river site error:", err);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedCity, setCustomCities]);

  // Tides (NOAA)
  useEffect(() => {
    if (!selectedCity?.noaaStation) {
      setTidesData(null);
      return;
    }

    getTides(selectedCity.noaaStation).then((data) => {
      setTidesData(data);
    });
  }, [selectedCity]);

  // Try to auto-discover nearby tide + river stations for custom cities.
  // NOT WORKING -> FIX LATER.
  useEffect(() => {
    const city = selectedCity;
    if (!city) return;

    // only for custom cities
    if (!city.isCustom) return;

    // no additional api calls if both stations are present
    if (city.usgsSite && city.noaaStation) return;

    async function hydrateStations() {
      try {
        const [riverSite, tideStation] = await Promise.all([
          !city.usgsSite ? findNearestRiverSite(city.lat, city.lon, 50) : null,
          !city.noaaStation
            ? findNearestTideStation(city.lat, city.lon, 50)
            : null,
        ]);

        if (!riverSite && !tideStation) return;

        // update city with data that's returned.
        setCustomCities((prev) =>
          prev.map((c) =>
            c.id === city.id
              ? {
                  ...c,
                  usgsSite: riverSite?.id ?? c.usgsSite,
                  usgsName: riverSite?.name ?? c.usgsName,
                  noaaStation: tideStation?.id ?? c.noaaStation,
                  noaaName: tideStation?.name ?? c.noaaName,
                }
              : c
          )
        );
      } catch (err) {
        console.error("Error finding nearby stations", err);
      }
    }

    hydrateStations();
  }, [selectedCity, setCustomCities]);

  //Air Quality
  useEffect(() => {
    if (!selectedCity) return;

    getAirQuality(selectedCity.lat, selectedCity.lon).then((data) => {
      setAirData(data);
    });
  }, [selectedCity]);

  return (
    <Router>
      {/* Top Nav Bar */}
      <nav className="navbar navbar-dark bg-dark px-4">
        <span className="navbar-brand fw-bold">River Watch</span>

        {/* left side nav links for each page */}
        <div className="navbar-nav flex-row gap-3">
          <NavLink className="nav-link" to="/">
            Home
          </NavLink>
          <NavLink className="nav-link" to="/weather">
            Weather
          </NavLink>
          <NavLink className="nav-link" to="/river">
            River
          </NavLink>
          <NavLink className="nav-link" to="/tides">
            Tides
          </NavLink>
          <NavLink className="nav-link" to="/air">
            Air
          </NavLink>
        </div>

        {/* middle: add-a-city */}
        <form
          className="d-flex gap-2 ms-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (!cityQuery.trim()) return;

            geocodeCity(cityQuery.trim()).then((results) => {
              setGeoMatches(results);
            });
          }}
        >
          <input
            className="form-control form-control-sm"
            style={{ width: 200 }}
            placeholder="Add a city..."
            value={cityQuery}
            onChange={(e) => setCityQuery(e.target.value)}
          />
          <button className="btn btn-sm btn-outline-light" type="submit">
            Find
          </button>
        </form>

        {/* right side search filter and dropdown */}
        <div className="ms-auto d-flex gap-2" style={{ minWidth: 360 }}>
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="Search city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            className="form-select form-select-sm"
            value={selectedCityId}
            onChange={(e) => setSelectedCityId(e.target.value)}
          >
            {filteredCities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </nav>

      {/* let the user select which city when there are multiple */}
      {geoMatches.length > 0 && (
        <div className="container mt-3">
          <div className="card">
            <div className="card-body">
              <h6 className="mb-2">Pick a location:</h6>

              <div className="d-flex flex-wrap gap-2">
                {geoMatches.map((r) => {
                  const label = `${r.name}${r.admin1 ? ", " + r.admin1 : ""}${
                    r.country ? ", " + r.country : ""
                  }`;

                  return (
                    <button
                      key={`${label}-${r.latitude}-${r.longitude}`}
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => {
                        const newId = `${r.name}-${r.latitude}-${r.longitude}`
                          .replaceAll(" ", "-")
                          .toLowerCase();

                        const newCity = {
                          id: newId,
                          name: label,
                          lat: r.latitude,
                          lon: r.longitude,
                          usgsSite: null,
                          noaaStation: null,
                          usgsName: null,
                          noaaName: null,
                          isCustom: true,
                        };

                        // doesn't add duplicates
                        setCustomCities((prev) => {
                          const already = allCities.some((c) => c.id === newId);
                          return already ? prev : [...prev, newCity];
                        });

                        setSelectedCityId(newId);
                        setGeoMatches([]);
                        setCityQuery("");
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              <button
                className="btn btn-sm btn-link mt-2"
                onClick={() => setGeoMatches([])}
              >
                close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main content w/ bootstrap wrappers */}
      <main className="container py-4">
        <div className="card shadow-sm">
          <div className="card-body">
            <Routes>
              <Route
                path="/"
                element={
                  <Home
                    city={selectedCity}
                    weather={weatherData}
                    river={riverData}
                    tides={tidesData}
                    air={airData}
                  />
                }
              />
              <Route
                path="/weather"
                element={<Weather city={selectedCity} weather={weatherData} />}
              />
              <Route
                path="/river"
                element={<River city={selectedCity} river={riverData} />}
              />
              <Route
                path="/tides"
                element={<Tides city={selectedCity} tides={tidesData} />}
              />
              <Route
                path="/air"
                element={
                  <Air
                    city={selectedCity}
                    air={airData}
                    weather={weatherData}
                  />
                }
              />
            </Routes>
          </div>
        </div>
      </main>
    </Router>
  );
}
