//Color for the dashboard tiles
// tint cards based on temperature, humidity, and air quality

//Clamp function to keep from going past min / max bounds
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

// function for blending numbers/mixing colors.
function lerp(a, b, t) {
  return a + (b - a) * t;
}

//background color for the temperature card.
//
//
//0F and below, cold blue
//90F and above, warm red
//Between 0 and 90 gets a smooth gradient between the two.
//FIX ME--This makes things around 35-50 show pink/warm colors and is misleading, make better?
//Return an rgba() string so to can keep it a little transparent and
//let the card styling show through.
export function tempBg(tempF) {
  // If no number, neutral gray.
  if (tempF == null || Number.isNaN(tempF)) {
    return "rgba(240,240,240,1)";
  }

  // Normalize temperature into the 0–1 range.
  //
  const t = clamp((tempF - 0) / (90 - 0), 0, 1);

  // Blend from blue color to red color.
  const r = Math.round(lerp(40, 220, t));
  const g = Math.round(lerp(90, 60, t));
  const b = Math.round(lerp(200, 60, t));

  //makes more transparent for showing the real data (temp/etc.)
  return `rgba(${r}, ${g}, ${b}, 0.18)`;
}

// Pick a bar color for humidity.
//
// Rough idea:
//   < 30%   dry make yellow
//   30–60%  normal zone make green
//   > 60%   humidzone make blue
export function humidityBarColor(humidityPercent) {
  if (humidityPercent == null) {
    return "rgba(0,0,0,0.2)";
  }

  if (humidityPercent < 30) {
    //dry
    return "rgba(255, 193, 7, 0.8)"; // yellow-ish
  }

  if (humidityPercent < 60) {
    //normal
    return "rgba(25, 135, 84, 0.8)"; // green-ish
  }

  //high
  return "rgba(13, 110, 253, 0.8)"; // blue-ish
}

// Background color for the AQI card on the home page.
//
// Uses the standard US AQI categories:
//   0–50   Good (green)
//   51–100 Moderate (yellow)
//   101–150 Unhealthy for Sensitive Groups (orange)
//   151–200 Unhealthy (red)
//   200+   Very Unhealthy / Hazardous (purple-ish)
//
// transparency function (from temp.)
export function aqiBg(aqi) {
  if (aqi == null || Number.isNaN(aqi)) {
    return "rgba(240,240,240,1)";
  }

  if (aqi <= 50) {
    return "rgba(25, 135, 84, 0.18)"; // green
  }
  if (aqi <= 100) {
    return "rgba(255, 193, 7, 0.18)"; // yellow
  }
  if (aqi <= 150) {
    return "rgba(255, 140, 0, 0.18)"; // orange
  }
  if (aqi <= 200) {
    return "rgba(220, 53, 69, 0.18)"; // red
  }

  // 200+  very unhealthy / hazardous
  return "rgba(111, 66, 193, 0.18)"; // purple
}
