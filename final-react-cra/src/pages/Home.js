//initially used small line chart to show temp rise/fall, but it wasn't so useful.
//import MiniLine from "../components/MiniLine";
//using minibars to show change over time for precipitation and maybe wind--REVIEW.
import MiniBars from "../components/MiniBars";

//color helpers in Utils file.
import { tempBg, humidityBarColor, aqiBg } from "../Utils/colors";
import { beaufortLabel } from "../Utils/wind";

//
// "WILLAMETTE RIVER AT PORTLAND, OR" into "WILLAMETTE RIVER @ PORTLAND, OR"

function formatStationName(name) {
  if (!name) return "";
  const idx = name.toLowerCase().indexOf(" at ");
  if (idx !== -1) {
    const river = name.slice(0, idx);
    const loc = name.slice(idx + 4);
    return `${river} @ ${loc}`;
  }
  return name;
}
//cleanup function.
// From "2025-12-28T07:50" to "07:50"
function formatIsoTime(iso) {
  if (!iso) return "---";
  const parts = iso.split("T");
  if (parts.length < 2) return iso;
  return parts[1].slice(0, 5); // HH:MM
}

// cleanup function.
//NOAA gives tide times like "2025-12-25 04:05"
//shows time and a short date (MM/DD) on the tile.
function formatTideTime(tStr) {
  if (!tStr) return { time: "---", date: "" };
  const [datePart, timePart] = tStr.split(" ");
  if (!datePart || !timePart) {
    return { time: tStr, date: "" };
  }
  const [year, month, day] = datePart.split("-");
  const shortDate = month && day ? `${month}/${day}` : datePart;
  return { time: timePart, date: shortDate };
}

//helper for makign aqi friendlier with categories and references.
function aqiLabelHome(aqi) {
  if (aqi == null) return "";
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 150) return "Unhealthy (Sensitive)";
  if (aqi <= 200) return "Unhealthy";
  if (aqi <= 300) return "Very Unhealthy";
  return "Hazardous";
}

/* 

//debugging function
function debugRiver(river) {
  if (!river) return null;
  console.log("river in Home:", river);
  return null;
}
*/

export default function Home({ city, weather, river, tides, air }) {
  // grab a small slice of the hourly data for tiny charts (if present)
  const hourlyTemps = weather?.hourly?.temperature_2m?.slice(0, 24) || [];
  const hourlyPrecip = weather?.hourly?.precipitation?.slice(0, 24) || [];
  const hourlyHum = weather?.hourly?.relative_humidity_2m?.slice(0, 24) || []; //REVIEW - use later??
  const hourlyWind = weather?.hourly?.wind_speed_10m?.slice(0, 24) || []; //REVIEW - also for later??

  const current = weather?.current;

  // these “Now” values for tiles, and color references
  const tempNow = current?.temperature_2m;
  const humNow = current?.relative_humidity_2m;

  // raw times from the API
  const sunriseRaw = weather?.daily?.sunrise?.[0];
  const sunsetRaw = weather?.daily?.sunset?.[0];
  // formatted versions for tile
  const sunrise = formatIsoTime(sunriseRaw);
  const sunset = formatIsoTime(sunsetRaw);

  // tide info only shows the next prediction on home page
  const nextTide = tides?.predictions?.[0];
  const tideTimeInfo = nextTide ? formatTideTime(nextTide.t) : null;
  const latestWl = tides?.latest;

  // AQI basics for the air tile
  const aqi = air?.current?.us_aqi;
  //const pm25 = air?.current?.pm2_5; //REVIEW
  const aqiText = aqiLabelHome(aqi);

  // calling debugging function
  // debugRiver(river);

  return (
    <>
      <h2 className="mb-2">River Conditions</h2>
      <p className="text-muted">Selected city: {city.name}</p>

      <div className="row g-3">
        {/* Temp – color comes from tempBg helper */}
        <div className="col-12 col-md-4">
          <div className="card h-100" style={{ background: tempBg(tempNow) }}>
            <div className="card-body">
              <h6 className="card-title">Temperature</h6>
              <p className="mb-0">
                {current ? `${current.temperature_2m} °F` : "---"}
              </p>
            </div>
          </div>
        </div>

        {/* Precipitation w/ tiny bar chart underneath//kinda useless but keep for now */}
        <div className="col-12 col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <h6 className="card-title">Precipitation</h6>
              <p className="mb-0">
                {current ? `${current.precipitation} in` : "---"}
              </p>

              <div className="text-muted mt-2">
                <MiniBars data={hourlyPrecip} />
              </div>
            </div>
          </div>
        </div>

        {/* Humidity – progress bar with a color that changes based on percentage*/}
        <div className="col-12 col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <h6 className="card-title">Humidity</h6>
              <p className="mb-2">{humNow != null ? `${humNow}%` : "---"}</p>

              <div className="progress" style={{ height: 10 }}>
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{
                    width: humNow != null ? `${humNow}%` : "0%",
                    backgroundColor: humidityBarColor(humNow),
                  }}
                  aria-valuenow={humNow || 0}
                  aria-valuemin="0"
                  aria-valuemax="100"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Air Quality, AQI number and short label, background color from aqiBg */}
        <div className="col-12 col-md-4">
          <div className="card h-100" style={{ background: aqiBg(aqi) }}>
            <div className="card-body">
              <h6 className="card-title">Air Quality</h6>
              <p className="mb-1">
                AQI: <strong>{aqi != null ? aqi : "---"}</strong>
                {aqiText && (
                  <span className="text-muted ms-2">({aqiText})</span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Tides – for non-tidal locations, shows a "no tide data" type message instead */}
        <div className="col-12 col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <h6 className="card-title">Tides</h6>

              {!city.noaaStation ? (
                <p className="text-muted small mb-0">
                  There are no measurable tides at this location.
                </p>
              ) : (
                <>
                  <p className="mb-1">
                    Next:{" "}
                    <strong>
                      {nextTide && tideTimeInfo
                        ? `${nextTide.type} at ${tideTimeInfo.time} (${tideTimeInfo.date})`
                        : "---"}
                    </strong>
                  </p>
                  <p className="text-muted small mb-0">
                    {nextTide?.v != null ? `Height: ${nextTide.v} ft` : ""}
                    {latestWl?.v
                      ? `${nextTide?.v != null ? " • " : ""}Current: ${
                          latestWl.v
                        } ft`
                      : ""}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Sunrise / Sunset – just times, no charts*/}
        <div className="col-12 col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <h6 className="card-title">Sunrise / Sunset</h6>
              <p className="mb-1">
                Sunrise: <strong>{sunrise || "---"}</strong>
              </p>
              <p className="mb-0">
                Sunset: <strong>{sunset || "---"}</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Wind – speed & Beaufort label (details in Air page) */}
        <div className="col-12 col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <h6 className="card-title">Wind</h6>
              <p className="mb-1">
                {current ? `${current.wind_speed_10m} mph` : "---"}
              </p>
              <p className="text-muted small mb-0">
                {current ? beaufortLabel(current.wind_speed_10m) : ""}
              </p>
            </div>
          </div>
        </div>

        {/* River Flow – value and trend arrows if there's data */}
        <div className="col-12 col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <h6 className="card-title">River Flow</h6>

              {river?.discharge ? (
                <>
                  <p className="mb-0">
                    {river.discharge.value} {river.discharge.unit || "ft3/s"}{" "}
                    {river.discharge.trend === "up" && <span>▲</span>}
                    {river.discharge.trend === "down" && <span>▼</span>}
                    {river.discharge.trend === "steady" && <span>▬</span>}
                  </p>
                  <p className="text-muted small mb-0">
                    {river.discharge.time || ""}
                  </p>
                </>
              ) : (
                <p className="text-muted mb-0">
                  No nearby river data (≤ 50 miles)
                </p>
              )}
            </div>
          </div>
        </div>

        {/* River Stage –  works like flow with station name if there is one */}
        <div className="col-12 col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <h6 className="card-title">River Stage</h6>

              {river?.gageHeight ? (
                <>
                  <p className="mb-0">
                    {river.gageHeight.value} {river.gageHeight.unit || "ft"}{" "}
                    {river.gageHeight.trend === "up" && <span>▲</span>}
                    {river.gageHeight.trend === "down" && <span>▼</span>}
                    {river.gageHeight.trend === "steady" && <span>▬</span>}
                  </p>
                  <p className="text-muted small mb-0">
                    {river.gageHeight.time || ""}
                  </p>
                  {city.usgsName && (
                    <p className="text-muted small mb-0">
                      {formatStationName(city.usgsName)}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-muted mb-0">
                  No nearby river data (≤ 50 miles)
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
