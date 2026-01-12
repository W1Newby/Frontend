import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  Navigate,
} from "react-router-dom";

import Home from "./pages/Home.jsx";
import Weather from "./pages/Weather.jsx";
import River from "./pages/River.jsx";
import Tides from "./pages/Tides.jsx";
import Air from "./pages/Air.jsx";

export default function App() {
  return (
    <Router>
      <nav className="navbar navbar-dark bg-dark px-4">
        <span className="navbar-brand fw-bold">River Conditions</span>

        <div className="navbar-nav flex-row gap-3">
          <NavLink className="nav-link" to="/">
            Home
          </NavLink>
          <NavLink className="nav-link" to="/weather">
            Weather
          </NavLink>
          <NavLink className="nav-link" to="/river">
            River
          </NavLink>
          <NavLink className="nav-link" to="/tides">
            Tides
          </NavLink>
          <NavLink className="nav-link" to="/air">
            Air
          </NavLink>
        </div>
      </nav>

      <main className="container py-4">
        <div className="card shadow-sm">
          <div className="card-body">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Navigate to="/" replace />} />
              <Route path="/weather" element={<Weather />} />
              <Route path="/river" element={<River />} />
              <Route path="/tides" element={<Tides />} />
              <Route path="/air" element={<Air />} />
            </Routes>
          </div>
        </div>
      </main>
    </Router>
  );
}
