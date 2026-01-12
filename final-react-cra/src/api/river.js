// Helpers for talking to USGS river gage data.
// return a smaller object that the river and Home pages can use easily

function distanceMiles(lat1, lon1, lat2, lon2) {
  const R = 3958.8; // miles
  const toRad = (deg) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

//Fetch river times for a USGS site
export async function getRiver(siteId) {
  if (!siteId) return null;

  const url =
    "https://waterservices.usgs.gov/nwis/iv/?" +
    `sites=${siteId}` +
    "&parameterCd=00060,00065" + // discharge + gage height
    "&siteStatus=all" +
    "&format=json";

  const res = await fetch(url);
  if (!res.ok) {
    console.error("USGS iv error", res.status);
    return null;
  }

  return res.json();
}

//make JSON into nicer shape with trend arrows
export function readLatestRiverValues(json) {
  if (!json || !json.value || !Array.isArray(json.value.timeSeries)) {
    return null;
  }

  const series = json.value.timeSeries;

  let discharge = null;
  let gageHeight = null;

  for (const ts of series) {
    const variableCode = ts.variable?.variableCode?.[0]?.value;
    const points = ts.values?.[0]?.value || [];
    if (points.length === 0) continue;

    const last = points[points.length - 1];
    const prev = points.length > 1 ? points[points.length - 2] : null;

    const latestValue = parseFloat(last.value);
    const prevValue = prev ? parseFloat(prev.value) : null;

    let trend = "steady";
    if (prevValue != null) {
      if (latestValue > prevValue) trend = "up";
      else if (latestValue < prevValue) trend = "down";
    }

    const entry = {
      value: isNaN(latestValue) ? null : latestValue,
      time: last.dateTime || "",
      trend,
      unit: ts.variable?.unit?.unitCode || "",
    };

    if (variableCode === "00060") {
      discharge = entry;
    } else if (variableCode === "00065") {
      gageHeight = entry;
    }
  }

  if (!discharge && !gageHeight) return null;

  return { discharge, gageHeight };
}

//Nearest stream gage within radiusMiles
export async function findNearestRiverSite(lat, lon, radiusMiles = 50) {
  const url =
    "https://waterservices.usgs.gov/nwis/site/?" +
    "format=json" +
    "&siteType=ST" +
    "&hasDataTypeCd=iv" +
    `&latitude=${lat}` +
    `&longitude=${lon}` +
    `&radius=${radiusMiles}`;

  const res = await fetch(url);
  if (!res.ok) {
    console.error("USGS site error", res.status);
    return null;
  }

  const json = await res.json();

  //Try to code around USGS JSON inconsistencies.
  const sites = json.value?.site || json.site || json.value?.sites || [];

  if (!Array.isArray(sites) || sites.length === 0) {
    return null;
  }

  let best = null;
  let bestDist = Infinity;

  for (const s of sites) {
    const latStr =
      s.geoLocation?.geogLocation?.latitude ??
      s.geoLocation?.latitude ??
      s.latitude;
    const lonStr =
      s.geoLocation?.geogLocation?.longitude ??
      s.geoLocation?.longitude ??
      s.longitude;

    const sLat = parseFloat(latStr);
    const sLon = parseFloat(lonStr);
    if (isNaN(sLat) || isNaN(sLon)) continue;

    const d = distanceMiles(lat, lon, sLat, sLon);
    if (d < bestDist) {
      bestDist = d;
      best = s;
    }
  }

  if (!best) return null;

  const code =
    best.siteCode?.[0]?.value ?? best.siteCode?.value ?? best.siteCode;

  const name = best.siteName || best.name || "";

  if (!code) return null;

  return {
    id: code,
    name,
    distanceMiles: bestDist,
  };
}
