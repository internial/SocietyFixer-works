import React, { useState, useEffect, useRef, useCallback } from 'react';
import { NavLink, useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Logo from './Logo';

/**
 * The main navigation bar for the application.
 * It is responsive, includes a global search bar, and shows different options
 * based on the user's authentication status. The mobile menu now automatically closes.
 * @returns {React.JSX.Element} The rendered Navbar component.
 */
export default function Navbar() {
    const { user, signOut } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    
    const [visible, setVisible] = useState(true);
    const lastScrollY = useRef(0);
    const navRef = useRef<HTMLElement>(null);
    const collapseRef = useRef<HTMLDivElement>(null);
    const [searchTerm, setSearchTerm] = useState('');

    /**
     * Toggles navbar visibility based on scroll direction for a better user experience.
     */
    const handleScroll = useCallback(() => {
        const currentScrollY = window.scrollY;
        setVisible(currentScrollY < lastScrollY.current || currentScrollY < 100);
        lastScrollY.current = currentScrollY;
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    /**
     * Syncs the search bar's content with the URL query parameter.
     * Clears the search bar when navigating away from the home page.
     */
    useEffect(() => {
        if (location.pathname === '/') {
            const params = new URLSearchParams(location.search);
            setSearchTerm(params.get('q') || '');
        } else {
            setSearchTerm(''); // Clear on other pages
        }
    }, [location]);

    /**
     * Handles changes in the search input, updating the URL to reflect the search query.
     * This immediately navigates the user to the homepage to see filtered results.
     */
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTerm = e.target.value;
        setSearchTerm(newTerm);
        navigate(`/?q=${encodeURIComponent(newTerm)}`, { replace: true });
    };

    /**
     * Prevents form submission from reloading the page.
     */
    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
    };

    /**
     * Closes the mobile navigation menu if it is open.
     */
    const closeMenu = () => {
        if (collapseRef.current?.classList.contains('show')) {
            const toggler = document.querySelector<HTMLButtonElement>('.navbar-toggler');
            if (toggler) {
                toggler.click();
            }
        }
    };
    
    // Close menu on route change
    useEffect(() => {
        closeMenu();
    }, [location.pathname, location.search]);

    // Close menu on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (navRef.current && !navRef.current.contains(event.target as Node)) {
                closeMenu();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const searchParams = new URLSearchParams(location.search);
    const isRegisterView = searchParams.get('view') === 'register';

    return (
        <nav ref={navRef} className={`navbar navbar-expand-md navbar-dark fixed-top shadow-sm bg-black py-2`} style={{ transition: 'transform 0.3s ease-in-out', transform: visible ? 'translateY(0)' : 'translateY(-100%)' }}>
            <div className="container-fluid">
                <Link to="/" className="navbar-brand d-flex align-items-center">
                    <Logo />
                    <span className="fw-bold fs-5">SocietyFixer</span>
                </Link>
                
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#main-nav" aria-controls="main-nav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div ref={collapseRef} className="collapse navbar-collapse" id="main-nav">
                    {/* Spacer to push all subsequent content to the right */}
                    <div className="me-auto" />

                    {/* Search Bar */}
                    <form className="d-flex my-2 my-md-0 me-md-3" role="search" onSubmit={handleSearchSubmit} style={{ width: '100%', maxWidth: '400px' }}>
                        <input
                            className="form-control"
                            type="search"
                            placeholder="Search by candidate, position, or region"
                            aria-label="Search"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </form>

                    {/* Right aligned nav items */}
                    <ul className="navbar-nav mb-2 mb-md-0 align-items-md-center">
                         <li className="nav-item">
                             <NavLink to="/about" className="nav-link">About Us</NavLink>
                         </li>
                         <li className="nav-item">
                             <NavLink to="/contact" className="nav-link">Contact</NavLink>
                         </li>
                          <li className="nav-item me-md-2">
                             <NavLink to="/find-cofounder" className="btn btn-sm btn-outline-info">Seeking Cofounders</NavLink>
                         </li>
                         <li className="nav-item">
                             <NavLink to="/create-campaign" className="btn btn-sm btn-primary">Create Campaign</NavLink>
                         </li>
                        {user ? (
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Account
                                </a>
                                <ul className="dropdown-menu dropdown-menu-end">
                                    <li><h6 className="dropdown-header text-sm text-secondary">{user.email}</h6></li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li><Link to="/dashboard" className="dropdown-item">My Dashboard</Link></li>
                                    <li><button onClick={() => { closeMenu(); signOut(); }} className="dropdown-item">Logout</button></li>
                                </ul>
                            </li>
                        ) : (
                            <>
                                <li className="nav-item">
                                    {/* FIX: Corrected a syntax error in the ternary operator by removing a stray single quote. */}
                                    <Link to="/auth" className={`nav-link ${location.pathname === '/auth' && !isRegisterView ? 'active' : ''}`}>Login</Link>
                                </li>
                                <li className="nav-item">
                                    {/* FIX: Corrected a syntax error in the ternary operator by removing a stray single quote. */}
                                    <Link to="/auth?view=register" className={`nav-link ${location.pathname === '/auth' && isRegisterView ? 'active' : ''}`}>Register</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};