import { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { logout } from '../userSlice';
import ThemeToggle from '../Components/ThemeToggle';
import { FiList, FiFileText, FiUser, FiLogOut, FiChevronDown, FiMenu, FiX } from 'react-icons/fi';
import './UserNavbar.css';

function UserNavbar() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.user);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClick = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    // Close mobile menu on route change / outside click
    useEffect(() => {
        if (!menuOpen) return;
        const handleOutside = (e) => {
            if (!e.target.closest('.user-navbar') && !e.target.closest('.user-mobile-menu')) {
                setMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleOutside);
        return () => document.removeEventListener('mousedown', handleOutside);
    }, [menuOpen]);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const navLinks = [
        { to: '/user/viewAllLoans', icon: <FiList />, label: 'Available Loans' },
        { to: '/user/appliedLoans', icon: <FiFileText />, label: 'My Applications' },
    ];

    return (
        <>
            <motion.nav className="user-navbar"
                initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
            >
                <div className="user-nav-brand">🚗 VehicleLoanHub</div>

                {/* Desktop Nav Links */}
                <div className="user-nav-links">
                    {navLinks.map((link) => (
                        <NavLink key={link.to} to={link.to}
                            className={({ isActive }) => `user-nav-link ${isActive ? 'active' : ''}`}
                        >
                            {link.icon} {link.label}
                        </NavLink>
                    ))}
                </div>

                <div className="user-nav-right">
                    <ThemeToggle />
                    <div className="user-dropdown-wrap" ref={dropdownRef}>
                        <motion.button className="user-dropdown-trigger" onClick={() => setDropdownOpen(!dropdownOpen)}
                            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        >
                            <div className="user-avatar-small user-avatar-green"><FiUser /></div>
                            <span className="user-name-text">{user?.userName || 'User'}</span>
                            <motion.span animate={{ rotate: dropdownOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                                <FiChevronDown />
                            </motion.span>
                        </motion.button>
                        <AnimatePresence>
                            {dropdownOpen && (
                                <motion.div className="user-dropdown-menu"
                                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className="dropdown-user-info">
                                        <div className="dropdown-avatar dropdown-avatar-green"><FiUser /></div>
                                        <div>
                                            <p className="dropdown-name">{user?.userName || 'User'}</p>
                                            <p className="dropdown-role">User</p>
                                        </div>
                                    </div>
                                    <div className="dropdown-divider" />
                                    <motion.button className="dropdown-item logout" onClick={handleLogout} whileHover={{ x: 3 }}>
                                        <FiLogOut /> Sign Out
                                    </motion.button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Hamburger Button (mobile only) */}
                    <button
                        className="user-nav-hamburger"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle menu"
                    >
                        {menuOpen ? <FiX /> : <FiMenu />}
                    </button>
                </div>
            </motion.nav>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        className="user-mobile-menu"
                        initial={{ opacity: 0, y: -12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.22 }}
                    >
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                className={({ isActive }) => `user-mobile-link ${isActive ? 'active' : ''}`}
                                onClick={() => setMenuOpen(false)}
                            >
                                {link.icon} {link.label}
                            </NavLink>
                        ))}
                        <div className="user-mobile-divider" />
                        <button className="user-mobile-link user-mobile-logout" onClick={() => { handleLogout(); setMenuOpen(false); }}>
                            <FiLogOut /> Sign Out
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

export default UserNavbar;
