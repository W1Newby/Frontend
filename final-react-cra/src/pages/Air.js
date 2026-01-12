//setup for charts
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

import { aqiBg } from "../Utils/colors";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

// Turn AQI number into label
function aqiLabel(aqi) {
  if (aqi == null) return "";
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 150) return "Unhealthy (Sensitive)";
  if (aqi <= 200) return "Unhealthy";
  if (aqi <= 300) return "Very Unhealthy";
  return "Hazardous";
}

//rough Beaufort-style label for wind speed (mph)
function beaufortLabel(mph) {
  if (mph == null) return "";
  if (mph < 1) return "Calm";
  if (mph < 4) return "Light air";
  if (mph < 8) return "Light breeze";
  if (mph < 13) return "Gentle breeze";
  if (mph < 19) return "Moderate breeze";
  if (mph < 25) return "Fresh breeze";
  if (mph < 32) return "Strong breeze";
  if (mph < 39) return "Near gale";
  if (mph < 47) return "Gale";
  if (mph < 55) return "Strong gale";
  if (mph < 64) return "Storm";
  return "Hurricane force";
}

export default function Air({ city, air, weather }) {
  const cur = air?.current;
  const aqi = cur?.us_aqi;
  const aqiText = aqiLabel(aqi);

  const weatherCur = weather?.current;
  const wind = weatherCur?.wind_speed_10m;
  const windLabel = beaufortLabel(wind);

  // Pollutants list (TODO give references or something to make this legible for normal people?)
  const pollutants = [
    { key: "pm2_5", label: "PM2.5", unit: "µg/m³" },
    { key: "pm10", label: "PM10", unit: "µg/m³" },
    { key: "ozone", label: "Ozone", unit: "µg/m³" },
    {
      key: "nitrogen_dioxide",
      label: "NO₂",
      unit: "µg/m³",
    },
    {
      key: "sulphur_dioxide",
      label: "SO₂",
      unit: "µg/m³",
    },
    {
      key: "carbon_monoxide",
      label: "CO",
      unit: "µg/m³",
    },
  ];

  const pollutantLabels = pollutants.map((p) => p.label);
  const pollutantValues = pollutants.map((p) => {
    const value = cur?.[p.key];
    return value != null ? value : 0;
  });

  const pollutantChartData = {
    labels: pollutantLabels,
    datasets: [
      {
        label: "Concentration",
        data: pollutantValues,
        borderWidth: 1,
      },
    ],
  };

  const pollutantChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const idx = ctx.dataIndex;
            const p = pollutants[idx];
            const v = ctx.parsed.y;
            if (p && v != null) {
              return `${p.label}: ${v} ${p.unit}`;
            }
            return "";
          },
        },
      },
    },
    scales: {
      x: {
        title: { display: false },
      },
      y: {
        beginAtZero: true,
        title: { display: true, text: "Concentration (µg/m³)" },
      },
    },
  };

  return (
    <>
      <h2 className="mb-2">Air Quality and Wind Speed</h2>
      <p className="text-muted">Selected city: {city.name}</p>

      {/* Top row: AQI and Pollutants */}
      <div className="row g-3 mb-3">
        {/* AQI card, colored background */}
        <div className="col-12 col-md-4">
          <div
            className="card h-100 text-dark"
            style={{ background: aqiBg(aqi) }}
          >
            <div className="card-body">
              <h5 className="card-title">US AQI</h5>
              <p className="display-5 mb-1">{aqi != null ? aqi : "---"}</p>
              <p className="h6 mb-2">{aqiText}</p>
              <p className="text-muted small mb-1">
                0–50 = Good, 51–100 = Moderate, higher values mean more health
                impact, especially for sensitive groups.
              </p>
              <p className="text-muted small mb-0">
                {cur?.time ? `Time: ${cur.time}` : ""}
              </p>
            </div>
          </div>
        </div>

        {/* Pollutants chart */}
        <div className="col-12 col-md-8">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Pollutants</h5>

              {/* Text list for pollutants (FIX ME - Make sense of this data later) */}
              <div className="row">
                <div className="col-12 col-lg-6">
                  <p className="mb-1">
                    PM2.5:{" "}
                    <strong>
                      {cur?.pm2_5 != null ? `${cur.pm2_5} µg/m³` : "---"}
                    </strong>
                  </p>
                  <p className="mb-1">
                    PM10:{" "}
                    <strong>
                      {cur?.pm10 != null ? `${cur.pm10} µg/m³` : "---"}
                    </strong>
                  </p>
                  <p className="mb-1">
                    Ozone:{" "}
                    <strong>
                      {cur?.ozone != null ? `${cur.ozone} µg/m³` : "---"}
                    </strong>
                  </p>
                  <p className="mb-1">
                    NO2:{" "}
                    <strong>
                      {cur?.nitrogen_dioxide != null
                        ? `${cur.nitrogen_dioxide} µg/m³`
                        : "---"}
                    </strong>
                  </p>
                  <p className="mb-1">
                    SO2:{" "}
                    <strong>
                      {cur?.sulphur_dioxide != null
                        ? `${cur.sulphur_dioxide} µg/m³`
                        : "---"}
                    </strong>
                  </p>
                  <p className="mb-0">
                    CO:{" "}
                    <strong>
                      {cur?.carbon_monoxide != null
                        ? `${cur.carbon_monoxide} µg/m³`
                        : "---"}
                    </strong>
                  </p>
                </div>

                {/* bar chart*/}
                <div className="col-12 col-lg-6 mt-3 mt-lg-0">
                  <div
                    className="border rounded bg-light"
                    style={{ height: 220 }}
                  >
                    <Bar
                      data={pollutantChartData}
                      options={pollutantChartOptions}
                    />
                  </div>
                </div>
              </div>

              <p className="text-muted small mt-2 mb-0">
                {/* basic explanation pulled from wikipedia, add more later?*/}
                Fine particles (PM2.5) usually matter most for breathing and
                lung health. Ozone and NO2 also become important on hot, hazy
                days.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Wind card w/ Beaufort explanation */}
      <div className="row g-3">
        {/* Wind summary */}
        <div className="col-12 col-md-5">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Wind</h5>
              <p className="mb-1">
                Speed: <strong>{wind != null ? `${wind} mph` : "---"}</strong>
              </p>
              <p className="mb-2">
                Beaufort: <strong>{windLabel || "---"}</strong>
              </p>
              <p className="text-muted small mb-0">
                Wind affects navigation and how the water feels on open water.
              </p>
            </div>
          </div>
        </div>

        {/* Beaufort explanation*/}
        <div className="col-12 col-md-7">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Wind scale</h5>
              <ul className="small text-muted mb-0">
                <li>Calm: 0–1 mph – water is like glass / mirror</li>
                <li>
                  Light breeze: 4–7 mph – small ripples, no breaking wavelets
                </li>
                <li>
                  Gentle breeze: 8–12 mph – small wavelets, more pronounced but
                  still not breaking much
                </li>
                <li>
                  Moderate breeze: 13–18 mph – larger wavelets, some whitecaps
                  starting
                </li>
                <li>
                  Fresh breeze: 19–24 mph – small waves with frequent whitecaps
                </li>
                <li>
                  Strong breeze: 25–31 mph – moderate waves, lots of whitecaps,
                  some spray
                </li>
                <li>
                  Gale or stronger: 32+ mph – high waves, spindrift, very rough
                  water; extra caution needed
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
