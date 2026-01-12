// NOTE: wind details moved to Air.js
// THIS PAGE: temp, rain, humidity, sun, pressure, and visibility.

import { tempBg, humidityBarColor } from "../Utils/colors";

import { Line, Bar, Doughnut } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  BarElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

// Registering chart pieces.
// (for chart.js + react-chartjs-2.)
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  BarElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
);

//"2025-12-28T07:50" to "07:50" Human readable.
function formatTime(iso) {
  if (!iso) return "---";
  const d = new Date(iso);
  return d.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

//Show day length as "8h 44m"
function formatDayLength(sunriseIso, sunsetIso) {
  if (!sunriseIso || !sunsetIso) return "---";

  const start = new Date(sunriseIso);
  const end = new Date(sunsetIso);
  const ms = end - start;

  if (!isFinite(ms) || ms <= 0) return "---";

  const totalMinutes = Math.round(ms / 60000);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;

  return `${h}h ${m}m`;
}

//Shift the timestamp.
//To approximate “first light” and “last light”.
function shiftMinutes(iso, deltaMinutes) {
  if (!iso) return null;
  const d = new Date(iso);
  d.setMinutes(d.getMinutes() + deltaMinutes);
  return d.toISOString();
}

// Convert a time into a “percent of the day” (0–100).
// Used for day/twilight display bar.
function percentOfDay(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  let mins = d.getHours() * 60 + d.getMinutes();

  if (!isFinite(mins)) return null;

  // clamp to [0, 1440] just in case
  mins = Math.max(0, Math.min(1440, mins));
  return (mins / 1440) * 100;
}

//pressure categories
function pressureBucket(p) {
  if (p == null) return 0;
  if (p < 995) return 0; // very low / stormy
  if (p < 1010) return 1; // unsettled
  if (p < 1030) return 2; // normal
  return 3; // high / very stable
}

export default function Weather({ city, weather }) {
  // If the weather API call hasn’t come back yet, doesn't break the page.
  if (!weather) {
    return (
      <>
        <h2 className="mb-2">Weather</h2>
        <p className="text-muted">Selected city: {city.name}</p>
        <p className="text-muted">Loading weather data...</p>
      </>
    );
  }

  const current = weather.current;

  // Hourly slices – only grab the first 24 points
  const hourlyTemps = weather.hourly?.temperature_2m?.slice(0, 24) || [];
  const hourlyPrecip = weather.hourly?.precipitation?.slice(0, 24) || [];
  const hourlyTimes = weather.hourly?.time?.slice(0, 24) || [];

  // Sun info from the daily part of the API
  const sunriseIso = weather.daily?.sunrise?.[0];
  const sunsetIso = weather.daily?.sunset?.[0];

  const sunriseTime = formatTime(sunriseIso);
  const sunsetTime = formatTime(sunsetIso);
  const dayLength = formatDayLength(sunriseIso, sunsetIso);

  // Rough twilight: 30 minutes before sunrise and after sunset (because this isn't in api)
  const firstLightIso = shiftMinutes(sunriseIso, -30);
  const lastLightIso = shiftMinutes(sunsetIso, 30);

  const firstLightPct = percentOfDay(firstLightIso);
  const sunrisePct = percentOfDay(sunriseIso);
  const sunsetPct = percentOfDay(sunsetIso);
  const lastLightPct = percentOfDay(lastLightIso);

  // “current” values for the cards
  const tempNow = current?.temperature_2m;
  const humNow = current?.relative_humidity_2m;
  const windNow = current?.wind_speed_10m;
  const pressureNow = current?.pressure_msl;
  const visibilityNow = current?.visibility; // meters
  const precipNow = current?.precipitation;

  // converts visibility from meters to miles.
  let visibilityMiles = null;
  if (visibilityNow != null) {
    const miles = visibilityNow / 1609.34;
    visibilityMiles = `${miles.toFixed(1)} mi`;
  }

  //Temp chart
  //hourly time stamps from the API.
  //rounded to nearest hour to look clean
  const tempLabels =
    hourlyTimes.length === hourlyTemps.length && hourlyTimes.length > 0
      ? hourlyTimes.map((iso) => {
          const d = new Date(iso);
          const mins = d.getMinutes();

          // round to nearest hour (>= 30 min move the hour up)
          if (mins >= 30) d.setHours(d.getHours() + 1);
          d.setMinutes(0, 0, 0);

          return d.toLocaleTimeString(undefined, {
            hour: "numeric",
            minute: "2-digit",
          });
        })
      : //fix if array lengths break orgo weird.
        hourlyTemps.map((_, i) => `${i}h`);

  const tempChartData = {
    labels: tempLabels,
    datasets: [
      {
        label: "Temperature (°F)",
        data: hourlyTemps,
        tension: 0.3, //curved line
        borderWidth: 2,
        pointRadius: 0, //no dots
      },
    ],
  };

  const tempChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => (ctx.parsed.y != null ? `${ctx.parsed.y} °F` : ""),
        },
      },
    },
    scales: {
      x: {
        title: { display: true, text: "Time" },
        ticks: { maxTicksLimit: 8 },
      },
      y: {
        title: { display: true, text: "Temperature (°F)" },
        beginAtZero: false,
      },
    },
  };

  //Precipitation
  //(Mostly copied from temp with a few tweaks)
  const precipLabels = tempLabels;
  const precipChartData = {
    labels: precipLabels,
    datasets: [
      {
        label: "Precipitation (in/hr)",
        data: hourlyPrecip,
        borderWidth: 1,
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };

  const precipChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => (ctx.parsed.y != null ? `${ctx.parsed.y} in/hr` : ""),
        },
      },
    },
    scales: {
      x: {
        title: { display: true, text: "Time" },
        ticks: { maxTicksLimit: 8 },
      },
      y: {
        title: { display: true, text: "Precipitation (in/hr)" },
        beginAtZero: true,
      },
    },
  };

  //Pressure - half-circle gauge
  // “normal” sea level pressure window.

  const pressureIndex = pressureBucket(pressureNow);

  const pressureChartData = {
    labels: ["Low", "Unsettled", "Normal", "High"],
    datasets: [
      {
        data: [1, 1, 1, 1], // equal slices
        backgroundColor: [
          pressureIndex === 0 ? "#dc3545" : "#e9ecef",
          pressureIndex === 1 ? "#fd7e14" : "#e9ecef",
          pressureIndex === 2 ? "#198754" : "#e9ecef",
          pressureIndex === 3 ? "#0d6efd" : "#e9ecef",
        ],
        borderWidth: 0,
      },
    ],
  };

  const pressureChartOptions = {
    rotation: -90,
    circumference: 180,
    cutout: "70%",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
  };

  return (
    <>
      <h2 className="mb-2">Weather</h2>
      <p className="text-muted">Selected city: {city.name}</p>

      {/* Top row: Temperature and Precipitation */}
      <div className="row g-3 mb-3">
        {/* Temperature card */}
        <div className="col-12 col-lg-6">
          <div className="card h-100" style={{ background: tempBg(tempNow) }}>
            <div className="card-body">
              <h5 className="card-title">Temperature</h5>
              <p className="display-6 mb-1">
                {tempNow != null ? `${tempNow} °F` : "---"}
              </p>
              <p className="text-muted small mb-2">(next 24 hours)</p>

              <div className="border rounded bg-light" style={{ height: 260 }}>
                <Line data={tempChartData} options={tempChartOptions} />
              </div>
            </div>
          </div>
        </div>

        {/* Precipitation card */}
        <div className="col-12 col-lg-6">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Precipitation</h5>
              <p className="mb-1">
                {precipNow != null ? `${precipNow} in/hr` : "---"}
              </p>
              <p className="text-muted small mb-2">Last / next 24 hours</p>

              <div className="border rounded bg-light" style={{ height: 260 }}>
                <Bar data={precipChartData} options={precipChartOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Middle row: Sunrise / Sunsetand Humidity */}
      <div className="row g-3 mb-3">
        {/* Sunrise / Sunset with fake twilight visualization */}
        <div className="col-12 col-md-6">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Sunrise / Sunset</h5>
              <p className="mb-1">
                First light (approx):{" "}
                <strong>{formatTime(firstLightIso)}</strong>
              </p>
              <p className="mb-1">
                Sunrise: <strong>{sunriseTime}</strong>
              </p>
              <p className="mb-1">
                Sunset: <strong>{sunsetTime}</strong>
              </p>
              <p className="mb-1">
                Last light (approx): <strong>{formatTime(lastLightIso)}</strong>
              </p>
              <p className="text-muted mb-2">Day length: {dayLength}</p>

              {/* Gradient bar: night/dawn/full day/dusk/night */}
              {firstLightPct != null &&
                sunrisePct != null &&
                sunsetPct != null &&
                lastLightPct != null && (
                  <>
                    <div
                      style={{
                        height: 24,
                        borderRadius: 999,
                        overflow: "hidden",
                        background: `linear-gradient(to right,
                          #000 0%,
                          #000 ${firstLightPct}%,
                          #555 ${firstLightPct}%,
                          #555 ${sunrisePct}%,
                          #fff ${sunrisePct}%,
                          #fff ${sunsetPct}%,
                          #555 ${sunsetPct}%,
                          #555 ${lastLightPct}%,
                          #000 ${lastLightPct}%,
                          #000 100%
                        )`,
                      }}
                    />
                    <div className="d-flex justify-content-between mt-1 small text-muted">
                      <span>00:00</span>
                      <span>06:00</span>
                      <span>12:00</span>
                      <span>18:00</span>
                      <span>24:00</span>
                    </div>
                    <p className="text-muted small mt-2 mb-0">
                      THIS CHART PROVIDES A SIMULATED/ESTIMATED TWILIGHT. THESE
                      VALUES ARE NOT PULLED FROM REAL DATA. Twilight can last
                      between ~24 and 50 minutes depending on latitude and
                      season. It’s usually safer to aim to be off the water by
                      the start of twilight to give yourself some buffer.
                    </p>
                  </>
                )}
            </div>
          </div>
        </div>

        {/* Humidity – (progress bar, make better later if possible)*/}
        <div className="col-12 col-md-6">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Humidity</h5>
              <p className="mb-2">{humNow != null ? `${humNow}%` : "---"}</p>
              <div className="progress mb-2" style={{ height: 14 }}>
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
              <p className="text-muted small mb-0">
                Higher humidity usually feels “heavier” and can make warm temps
                feel hotter.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom row: Wind, Pressuregauge, Visbility */}
      <div className="row g-3">
        {/* Wind*/}
        <div className="col-12 col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Wind</h5>
              <p className="mb-1">
                {windNow != null ? `${windNow} mph` : "---"}
              </p>
              <p className="text-muted small mb-0">
                For Beaufort-scale details check Air page.
              </p>
            </div>
          </div>
        </div>

        {/* Pressure, half-circle gauge */}
        <div className="col-12 col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Pressure</h5>

              <p className="mb-1">
                {pressureNow != null ? `${pressureNow} hPa` : "---"}
              </p>

              <div style={{ height: 120 }}>
                <Doughnut
                  key={pressureIndex}
                  data={pressureChartData}
                  options={pressureChartOptions}
                />
              </div>

              <p className="text-muted small mt-2 mb-0">
                {pressureIndex === 0 &&
                  "Very low pressure (stormy conditions likely)"}
                {pressureIndex === 1 && "Falling or unsettled pressure"}
                {pressureIndex === 2 && "Normal pressure (generally fair)"}
                {pressureIndex === 3 && "High pressure (stable conditions)"}
              </p>
            </div>
          </div>
        </div>

        {/* Visibility – in miles, ADD VISUALIZATION LATER IF POSSIBLE  */}
        {/*If no visual, a reference like x is y miles from z to help give a baseline. */}
        <div className="col-12 col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Visibility</h5>
              <p className="mb-1">
                {visibilityMiles ||
                  (visibilityNow != null ? `${visibilityNow} m` : "---")}
              </p>
              <p className="text-muted small mb-0">
                Visibility is how far you can clearly see a big object in the
                distance. Lower visibility usually goes with fog, heavy rain, or
                smoke. (For reference, Mt. Hood is ~70 miles from the PSU
                campus.)
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
