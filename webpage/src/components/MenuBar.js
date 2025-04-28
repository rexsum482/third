import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/Logo2.png';
import Sign from '../assets/thirdstreet.svg';
import Avatar from '../assets/avatar.svg';

const MenuBar = ({ isAuthenticated, isAdmin, active }) => {
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
        window.location.reload();
    };

    return (
        <>
        <nav className="navbar-top">
            <div className="navbar-container">
                <a href="/" className="navbar-logo">
                    <img src={isMobile ? Sign : Logo} className="logo-img" alt="Logo" />
                    {isMobile ? (<span></span>) : (<span className="logo-text">3rd Street Garage</span>)}
                </a>
                <div className="navbar-links">
                    <a href="tel:9723351153" className="navbar-phone">📞 (972) 335-1153</a>
                    {isAuthenticated ? (
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                        <span className="navbar-login" onClick={handleLogout}>Logout</span>
                        <a href="/profile"><img src={Avatar} height='32px' width='auto' /></a>
                        </div>
                    ) : (
                        <a href="/login" className="navbar-login">Login</a>
                    )}
                </div>
            </div>
        </nav>

        <nav className="navbar-bottom">
            <div className="navbar-bottom-container">
                <div className="navbar-menu">
                <ul className="navbar-menu-list">
                    <li>
                        <a 
                            href="/home" 
                            className={active === 'home' ? "menu-link active" : "menu-link"}
                        >
                            Home
                        </a>
                    </li>
                    <li>
                        <a 
                            href="/services" 
                            className={active === 'services' ? "menu-link active" : "menu-link"}
                        >
                            Services
                        </a>
                    </li>

                    <li>
                        <a 
                            href="/reviews" 
                            className={active === 'reviews' ? "menu-link active" : "menu-link"}
                        >
                            Reviews
                        </a>
                    </li>
                    {isAdmin ? (
                        <li>
                            <a 
                                href="/jobs" 
                                className={active === 'jobs' ? "menu-link active" : "menu-link"}
                            >
                                Jobs
                            </a>
                        </li>
                    ) : (
                        <li>
                            <a 
                                href="/book" 
                                className={active === 'book' ? "menu-link active" : "menu-link"}
                            >
                                Schedule
                            </a>
                        </li>
                    )}
                </ul>
                </div>
            </div>
        </nav>
        </>
    );
};

export default MenuBar;
