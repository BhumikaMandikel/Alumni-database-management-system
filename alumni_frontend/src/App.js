import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import AdminView from './components/AdminView';
import EventOrganizerView from './components/EventOrganizerView';
import AlumniView from './components/AlumniView';
import './App.css';

function App() {
  const [role, setRole] = useState(null);

  const handleLogout = () => {
    setRole(null); // Clear role
    localStorage.removeItem('alumniUsername'); // Clear alumni username from localStorage
  };

  return (
    <Router>
      <div>
        <nav className="navbar">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            {!role ? (
              <li>
                <Link to="/login">Login</Link>
              </li>
            ) : (
              <li className="logout">
                <button onClick={handleLogout}>Logout</button>
              </li>
            )}
            {role === 'admin' && (
              <li>
                <Link to="/admin">Admin View</Link>
              </li>
            )}
            {role === 'event_organizer' && (
              <li>
                <Link to="/event-organizer">Event Organizer View</Link>
              </li>
            )}
            {role === 'alumni' && (
              <li>
                <Link to="/alumni">Alumni View</Link>
              </li>
            )}
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setRole={setRole} />} />
          
          {/* Protected Routes */}
          <Route 
            path="/admin/*" 
            element={role === 'admin' ? <AdminView /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/event-organizer/*" 
            element={role === 'event_organizer' ? <EventOrganizerView /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/alumni/*" 
            element={role === 'alumni' ? <AlumniView /> : <Navigate to="/login" />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
