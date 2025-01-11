import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login({ setRole }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleFormLogin = () => {
    if (username.startsWith('admin') && password.startsWith('adminpwd')) {
      setRole('admin');
      navigate('/admin');
    } else if (username.startsWith('org') && password.startsWith('orgpwd')) {
      setRole('event_organizer');
      navigate('/event-organizer');
    } else if (username.startsWith('alumni') && password.startsWith('alumnipwd')) {
      setRole('alumni');
      localStorage.setItem('alumniUsername', username); // Always store the current alumni's username
      navigate('/alumni');
    } else {
      alert('Invalid username or password');
    }
  };

  return (
    <div className="login-page">
      <h2 className="login-title">Login</h2>
      <div className="login-container">
      <div className="login-form">
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      </div>
      <button onClick={handleFormLogin}>Login</button>
      {/* No need for a logout button here */}
    </div>
    </div>
  );
}

export default Login;