import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import { SITE } from './data/constants';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import MenuBar from "./components/MenuBar";
import Services from "./pages/Services";
import Reviews from "./pages/Reviews";
import Jobs from "./pages/Jobs";
import Book from "./pages/Book";
import FourOfFour from "./pages/404";
import Profile from "./pages/Profile";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        // updated verify request - use GET and send token in query params
        const verifyResponse = await fetch(`https://${SITE}/api/users/verify/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        if (!verifyResponse.ok) {
          localStorage.removeItem('token');
          setIsAuthenticated(false);
          return;
        }

        // fetch user data
        const meResponse = await fetch(`https://${SITE}/api/users/me/`, {
          method: 'GET',
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (meResponse.ok) {
          const userData = await meResponse.json();
          localStorage.setItem('user', JSON.stringify(userData));
          setIsAdmin(!!userData.is_superuser);
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('token');
          setIsAuthenticated(false);
        }

      } catch (error) {
        console.error('Authentication failed:', error);
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="app">
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <Router>
      <div className="app">
        <AppContent isAuthenticated={isAuthenticated} isAdmin={isAdmin} />
      </div>
    </Router>
  );
}

function AppContent({ isAuthenticated, isAdmin }) {
  const location = useLocation();

  let active = '';
  if (location.pathname === '/' || location.pathname === '/home') {
    active = 'home';
  } else if (location.pathname.startsWith('/services')) {
    active = 'services';
  } else if (location.pathname.startsWith('/reviews')) {
    active = 'reviews';
  } else if (location.pathname.startsWith('/jobs')) {
    active = 'jobs';
  } else if (location.pathname.startsWith('/book')) {
    active = 'book';
  }

  return (
    <>
      <MenuBar isAuthenticated={isAuthenticated} isAdmin={isAdmin} active={active} />
      <div className="page-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={isAuthenticated ? <Home /> : <Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/jobs" element={isAdmin ? <Jobs /> : <Home />} />
          <Route path="/book" element={<Book />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<FourOfFour />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
