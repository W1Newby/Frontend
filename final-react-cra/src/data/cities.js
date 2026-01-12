//const cities
//originally built for testing, to be pulled out later for complete customization, but I can't get the
//river data to work for custom cities, so leaving them in for now.
export const cities = [
  {
    id: "portland-or",
    name: "Portland, OR",
    lat: 45.5152,
    lon: -122.6784,
    usgsSite: "14211720",
    usgsName: "Willamette River at Portland, OR",
    noaaStation: "9439221", // for rivers, TODO How to pull this for custom cities?
    noaaName: "Portland, OR (NOAA tide station)",
  },
  {
    id: "cincinnati-oh",
    name: "Cincinnati, OH",
    lat: 39.1031,
    lon: -84.512,
    usgsSite: "03255000",
    usgsName: "Ohio River at Cincinnati, OH",
    // probably no tides
  },
  {
    id: "stpaul-mn",
    name: "St. Paul, MN",
    lat: 44.9537,
    lon: -93.09,
    usgsSite: "05331000",
    usgsName: "Mississippi River at St. Paul, MN",
    // no tides
  },
];
