// bar chart used on the home page to show a quick "shape" of data (REMOVE THIS?)
// (right now: precipitation over the next 24 hours).

export default function MiniBars({ data = [], height = 34 }) {
  // If less than 2 data points, there's not really enough data.
  if (!data || data.length < 2) return null;

  // Hard-coded width for size/consistency.
  const width = 120;
  const svgHeight = height;

  // Use the biggest value, scale off of that.
  const maxValue = Math.max(...data);
  const safeMax = maxValue || 1; // avoids divide by zero errors

  const barWidth = width / data.length;

  return (
    <svg width={width} height={svgHeight} style={{ display: "block" }}>
      {data.map((value, index) => {
        // Normalize each bar's height based on the largest reading.
        const barHeight = (value / safeMax) * svgHeight;

        return (
          <rect
            key={index}
            x={index * barWidth + 1} // a tiny gap on the left for tidiness.
            y={svgHeight - barHeight}
            width={Math.max(1, barWidth - 2)} // space between bars
            height={barHeight}
            fill="currentColor" // card text color decides bar color.
            opacity="0.6"
          />
        );
      })}
    </svg>
  );
}
