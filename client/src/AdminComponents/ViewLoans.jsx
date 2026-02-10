import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { setSelectedLoan } from '../loanSlice';
import API from '../apiConfig';
import { toast } from 'react-toastify';
import AdminNavbar from './AdminNavbar';
import DeleteModal from '../Components/DeleteModal';
import { FiSearch, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import './ViewLoans.css';

function ViewLoans() {
    const [loans, setLoans] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const fetchLoans = async () => {
        try {
            const res = await API.get('/loan/getAll');
            setLoans(res.data);
        } catch {
            toast.error('Failed to fetch loans');
        } finally { setLoading(false); }
    };

    useEffect(() => { fetchLoans(); }, []);

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        try { await API.delete(`/loan/delete/${deleteTarget}`); toast.success('Loan deleted!'); fetchLoans(); }
        catch { toast.error('Delete failed'); }
        finally { setDeleteTarget(null); }
    };

    const handleEdit = (loan) => {
        dispatch(setSelectedLoan(loan));
        navigate('/admin/loanForm');
    };

    const filtered = loans.filter((l) => l.loanType.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="page-container">
            <AdminNavbar />
            <motion.div className="page-content"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            >
                <div className="page-header">
                    <h2 className="page-title">🏦 Manage Loans</h2>
                    <div className="vl-header-actions">
                        <div className="vlh-search">
                            <FiSearch />
                            <input placeholder="Search loans..." value={search} onChange={(e) => setSearch(e.target.value)} />
                        </div>
                        <motion.button className="vlh-btn-primary vl-add-btn" onClick={() => { dispatch(setSelectedLoan(null)); navigate('/admin/loanForm'); }}
                            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                        >
                            <FiPlus /> Add Loan
                        </motion.button>
                    </div>
                </div>

                {loading ? <div className="vlh-loading">Loading loans...</div> : filtered.length === 0 ? <div className="vlh-empty">No loans found</div> : (
                    <motion.div className="vlh-table-wrap"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                    >
                        <table className="vlh-table">
                            <thead><tr><th>Loan Type</th><th>Category</th><th>Description</th><th>Rate %</th><th>Max Amount</th><th>Actions</th></tr></thead>
                            <tbody>
                                {filtered.map((loan, i) => (
                                    <motion.tr key={loan._id}
                                        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                    >
                                        <td><span className="vl-type-badge">{loan.loanType}</span></td>
                                        <td><span className="vl-cat-badge">{loan.category || 'N/A'}</span></td>
                                        <td className="vl-desc">{loan.description}</td>
                                        <td><span className="vl-rate">{loan.interestRate}%</span></td>
                                        <td>₹{loan.maximumAmount.toLocaleString()}</td>
                                        <td>
                                            <div className="vl-actions">
                                                <motion.button className="vlh-icon-btn vlh-icon-btn-edit" onClick={() => handleEdit(loan)}
                                                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                                                ><FiEdit2 /></motion.button>
                                                <motion.button className="vlh-icon-btn vlh-icon-btn-delete" onClick={() => setDeleteTarget(loan._id)}
                                                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                                                ><FiTrash2 /></motion.button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </motion.div>
                )}
            </motion.div>

            <DeleteModal
                isOpen={!!deleteTarget}
                onConfirm={confirmDelete}
                onCancel={() => setDeleteTarget(null)}
                title="Delete Loan"
                message="Are you sure you want to delete this loan? This action cannot be undone."
            />
        </div>
    );
}

export default ViewLoans;
