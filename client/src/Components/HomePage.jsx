import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiShield, FiClock, FiTrendingDown } from 'react-icons/fi';
import ThemeToggle from './ThemeToggle';
import './HomePage.css';

function HomePage() {
    return (
        <motion.div className="home-container"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        >
            <nav className="home-nav">
                <div className="home-nav-brand">🚗 VehicleLoanHub</div>
                <div className="home-nav-links">
                    <ThemeToggle />
                    <Link to="/login" className="nav-link">Login</Link>
                    <Link to="/signup" className="nav-btn-primary">Get Started</Link>
                </div>
            </nav>

            <section className="hero-section">
                <motion.div className="hero-content"
                    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                >
                    <motion.div className="hero-badge" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
                        🔥 Trusted by thousands
                    </motion.div>
                    <h1>Drive Your Dreams <span className="gradient-text">Today</span></h1>
                    <p>Get the best vehicle loan rates with an easy and transparent application process. From cars to trucks, we've got you covered.</p>
                    <div className="hero-actions">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                            <Link to="/signup" className="hero-btn-primary">Apply Now <FiArrowRight /></Link>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                            <Link to="/login" className="hero-btn-secondary">Sign In</Link>
                        </motion.div>
                    </div>
                    <div className="hero-stats">
                        {[{ h: '5000+', p: 'Loans Approved' }, { h: '3.5%', p: 'Starting Rate' }, { h: '24hr', p: 'Quick Approval' }].map((s, i) => (
                            <motion.div key={i} className="stat-item"
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 + i * 0.15 }}
                            >
                                <h3>{s.h}</h3><p>{s.p}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                <motion.div className="hero-visual"
                    initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                >
                    <div className="hero-card-stack">
                        {[{ icon: '🚗', t: 'Car Loan', p: 'From 3.5% p.a.' }, { icon: '🏍️', t: 'Bike Loan', p: 'From 4.0% p.a.' }, { icon: '🚛', t: 'Truck Loan', p: 'From 5.0% p.a.' }].map((c, i) => (
                            <motion.div key={i} className="hero-glass-card"
                                initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 + i * 0.2 }}
                                whileHover={{ x: -8, scale: 1.03 }}
                            >
                                <span className="hgc-icon">{c.icon}</span>
                                <div><h4>{c.t}</h4><p>{c.p}</p></div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </section>

            <section className="features-section">
                <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                    Why Choose <span className="gradient-text">VehicleLoanHub</span>?
                </motion.h2>
                <div className="features-grid">
                    {[{ icon: <FiTrendingDown />, h: 'Low Interest Rates', p: 'Competitive rates starting from 3.5% per annum.' },
                    { icon: <FiClock />, h: 'Quick Processing', p: 'Get your loan approved within 24 hours.' },
                    { icon: <FiShield />, h: 'Secure & Transparent', p: 'Bank-grade security. No hidden charges.' }].map((f, i) => (
                        <motion.div key={i} className="feature-card"
                            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                            whileHover={{ y: -6, scale: 1.02 }}
                        >
                            <div className="feature-icon-wrap">{f.icon}</div>
                            <h3>{f.h}</h3><p>{f.p}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            <footer className="home-footer">
                <p>© 2026 VehicleLoanHub. All rights reserved.</p>
            </footer>
        </motion.div>
    );
}

export default HomePage;
