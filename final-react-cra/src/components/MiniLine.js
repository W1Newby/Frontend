//line chart (sparkline) for showing quick trends (TODO-Remove these, are they useful?)
// (used for temperature on the home dashboard).

export default function MiniLine({ data = [], height = 34 }) {
  // Less than 2 points, skip drawing.
  if (!data || data.length < 2) return null;

  const width = 120;
  const svgHeight = height;

  // Find the min and max to can scale the line vertically.
  const minValue = Math.min(...data);
  const maxValue = Math.max(...data);
  const range = maxValue - minValue || 1; // prevent divide by 0 errors.

  // Turn the data points into "x,y x,y x,y..."
  const points = data
    .map((value, index) => {
      // Evenly spread points across the width.
      const x = (index / (data.length - 1)) * width;

      const y = svgHeight - ((value - minValue) / range) * svgHeight;

      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={width} height={svgHeight} style={{ display: "block" }}>
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        points={points}
      />
    </svg>
  );
}
