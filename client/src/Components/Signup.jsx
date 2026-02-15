import { useState, useRef, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { loginSuccess } from '../userSlice';
import API from '../apiConfig';
import { toast } from 'react-toastify';
import { FiUser, FiMail, FiPhone, FiLock, FiUserPlus, FiShield, FiCheck, FiAlertCircle } from 'react-icons/fi';
import ThemeToggle from './ThemeToggle';
import './Signup.css';

function Signup() {
    const [form, setForm] = useState({ userName: '', email: '', mobile: '', password: '', confirmPassword: '', role: 'user' });
    const [errors, setErrors] = useState({});
    const [dupeStatus, setDupeStatus] = useState({}); // { userName: 'checking'|'taken'|'available', ... }
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const timers = useRef({});

    // Debounced duplicate check
    const checkDuplicate = useCallback((field, value) => {
        if (timers.current[field]) clearTimeout(timers.current[field]);

        if (!value || value.trim() === '') {
            setDupeStatus(prev => ({ ...prev, [field]: null }));
            return;
        }

        // Only check email duplicates
        if (field !== 'email') return;
        if (!/\S+@\S+\.\S+/.test(value)) return;

        setDupeStatus(prev => ({ ...prev, [field]: 'checking' }));

        timers.current[field] = setTimeout(async () => {
            try {
                const res = await API.post('/user/checkDuplicate', { field, value });
                setDupeStatus(prev => ({ ...prev, [field]: res.data.exists ? 'taken' : 'available' }));
            } catch {
                setDupeStatus(prev => ({ ...prev, [field]: null }));
            }
        }, 500);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Clear error for this field when user types
        if (errors[name]) {
            setErrors(prev => {
                const updated = { ...prev };
                delete updated[name];
                return updated;
            });
        }

        if (name === 'mobile') {
            const numbersOnly = value.replace(/\D/g, '').slice(0, 10);
            setForm(prev => ({ ...prev, mobile: numbersOnly }));
            return;
        }

        setForm(prev => ({ ...prev, [name]: value }));

        // Trigger duplicate check for email only
        if (name === 'email') {
            checkDuplicate(name, value);
        }
    };

    const validate = () => {
        const errs = {};
        if (!form.userName) errs.userName = 'Username is required';
        if (!form.email) errs.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email';
        if (!form.mobile) errs.mobile = 'Mobile is required';
        else if (!/^\d{10}$/.test(form.mobile)) errs.mobile = 'Must be 10 digits';
        if (!form.password) errs.password = 'Password is required';
        else if (form.password.length < 6) errs.password = 'Min 6 characters';
        if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';

        // Block if email duplicate detected
        if (dupeStatus.email === 'taken') errs.email = 'Email already registered';

        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            const { confirmPassword, ...data } = form;
            await API.post('/user/register', data);
            toast.success('Account Created!');

            // Auto-login after signup
            const loginRes = await API.post('/user/login', { email: form.email, password: form.password });
            dispatch(loginSuccess(loginRes.data));
            toast.success('Welcome aboard! 🚀');

            if (loginRes.data.role === 'admin') navigate('/admin/viewLoans');
            else navigate('/user/viewAllLoans');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration Failed');
        } finally {
            setLoading(false);
        }
    };

    // Helper to render duplicate status indicator
    const renderDupeIcon = (field) => {
        const status = dupeStatus[field];
        const value = form[field];
        if (!status) return null;
        if (status === 'checking') return <span className="dupe-indicator checking">⏳ Checking...</span>;
        if (status === 'taken') {
            const fieldLabel = field === 'userName' ? 'Username' : field === 'email' ? 'Email' : 'Mobile number';
            return <span className="dupe-indicator taken"><FiAlertCircle /> {fieldLabel} '{value}' already exists</span>;
        }
        if (status === 'available') return <span className="dupe-indicator available"><FiCheck /> Available</span>;
        return null;
    };

    return (
        <motion.div className="signup-container"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        >
            <div className="login-theme-toggle"><ThemeToggle /></div>
            <motion.div className="signup-left"
                initial={{ x: -60, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, type: 'spring', stiffness: 80 }}
            >
                <div className="login-brand">
                    <motion.div className="brand-icon" animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}>🚗</motion.div>
                    <h1>VehicleLoanHub</h1>
                    <p>Join us and get the best vehicle financing</p>
                </div>
                <div className="signup-features">
                    {[{ e: '✅', h: 'Easy Application', p: 'Simple and hassle-free process' },
                    { e: '📊', h: 'Track Status', p: 'Real-time application updates' },
                    { e: '🏦', h: 'Best Rates', p: 'Competitive interest rates' }].map((item, i) => (
                        <motion.div key={i} className="feature-item"
                            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + i * 0.1 }}
                            whileHover={{ x: 5 }}
                        >
                            <span>{item.e}</span>
                            <div><h4>{item.h}</h4><p>{item.p}</p></div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
            <motion.div className="signup-right"
                initial={{ x: 60, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, type: 'spring', stiffness: 80 }}
            >
                <form className="signup-form" onSubmit={handleSubmit}>
                    <h2>Create Account</h2>
                    <p className="login-subtitle">Fill in your details to get started</p>

                    {/* Row 1: Username + Email */}
                    <motion.div className="vlh-form-row" style={{ marginBottom: '1.2rem' }}
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    >
                        <div className="vlh-form-group">
                            <label className="vlh-label"><FiUser /> Username</label>
                            <input name="userName" placeholder="Enter username" value={form.userName} onChange={handleChange}
                                className={`vlh-input ${errors.userName ? 'vlh-input-error' : ''}`} />
                            {errors.userName && <span className="vlh-error-text">{errors.userName}</span>}
                        </div>
                        <div className="vlh-form-group">
                            <label className="vlh-label"><FiMail /> Email</label>
                            <input name="email" type="email" placeholder="Enter email" value={form.email} onChange={handleChange}
                                className={`vlh-input ${errors.email ? 'vlh-input-error' : dupeStatus.email === 'taken' ? 'vlh-input-error' : dupeStatus.email === 'available' ? 'vlh-input-success' : ''}`} />
                            {renderDupeIcon('email')}
                            {errors.email && <span className="vlh-error-text">{errors.email}</span>}
                        </div>
                    </motion.div>

                    {/* Row 2: Mobile + Role Picker */}
                    <motion.div className="vlh-form-row" style={{ marginBottom: '1.2rem' }}
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    >
                        <div className="vlh-form-group">
                            <label className="vlh-label"><FiPhone /> Mobile</label>
                            <input name="mobile" placeholder="10-digit mobile" value={form.mobile} onChange={handleChange}
                                inputMode="numeric"
                                className={`vlh-input ${errors.mobile ? 'vlh-input-error' : ''}`} />
                            {errors.mobile && <span className="vlh-error-text">{errors.mobile}</span>}
                        </div>
                        <div className="vlh-form-group">
                            <label className="vlh-label"><FiShield /> Role</label>
                            <div className="role-picker">
                                <motion.button type="button"
                                    className={`role-card ${form.role === 'user' ? 'active' : ''}`}
                                    onClick={() => setForm({ ...form, role: 'user' })}
                                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                >
                                    <span className="role-icon">👤</span>
                                    <span className="role-title">User</span>
                                    {form.role === 'user' && <motion.div className="role-indicator" layoutId="role-indicator" />}
                                </motion.button>
                                <motion.button type="button"
                                    className={`role-card ${form.role === 'admin' ? 'active' : ''}`}
                                    onClick={() => setForm({ ...form, role: 'admin' })}
                                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                >
                                    <span className="role-icon">🛡️</span>
                                    <span className="role-title">Admin</span>
                                    {form.role === 'admin' && <motion.div className="role-indicator" layoutId="role-indicator" />}
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Row 3: Password + Confirm */}
                    <motion.div className="vlh-form-row" style={{ marginBottom: '1.2rem' }}
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                    >
                        <div className="vlh-form-group">
                            <label className="vlh-label"><FiLock /> Password</label>
                            <input name="password" type="password" placeholder="Min 6 characters" value={form.password} onChange={handleChange}
                                className={`vlh-input ${errors.password ? 'vlh-input-error' : ''}`} />
                            {errors.password && <span className="vlh-error-text">{errors.password}</span>}
                        </div>
                        <div className="vlh-form-group">
                            <label className="vlh-label"><FiLock /> Confirm Password</label>
                            <input name="confirmPassword" type="password" placeholder="Re-enter password" value={form.confirmPassword} onChange={handleChange}
                                className={`vlh-input ${errors.confirmPassword ? 'vlh-input-error' : ''}`} />
                            {errors.confirmPassword && <span className="vlh-error-text">{errors.confirmPassword}</span>}
                        </div>
                    </motion.div>

                    <motion.button type="submit" className="vlh-btn-primary login-btn" disabled={loading}
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    >
                        {loading ? <span className="vlh-spinner"></span> : <><FiUserPlus /> Create Account</>}
                    </motion.button>

                    <p className="login-footer">
                        Already have an account? <Link to="/login">Sign In</Link>
                    </p>
                </form>
            </motion.div>
        </motion.div>
    );
}

export default Signup;
