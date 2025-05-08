import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SITE } from '../data/constants';

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`https://${SITE}/auth/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password }),
	credentials: 'omit'
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem('token', data.token);
        navigate('/');
        window.location.reload();
      } else {
        setError(data?.non_field_errors?.[0] || 'Login failed');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-title">Login</h1>
      <form className="login-form" onSubmit={handleLogin} noValidate>
        <input
          className="input-field"
          type="text"
          placeholder="Username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
<div className="password-wrapper">
  <input
    className="input-field"
    type={showPassword ? 'text' : 'password'}
    placeholder="Password"
    required
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    style={{ paddingRight: '3rem' }} // small extra padding inside input for button space
  />
  <button
    type="button"
    className="toggle-password"
    onClick={() => setShowPassword((prev) => !prev)}
  >
    {showPassword ? '🙈' : '👁️'}
  </button>
</div>
        {error && (
          <div className="error-alert">
            {error}
          </div>
        )}

        <button type="submit" className="login-button">
          Sign In
        </button>
      </form>

      <div className="signup-text">
        Don't have an account?{' '}
        <Link to="/signup" className="signup-link">
          Sign up
        </Link>
      </div>
    </div>
  );
}
