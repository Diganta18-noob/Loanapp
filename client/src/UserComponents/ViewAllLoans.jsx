import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import API from '../apiConfig';
import { toast } from 'react-toastify';
import UserNavbar from './UserNavbar';
import { FiSearch, FiArrowRight } from 'react-icons/fi';
import './ViewAllLoans.css';

function ViewAllLoans() {
    const [loans, setLoans] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLoans = async () => {
            try {
                const res = await API.get('/loan/getAll');
                setLoans(res.data);
            } catch { toast.error('Failed to fetch loans'); }
            finally { setLoading(false); }
        };
        fetchLoans();
    }, []);

    const filtered = loans.filter((l) => l.loanType.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="page-container">
            <UserNavbar />
            <motion.div className="page-content"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            >
                <div className="page-header">
                    <h2 className="page-title">🏦 Available Loans</h2>
                    <div className="vlh-search">
                        <FiSearch />
                        <input placeholder="Search loan type..." value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                </div>

                {loading ? <div className="vlh-loading">Loading loans...</div> : filtered.length === 0 ? <div className="vlh-empty">No loans available</div> : (
                    <div className="loans-grid">
                        {filtered.map((loan, i) => (
                            <motion.div key={loan._id} className="vlh-card loan-card"
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.08 }}
                                whileHover={{ y: -6, scale: 1.02 }}
                            >
                                <div className="loan-card-header">
                                    <span className="loan-card-icon">
                                        {loan.loanType.toLowerCase().includes('car') ? '🚗' :
                                            loan.loanType.toLowerCase().includes('bike') ? '🏍️' :
                                                loan.loanType.toLowerCase().includes('truck') ? '🚛' : '🏦'}
                                    </span>
                                    <div>
                                        <h3>{loan.loanType}</h3>
                                        {loan.category && <span className="vl-cat-badge">{loan.category}</span>}
                                    </div>
                                </div>
                                <p className="loan-card-desc">{loan.description}</p>
                                <div className="loan-card-details">
                                    <div className="loan-detail">
                                        <span className="detail-label">Interest Rate</span>
                                        <span className="detail-value rate">{loan.interestRate}%</span>
                                    </div>
                                    <div className="loan-detail">
                                        <span className="detail-label">Max Amount</span>
                                        <span className="detail-value">₹{loan.maximumAmount.toLocaleString()}</span>
                                    </div>
                                </div>
                                <motion.button className="vlh-btn-primary vlh-btn-user apply-btn"
                                    onClick={() => navigate('/user/applyLoan', { state: { loan } })}
                                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                >
                                    Apply Now <FiArrowRight />
                                </motion.button>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
}

export default ViewAllLoans;
