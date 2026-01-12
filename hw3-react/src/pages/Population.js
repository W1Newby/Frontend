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

export default function Population() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    fetchCountries().then((countries) => {
      const labels = countries.map((country) => country.name.common);

      const populations = countries.map((country) => country.population);

      setChartData({
        labels,
        datasets: [
          {
            label: "Population",
            data: populations,
            backgroundColor: "rgba(54, 162, 235, 0.6)",
          },
        ],
      });
    });
  }, []);

  if (!chartData) return null;

  return (
    <>
      <h2 className="mb-3">Population of South American Countries</h2>

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
