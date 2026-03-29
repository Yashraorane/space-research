import { NavLink, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ApodViewer from './pages/ApodViewer';
import MarsRoverGallery from './pages/MarsRoverGallery';
import AsteroidsAnalytics from './pages/AsteroidsAnalytics';

const links = [
  { to: '/', label: 'Dashboard', icon: '📊', end: true },
  { to: '/apod', label: 'APOD', icon: '🔭' },
  { to: '/mars', label: 'Mars Gallery', icon: '🔴' },
  { to: '/asteroids', label: 'Asteroids', icon: '🪨' },
];

function App() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">🌌 NASA Space Explorer</p>
          <h2>Orbital Insight</h2>
        </div>
        <nav>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                isActive ? 'nav-link nav-link-active' : 'nav-link'
              }
              title={link.label}
            >
              <span>{link.icon}</span>
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="content-shell">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/apod" element={<ApodViewer />} />
          <Route path="/mars" element={<MarsRoverGallery />} />
          <Route path="/asteroids" element={<AsteroidsAnalytics />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
