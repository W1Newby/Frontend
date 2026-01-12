//beaufort wind scale with the plain English labels.
//TODO Put the nautical scale descriptors on the wind page.
export function beaufortLabel(mph) {
  if (mph == null || Number.isNaN(mph)) return "No wind data";

  const s = Number(mph);

  if (s < 1) return "Calm";
  if (s < 4) return "Light air";
  if (s < 8) return "Light breeze";
  if (s < 13) return "Gentle breeze";
  if (s < 19) return "Moderate breeze";
  if (s < 25) return "Fresh breeze";
  if (s < 32) return "Strong breeze";
  if (s < 39) return "Near gale";
  if (s < 47) return "Gale";
  if (s < 55) return "Severe gale";
  if (s < 64) return "Storm";

  return "Hurricane-force";
}
