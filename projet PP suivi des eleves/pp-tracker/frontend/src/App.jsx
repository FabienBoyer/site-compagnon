import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import ClassePage from './pages/ClassePage'
import FicheElevePage from './pages/FicheElevePage'
import DashboardPage from './pages/DashboardPage'
import ConseilPage from './pages/ConseilPage'
import OcrPage from './pages/OcrPage'
import FamillesPage from './pages/FamillesPage'
import SettingsPage from './pages/SettingsPage'
import RapportPage from './pages/RapportPage'
import PlanClassePage from './pages/PlanClassePage'
import OrientationPage from './pages/OrientationPage'

const navLinkStyle = ({ isActive }) => ({
  color: isActive ? 'white' : 'rgba(255,255,255,0.65)',
  textDecoration: 'none',
  fontWeight: isActive ? 700 : 400,
  fontSize: '0.88rem',
  padding: '4px 10px',
  borderRadius: 6,
  background: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
  transition: 'all 0.15s',
})

function App() {
  return (
    <BrowserRouter>
      <div className="app-header">
        <div style={{ flex: 1 }}>
          <h1>📋 PP Tracker</h1>
          <div className="subtitle">Suivi de classe — 2nde 1</div>
        </div>
        <nav style={{ display: 'flex', gap: 8 }}>
          <NavLink to="/" end style={navLinkStyle}>Liste</NavLink>
          <NavLink to="/dashboard" style={navLinkStyle}>Tableau de bord</NavLink>
          <NavLink to="/conseil" style={navLinkStyle}>Conseil</NavLink>
          <NavLink to="/familles" style={navLinkStyle}>Familles</NavLink>
          <NavLink to="/ocr" style={navLinkStyle}>OCR bulletins</NavLink>
          <NavLink to="/rapport" style={navLinkStyle}>📋 Rapport</NavLink>
          <NavLink to="/plan-classe" style={navLinkStyle}>🪑 Plan classe</NavLink>
          <NavLink to="/orientation" style={navLinkStyle}>🎯 Orientation</NavLink>
          <NavLink to="/settings" style={navLinkStyle}>⚙️ Paramètres</NavLink>
        </nav>
      </div>
      <Routes>
        <Route path="/" element={<ClassePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/conseil" element={<ConseilPage />} />
        <Route path="/familles" element={<FamillesPage />} />
        <Route path="/ocr" element={<OcrPage />} />
        <Route path="/eleve/:id" element={<FicheElevePage />} />
        <Route path="/rapport" element={<RapportPage />} />
        <Route path="/plan-classe" element={<PlanClassePage />} />
        <Route path="/orientation" element={<OrientationPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
