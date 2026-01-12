import { useEffect, useState } from "react";
import { fetchCountries } from "../Api";

export default function List() {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    fetchCountries().then((data) => {
      setCountries(data);
    });
  }, []);

  return (
    <>
      <h2 className="mb-3">South American Countries</h2>

      {countries.map((country) => (
        <div key={country.cca3} className="mb-3 pb-3 border-bottom">
          <h4>{country.name.common}</h4>

          <img
            src={country.flags.png}
            alt={country.name.common}
            width="100"
            className="mb-2"
          />

          <p>Capital: {country.capital && country.capital[0]}</p>
          <p>
            Population:{" "}
            {country.population && country.population.toLocaleString()}
          </p>
        </div>
      ))}
    </>
  );
}
