import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { fetchCountries } from "../Api";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function Custom() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    fetchCountries().then((countries) => {
      const sortedCountries = [...countries].sort(
        (a, b) => (b.area || 0) - (a.area || 0)
      );

      const labels = sortedCountries.map((country) => country.name.common);

      const areas = sortedCountries.map((country) => country.area);

      setChartData({
        labels,
        datasets: [
          {
            label: "Area (km²)",
            data: areas,
            backgroundColor: "rgba(153, 102, 255, 0.6)",
          },
        ],
      });
    });
  }, []);

  if (!chartData) return null;

  return (
    <>
      <h2 className="mb-3">Area of South American Countries</h2>

      <div style={{ height: "500px" }}>
        <Bar
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
          }}
        />
      </div>
    </>
  );
}
