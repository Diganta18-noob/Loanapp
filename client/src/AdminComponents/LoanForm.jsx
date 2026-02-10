import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { setSelectedLoan } from '../loanSlice';
import API from '../apiConfig';
import { toast } from 'react-toastify';
import AdminNavbar from './AdminNavbar';
import { FiSave, FiX, FiEdit } from 'react-icons/fi';
import './LoanForm.css';

function LoanForm() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { selectedLoan } = useSelector((state) => state.loan);
    const isEdit = !!selectedLoan;
    const [form, setForm] = useState({ loanType: '', category: 'Four Wheeler', description: '', interestRate: '', maximumAmount: '' });
    const categories = ['Two Wheeler', 'Four Wheeler', 'Commercial Vehicle', 'Electric Vehicle', 'Used Vehicle', 'Other'];
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (selectedLoan) setForm({ loanType: selectedLoan.loanType, category: selectedLoan.category || 'Four Wheeler', description: selectedLoan.description, interestRate: selectedLoan.interestRate, maximumAmount: selectedLoan.maximumAmount });
    }, [selectedLoan]);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const validate = () => {
        const e = {};
        if (!form.loanType) e.loanType = 'Required';
        if (!form.category) e.category = 'Required';
        if (!form.description) e.description = 'Required';
        if (!form.interestRate || Number(form.interestRate) <= 0) e.interestRate = 'Valid rate required';
        if (!form.maximumAmount || Number(form.maximumAmount) <= 0) e.maximumAmount = 'Valid amount required';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            const payload = { ...form, interestRate: Number(form.interestRate), maximumAmount: Number(form.maximumAmount) };
            if (isEdit) { await API.put(`/loan/update/${selectedLoan._id}`, payload); toast.success('Loan updated!'); }
            else { await API.post('/loan/add', payload); toast.success('Loan added!'); }
            dispatch(setSelectedLoan(null));
            navigate('/admin/viewLoans');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <AdminNavbar />
            <motion.div className="page-content"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            >
                <motion.div className="vlh-card loan-form-card" initial={{ scale: 0.97 }} animate={{ scale: 1 }} transition={{ duration: 0.3 }}>
                    <h2 className="form-card-title">{isEdit ? <><FiEdit /> Edit Loan</> : '➕ Add New Loan'}</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="vlh-form-row" style={{ marginBottom: '1.2rem' }}>
                            <div className="vlh-form-group">
                                <label className="vlh-label">Loan Type</label>
                                <input name="loanType" placeholder="e.g. Car Loan" value={form.loanType} onChange={handleChange}
                                    className={`vlh-input ${errors.loanType ? 'vlh-input-error' : ''}`} />
                                {errors.loanType && <span className="vlh-error-text">{errors.loanType}</span>}
                            </div>
                            <div className="vlh-form-group">
                                <label className="vlh-label">Category</label>
                                <select name="category" value={form.category} onChange={handleChange}
                                    className={`vlh-input ${errors.category ? 'vlh-input-error' : ''}`}>
                                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                                {errors.category && <span className="vlh-error-text">{errors.category}</span>}
                            </div>
                        </div>

                        <div className="vlh-form-row" style={{ marginBottom: '1.2rem' }}>
                            <div className="vlh-form-group">
                                <label className="vlh-label">Interest Rate (%)</label>
                                <input name="interestRate" type="number" step="0.1" placeholder="e.g. 5.5" value={form.interestRate} onChange={handleChange}
                                    className={`vlh-input ${errors.interestRate ? 'vlh-input-error' : ''}`} />
                                {errors.interestRate && <span className="vlh-error-text">{errors.interestRate}</span>}
                            </div>
                            <div className="vlh-form-group">
                                <label className="vlh-label">Maximum Amount (₹)</label>
                                <input name="maximumAmount" type="number" placeholder="e.g. 2500000" value={form.maximumAmount} onChange={handleChange}
                                    className={`vlh-input ${errors.maximumAmount ? 'vlh-input-error' : ''}`} />
                                {errors.maximumAmount && <span className="vlh-error-text">{errors.maximumAmount}</span>}
                            </div>
                        </div>

                        <div className="vlh-form-group">
                            <label className="vlh-label">Description</label>
                            <textarea name="description" placeholder="Describe this loan type..." value={form.description} onChange={handleChange}
                                className={`vlh-input lf-textarea ${errors.description ? 'vlh-input-error' : ''}`} rows={3} />
                            {errors.description && <span className="vlh-error-text">{errors.description}</span>}
                        </div>



                        <div className="lf-actions">
                            <motion.button type="submit" className="vlh-btn-primary" disabled={loading}
                                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                            >
                                {loading ? <span className="vlh-spinner"></span> : <><FiSave /> {isEdit ? 'Update Loan' : 'Add Loan'}</>}
                            </motion.button>
                            <motion.button type="button" className="vlh-btn-secondary"
                                onClick={() => { dispatch(setSelectedLoan(null)); navigate('/admin/viewLoans'); }}
                                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                            >
                                <FiX /> Cancel
                            </motion.button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </div>
    );
}

export default LoanForm;
