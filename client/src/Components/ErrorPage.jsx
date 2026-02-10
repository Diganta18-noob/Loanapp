import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import { FiHome, FiArrowLeft } from 'react-icons/fi';
import './ErrorPage.css';

function ErrorPage() {
    const { isAuthenticated, role } = useSelector((state) => state.user);

    const getHomeLink = () => {
        if (!isAuthenticated) return '/';
        return role === 'admin' ? '/admin/viewLoans' : '/user/viewAllLoans';
    };

    return (
        <motion.div className="error-container"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        >
            <div className="login-theme-toggle"><ThemeToggle /></div>

            <motion.div className="error-content"
                initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 80, delay: 0.1 }}
            >
                <motion.div className="error-code"
                    animate={{ scale: [1, 1.04, 1] }}
                    transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                >
                    404
                </motion.div>
                <h2 className="error-title">Page Not Found</h2>
                <p className="error-subtitle">The page you're looking for doesn't exist or has been moved.</p>

                <div className="error-actions">
                    <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                        <Link to={getHomeLink()} className="vlh-btn-primary error-btn">
                            <FiHome /> {isAuthenticated ? 'Go to Dashboard' : 'Go Home'}
                        </Link>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                        <Link to={-1} className="vlh-btn-secondary error-btn" onClick={(e) => { e.preventDefault(); window.history.back(); }}>
                            <FiArrowLeft /> Go Back
                        </Link>
                    </motion.div>
                </div>
            </motion.div>
        </motion.div>
    );
}

export default ErrorPage;
