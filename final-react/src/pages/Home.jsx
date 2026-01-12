export default function Home() {
  return (
    <>
      <h2 className="mb-3">Dashboard</h2>
      <p className="text-muted">
        Pick a city to see weather + river + tides + air quality.
      </p>

      <div className="row g-3">
        <div className="col-12 col-md-6 col-lg-3">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Weather</h5>
              <p className="card-text text-muted">
                Temp, wind, rain, pressure…
              </p>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-3">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">River</h5>
              <p className="card-text text-muted">Flow + gage height…</p>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-3">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Tides</h5>
              <p className="card-text text-muted">Tide predictions…</p>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-3">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Air Quality</h5>
              <p className="card-text text-muted">PM2.5, ozone…</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
