//river data: flow and stage charts (ADD MORE LATER?  Water Temp???)

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

// The usual chart.js line chart.
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

// TODO FIX THIS?
//Show arrows for the trend text.
//
function trendArrow(trend) {
  if (trend === "rising") return "↑";
  if (trend === "falling") return "↓";
  if (trend === "steady") return "→";
  return "";
}

export default function River({ city, river }) {
  // If no river data at all (no gage within 50 miles, etc),
  // just show a friendly message instead of an empty / broken page.
  //TODO--This is broken somewhere, for the custom cities, fix.
  if (!river) {
    return (
      <>
        <h2 className="mb-2">River</h2>
        <p className="text-muted">Selected city: {city.name}</p>
        <p className="text-muted">
          There&apos;s no usable USGS river gage within range for this location,
          so we can&apos;t show live flow or stage here.
        </p>
      </>
    );
  }

  // Current "snapshot" values, already prepared in api/river.js
  const flow = river.discharge;
  const stage = river.gageHeight;

  //
  const recentDischarge =
    river.recentDischarge || river.recent?.discharge || [];

  const recentStage = river.recentGageHeight || river.recent?.gageHeight || [];

  //Flow chart
  const flowLabels = recentDischarge.map((point) => {
    const d = new Date(point.time);
    return d.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    });
  });

  const flowValues = recentDischarge.map((point) => point.value);
  //Very similar to temp/precip.
  const flowChartData = {
    labels: flowLabels,
    datasets: [
      {
        label: "Flow",
        data: flowValues,
        tension: 0.2, //slight curve (from temp/precip)
        borderWidth: 2,
        pointRadius: 0, // no dots (from temp/precip)
      },
    ],
  };

  const flowChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          //ADD LATER: units in the tooltip, if availble.
          label: (ctx) =>
            ctx.parsed.y != null ? `${ctx.parsed.y} ${flow?.unit || ""}` : "",
        },
      },
    },
    scales: {
      x: {
        title: { display: true, text: "Time" },
        ticks: { maxTicksLimit: 6 },
      },
      y: {
        title: {
          display: true,
          text: `Flow (${flow?.unit || "units"})`,
        },
        beginAtZero: false,
      },
    },
  };

  //Rivr Stage
  const stageLabels = recentStage.map((point) => {
    const d = new Date(point.time);
    return d.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    });
  });

  const stageValues = recentStage.map((point) => point.value);

  const stageChartData = {
    labels: stageLabels,
    datasets: [
      {
        label: "Stage",
        data: stageValues,
        tension: 0.2,
        borderWidth: 2,
        pointRadius: 0,
      },
    ],
  };

  const stageChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) =>
            ctx.parsed.y != null ? `${ctx.parsed.y} ${stage?.unit || ""}` : "",
        },
      },
    },
    scales: {
      x: {
        title: { display: true, text: "Time" },
        ticks: { maxTicksLimit: 6 },
      },
      y: {
        title: {
          display: true,
          text: `Stage (${stage?.unit || "units"})`,
        },
        beginAtZero: false,
      },
    },
  };

  //Station data
  const stationName =
    river.stationName || city.usgsName || "Unknown USGS station";

  const riverName = river.riverName || null;

  return (
    <>
      <h2 className="mb-2">River</h2>
      <p className="text-muted">Selected city: {city.name}</p>

      {/* Station header */}
      <div className="mb-3">
        <p className="mb-1">
          Station: <strong>{stationName}</strong>
        </p>
        {riverName && (
          <p className="mb-0 text-muted small">River: {riverName}</p>
        )}
      </div>

      <div className="row g-3">
        {/* Flow summary and chart */}
        <div className="col-12 col-md-6">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Flow</h5>

              <p className="h4 mb-1">
                {flow?.value != null
                  ? `${flow.value} ${flow.unit || ""}`
                  : "---"}{" "}
                <span className="ms-2">
                  {trendArrow(flow?.trend)}{" "}
                  <span className="text-muted small">
                    {flow?.trend === "rising" && "(rising)"}
                    {flow?.trend === "falling" && "(falling)"}
                    {flow?.trend === "steady" && "(steady)"}
                  </span>
                </span>
              </p>

              <p className="text-muted small mb-2">
                {flow?.time ? `Last update: ${flow.time}` : ""}
              </p>
              {/* explanation reference*/}
              <p className="text-muted small mb-2">
                Flow indicates how much water is moving past the gage. Higher
                values usually mean faster current and more powerful river
                conditions.
              </p>

              <div className="border rounded bg-light" style={{ height: 220 }}>
                {recentDischarge.length > 1 ? (
                  <Line data={flowChartData} options={flowChartOptions} />
                ) : (
                  <div className="text-muted d-flex h-100 align-items-center justify-content-center small">
                    Not enough recent points to draw a trend.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stage summary and chart */}
        <div className="col-12 col-md-6">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Stage (Gage Height)</h5>

              <p className="h4 mb-1">
                {stage?.value != null
                  ? `${stage.value} ${stage.unit || ""}`
                  : "---"}{" "}
                <span className="ms-2">
                  {trendArrow(stage?.trend)}{" "}
                  <span className="text-muted small">
                    {stage?.trend === "rising" && "(rising)"}
                    {stage?.trend === "falling" && "(falling)"}
                    {stage?.trend === "steady" && "(steady)"}
                  </span>
                </span>
              </p>

              <p className="text-muted small mb-2">
                {stage?.time ? `Last update: ${stage.time}` : ""}
              </p>

              <p className="text-muted small mb-2">
                Stage is how high the water is at the gage. Local flood stages
                depend on the specific river and location.
              </p>

              <div className="border rounded bg-light" style={{ height: 220 }}>
                {recentStage.length > 1 ? (
                  <Line data={stageChartData} options={stageChartOptions} />
                ) : (
                  <div className="text-muted d-flex h-100 align-items-center justify-content-center small">
                    Not enough recent points to draw a trend.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
