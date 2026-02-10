import { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { logout } from '../userSlice';
import ThemeToggle from '../Components/ThemeToggle';
import { FiPlus, FiList, FiInbox, FiUser, FiLogOut, FiChevronDown } from 'react-icons/fi';
import './AdminNavbar.css';

function AdminNavbar() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.user);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClick = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <motion.nav className="admin-navbar"
            initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
        >
            <div className="admin-nav-brand">🚗 VehicleLoanHub</div>
            <div className="admin-nav-links">
                {[{ to: '/admin/loanForm', icon: <FiPlus />, label: 'Add Loan' },
                { to: '/admin/viewLoans', icon: <FiList />, label: 'View Loans' },
                { to: '/admin/loanRequests', icon: <FiInbox />, label: 'Requests' }].map((link) => (
                    <NavLink key={link.to} to={link.to}
                        className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
                    >
                        {link.icon} {link.label}
                    </NavLink>
                ))}
            </div>
            <div className="admin-nav-right">
                <ThemeToggle />
                <div className="user-dropdown-wrap" ref={dropdownRef}>
                    <motion.button className="user-dropdown-trigger" onClick={() => setDropdownOpen(!dropdownOpen)}
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    >
                        <div className="user-avatar-small"><FiUser /></div>
                        <span className="user-name-text">{user?.userName || 'Admin'}</span>
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
                                    <div className="dropdown-avatar"><FiUser /></div>
                                    <div>
                                        <p className="dropdown-name">{user?.userName || 'Admin'}</p>
                                        <p className="dropdown-role">Administrator</p>
                                    </div>
                                </div>
                                <div className="dropdown-divider" />
                                <motion.button className="dropdown-item logout" onClick={handleLogout}
                                    whileHover={{ x: 3 }}
                                >
                                    <FiLogOut /> Sign Out
                                </motion.button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.nav>
    );
}

export default AdminNavbar;
