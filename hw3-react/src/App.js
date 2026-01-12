import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  Navigate,
} from "react-router-dom";

import Home from "./pages/Home";
import List from "./pages/List";
import Population from "./pages/Population";
import Custom from "./pages/Custom";

export default function App() {
  return (
    <Router>
      {/* Navbar */}
      <nav className="navbar navbar-dark bg-dark px-4">
        <span className="navbar-brand fw-bold">
          South American Country Data (HW3)
        </span>

        <div className="d-flex gap-3">
          <NavLink
            to="/home"
            className={({ isActive }) =>
              isActive
                ? "text-white fw-semibold text-decoration-none border-bottom border-white pb-1"
                : "text-light text-decoration-none"
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/list"
            className={({ isActive }) =>
              isActive
                ? "text-white fw-semibold text-decoration-none border-bottom border-white pb-1"
                : "text-light text-decoration-none"
            }
          >
            List
          </NavLink>

          <NavLink
            to="/population"
            className={({ isActive }) =>
              isActive
                ? "text-white fw-semibold text-decoration-none border-bottom border-white pb-1"
                : "text-light text-decoration-none"
            }
          >
            Population
          </NavLink>

          <NavLink
            to="/custom"
            className={({ isActive }) =>
              isActive
                ? "text-white fw-semibold text-decoration-none border-bottom border-white pb-1"
                : "text-light text-decoration-none"
            }
          >
            Custom
          </NavLink>
        </div>
      </nav>

      {/* Consistent page wrapper */}
      <main className="container py-4">
        <div className="card shadow-sm">
          <div className="card-body">
            <Routes>
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="/home" element={<Home />} />
              <Route path="/list" element={<List />} />
              <Route path="/population" element={<Population />} />
              <Route path="/custom" element={<Custom />} />
            </Routes>
          </div>
        </div>
      </main>
    </Router>
  );
}
