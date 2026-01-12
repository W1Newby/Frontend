//Tides page

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

//Line chart setup.
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

// Turn short tide codes into something readable
function tideTypeLabel(type) {
  if (!type) return "";
  const upper = type.toUpperCase();
  if (upper === "H") return "High";
  if (upper === "L") return "Low";
  return type;
}

//Convert "2025-12-25 04:05" into "04:05 (12/25)"

function formatTideTime(timeString) {
  if (!timeString) return "---";
  // The API gives us "YYYY-MM-DD HH:mm", so replace the space
  // Makes it more legible.
  const d = new Date(timeString.replace(" ", "T"));
  const time = d.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
  const date = d.toLocaleDateString(undefined, {
    month: "2-digit",
    day: "2-digit",
  });
  return `${time} (${date})`;
}

// Short HH:MM labels for the chart X-axis.
function formatShortTime(timeString) {
  if (!timeString) return "";
  const d = new Date(timeString.replace(" ", "T"));
  return d.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function Tides({ city, tides }) {
  // Brief explanation if a city doesn’t have a tide station
  //
  if (!city.noaaStation) {
    return (
      <>
        <h2 className="mb-2">Tides</h2>
        <p className="text-muted">Selected city: {city.name}</p>
        <p className="text-muted">
          There are no measurable tides at this location, so we don&apos;t show
          tide predictions here.
        </p>
      </>
    );
  }
  //FIX (MAKE FAILSAFE FOR WHEN DATA EXISTS BUT FAILS TO LOAD)
  const predictions = tides?.predictions || [];
  const latest = tides?.latest || null;

  if (predictions.length === 0) {
    return (
      <>
        <h2 className="mb-2">Tides</h2>
        <p className="text-muted">Selected city: {city.name}</p>
        <p className="text-muted">
          We couldn't load tide predictions for this station right now. Please
          try again later.
        </p>
      </>
    );
  }

  //Cleanup station name.
  const stationName =
    tides?.stationName || city.noaaName || "NOAA tide station";

  //assume the API gives "next" tide first.
  const nextTide = predictions[0];
  const nextType = tideTypeLabel(nextTide.type);
  const nextTime = formatTideTime(nextTide.t);
  const nextHeight = nextTide.v != null ? `${nextTide.v} ft` : "---";

  // Build chart data from the first few tide predictions
  const chartPoints = predictions.slice(0, 24);
  const chartLabels = chartPoints.map((p) => formatShortTime(p.t));
  const chartValues = chartPoints.map((p) =>
    p.v != null ? Number(p.v) : null
  );

  const tideChartData = {
    labels: chartLabels,
    datasets: [
      {
        label: "Tide height (ft)",
        data: chartValues,
        tension: 0.2,
        borderWidth: 2,
        pointRadius: 2,
      },
    ],
  };

  const tideChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => (ctx.parsed.y != null ? `${ctx.parsed.y} ft` : ""),
        },
      },
    },
    scales: {
      x: {
        title: { display: true, text: "Time" },
        ticks: { maxTicksLimit: 8 },
      },
      y: {
        title: { display: true, text: "Height (ft)" },
        beginAtZero: false,
      },
    },
  };

  return (
    <>
      <h2 className="mb-2">Tides</h2>
      <p className="text-muted">Selected city: {city.name}</p>

      {/* Station info and nexttide */}
      <div className="mb-3">
        <p className="mb-1">
          Station: <strong>{stationName}</strong>
        </p>
        {latest?.v && latest?.t && (
          <p className="mb-0 text-muted small">
            Latest water level: {latest.v} ft at {formatTideTime(latest.t)}
          </p>
        )}
      </div>

      <div className="row g-3 mb-3">
        {/* Next tide card */}
        <div className="col-12 col-md-5">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Next Tide</h5>
              <p className="h4 mb-2">
                {nextType} at {formatTideTime(nextTide.t)}
              </p>
              <p className="mb-2">
                Height: <strong>{nextHeight}</strong>
              </p>
              <p className="text-muted small mb-0">
                Tide heights are relative to the station'ss data. Higher highs
                normally mean stronger currents near peak flow.
              </p>
            </div>
          </div>
        </div>

        {/* Tide chart card */}
        <div className="col-12 col-md-7">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Upcoming Tide Heights</h5>
              <p className="text-muted small mb-2">
                Rough shape of highs and lows over the next few events.
              </p>
              <div className="border rounded bg-light" style={{ height: 260 }}>
                <Line data={tideChartData} options={tideChartOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table of next predictions */}
      <div className="card">
        <div className="card-body">
          <h5 className="card-title mb-3">Next Predictions</h5>
          <div className="table-responsive">
            <table className="table table-sm align-middle mb-0">
              <thead>
                <tr>
                  <th scope="col">Type</th>
                  <th scope="col">Time</th>
                  <th scope="col">Height (ft)</th>
                </tr>
              </thead>
              <tbody>
                {predictions.slice(0, 10).map((p, idx) => (
                  <tr key={`${p.t}-${idx}`}>
                    <td>{tideTypeLabel(p.type)}</td>
                    <td>{formatTideTime(p.t)}</td>
                    <td>{p.v != null ? p.v : "---"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-muted small mt-2 mb-0">
            Always double-check official tide tables and local conditions before
            planning trips. This view is meant for general awareness, not
            navigation.
          </p>
        </div>
      </div>
    </>
  );
}
