//Tides api pull from NOAA page

function yyyymmdd(d) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}${mm}${dd}`;
}

// NOAA Data API
export async function getTides(stationId) {
  // 2-day window--capture the next high/low even late at night
  const start = new Date();
  const end = new Date();
  end.setDate(end.getDate() + 2);

  const begin_date = yyyymmdd(start);
  const end_date = yyyymmdd(end);

  //Hi/Lo predictions
  const predUrl =
    "https://api.tidesandcurrents.noaa.gov/api/prod/datagetter" +
    `?product=predictions` +
    `&application=river-conditions` +
    `&station=${stationId}` +
    `&begin_date=${begin_date}` +
    `&end_date=${end_date}` +
    `&datum=MLLW` +
    `&time_zone=lst_ldt` +
    `&units=english` +
    `&interval=hilo` +
    `&format=json`;

  // Latest water level
  const wlUrl =
    "https://api.tidesandcurrents.noaa.gov/api/prod/datagetter" +
    `?product=water_level` +
    `&application=river-conditions` +
    `&station=${stationId}` +
    `&date=latest` +
    `&datum=MLLW` +
    `&time_zone=lst_ldt` +
    `&units=english` +
    `&format=json`;

  const [predRes, wlRes] = await Promise.all([fetch(predUrl), fetch(wlUrl)]);

  const predictionsJson = await predRes.json();
  const waterLevelJson = await wlRes.json();

  const predictions = predictionsJson?.predictions || [];

  const latest = waterLevelJson?.data?.slice(-1)?.[0] || null;

  return { predictions, latest };
}

// Find nearby NOAA tide stations (water level) within a radius (miles)
//FIXME?
export async function findNearestTideStation(lat, lon, radiusMiles = 50) {
  const searchRadius = 300;

  const url =
    "https://api.tidesandcurrents.noaa.gov/mdapi/prod/webapi/stations.json" +
    `?type=waterlevels&lat=${lat}&lon=${lon}&radius=${searchRadius}`;

  const res = await fetch(url);
  if (!res.ok) {
    console.error("NOAA nearest station error:", res.status);
    return null;
  }

  const data = await res.json();
  const stations = data?.stations || [];
  if (!stations.length) return null;

  const withDistance = stations
    .map((s) => {
      const slat = parseFloat(s.lat);
      const slon = parseFloat(s.lng);
      if (Number.isNaN(slat) || Number.isNaN(slon)) return null;

      const d = distanceMiles(lat, lon, slat, slon);
      return { station: s, distance: d };
    })
    .filter(Boolean)
    .filter((item) => item.distance <= radiusMiles);

  if (!withDistance.length) return null;

  withDistance.sort((a, b) => a.distance - b.distance);
  const best = withDistance[0].station;

  return {
    id: best.id,
    name: best.name,
  };
}

// Temporary--TESTING
function distanceMiles(lat1, lon1, lat2, lon2) {
  const R = 3958.8; //in miles
  const toRad = (d) => (d * Math.PI) / 180;

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
