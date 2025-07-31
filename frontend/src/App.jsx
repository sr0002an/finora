import './index.css';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';

import Header from './components/Header';
import DashboardPage from './pages/DashboardPage';
import AddTransactionPage from './pages/AddTransactionPage';
import HistoryPage from './pages/HistoryPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <Router>
      <div className="App" style={{ width: '100vw', minHeight: '100vh', background: 'linear-gradient(to bottom right, #dff1f9, #fef6e4)', paddingBottom: '2rem' }}>

        {/* HEADER + NAV TABS */}
        <header className="top-bar">
  <div className="top-bar-inner">
    <div className="logo">
      <Header />
    </div>
    <nav className="tab-nav">
      <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'tab active' : 'tab'}>Dashboard</NavLink>
      <NavLink to="/add" className={({ isActive }) => isActive ? 'tab active' : 'tab'}>Add</NavLink>
      <NavLink to="/history" className={({ isActive }) => isActive ? 'tab active' : 'tab'}>History</NavLink>
      <NavLink to="/profile" className={({ isActive }) => isActive ? 'tab active' : 'tab'}>Profile</NavLink>
    </nav>
  </div>
</header>

        {/* Route Mapping */}
        <div className="fade-wrapper" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
          <Routes>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/add" element={<AddTransactionPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;