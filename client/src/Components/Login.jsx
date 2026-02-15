import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { loginSuccess } from '../userSlice';
import API from '../apiConfig';
import { toast } from 'react-toastify';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';
import ThemeToggle from './ThemeToggle';
import './Login.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const validate = () => {
        const errs = {};
        if (!email) errs.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Invalid email format';
        if (!password) errs.password = 'Password is required';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            const res = await API.post('/user/login', { email, password });
            dispatch(loginSuccess(res.data));
            toast.success('Login Successful!');
            if (res.data.role === 'admin') navigate('/admin/viewLoans');
            else navigate('/user/viewAllLoans');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login Failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div className="login-container"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
        >
            <div className="login-theme-toggle"><ThemeToggle /></div>
            <motion.div className="login-left"
                initial={{ x: -60, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, type: 'spring', stiffness: 80 }}
            >
                <div className="login-brand">
                    <motion.div className="brand-icon"
                        animate={{ y: [0, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                    >🚗</motion.div>
                    <h1>VehicleLoanHub</h1>
                    <p>Your trusted partner for vehicle financing solutions</p>
                </div>
                <div className="login-illustration">
                    {[{ e: '💰', t: 'Low Interest Rates' }, { e: '⚡', t: 'Quick Approval' }, { e: '🔒', t: 'Secure Process' }].map((item, i) => (
                        <motion.div key={i} className="floating-card"
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + i * 0.15 }}
                            whileHover={{ y: -8, scale: 1.05 }}
                        >
                            <span>{item.e}</span>
                            <p>{item.t}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
            <motion.div className="login-right"
                initial={{ x: 60, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, type: 'spring', stiffness: 80 }}
            >
                <form className="login-form" onSubmit={handleSubmit}>
                    <motion.h2 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        Welcome Back
                    </motion.h2>
                    <p className="login-subtitle">Sign in to your account</p>

                    <motion.div className="vlh-form-group" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                        <label className="vlh-label"><FiMail /> Email</label>
                        <input className={`vlh-input ${errors.email ? 'vlh-input-error' : ''}`}
                            type="email" placeholder="Enter your email" value={email} onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors(prev => ({ ...prev, email: '' })); }} />
                        {errors.email && <span className="vlh-error-text">{errors.email}</span>}
                    </motion.div>

                    <motion.div className="vlh-form-group" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                        <label className="vlh-label"><FiLock /> Password</label>
                        <input className={`vlh-input ${errors.password ? 'vlh-input-error' : ''}`}
                            type="password" placeholder="Enter your password" value={password} onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors(prev => ({ ...prev, password: '' })); }} />
                        {errors.password && <span className="vlh-error-text">{errors.password}</span>}
                    </motion.div>

                    <motion.button type="submit" className="vlh-btn-primary login-btn" disabled={loading}
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                    >
                        {loading ? <span className="vlh-spinner"></span> : <><FiLogIn /> Sign In</>}
                    </motion.button>

                    <p className="login-footer">
                        Don't have an account? <Link to="/signup">Sign Up</Link>
                    </p>
                </form>
            </motion.div>
        </motion.div>
    );
}

export default Login;
