import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import API from '../apiConfig';
import { toast } from 'react-toastify';
import UserNavbar from './UserNavbar';
import { FiSend, FiX } from 'react-icons/fi';
import './LoanApplicationForm.css';

function LoanApplicationForm() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.user);
    const selectedLoan = location.state?.loan || null;
    const today = new Date().toISOString().split('T')[0];

    const [form, setForm] = useState({
        loanType: selectedLoan?.loanType || '',
        submissionDate: today,
        income: '', model: '', purchasePrice: '', address: '',
    });
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Clear error on type
        if (errors[name]) {
            setErrors(prev => {
                const updated = { ...prev };
                delete updated[name];
                return updated;
            });
        }
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setFileName(selectedFile.name);
            // Clear file error
            if (errors.file) {
                setErrors(prev => {
                    const updated = { ...prev };
                    delete updated.file;
                    return updated;
                });
            }
        }
    };

    const validate = () => {
        const e = {};
        if (!form.loanType) e.loanType = 'Required';
        if (!form.income || Number(form.income) <= 0) e.income = 'Valid income required';
        if (!form.model) e.model = 'Required';
        if (!form.purchasePrice || Number(form.purchasePrice) <= 0) e.purchasePrice = 'Valid price required';
        if (!form.address) e.address = 'Required';
        if (!file) e.file = 'Document required';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (ev) => {
        ev.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('loanType', form.loanType);
            formData.append('submissionDate', form.submissionDate);
            formData.append('income', Number(form.income));
            formData.append('model', form.model);
            formData.append('purchasePrice', Number(form.purchasePrice));
            formData.append('address', form.address);
            formData.append('userId', user?.id);
            formData.append('userName', user?.userName);
            formData.append('file', file);

            await API.post('/loanApplication/add', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            toast.success('Application submitted!');
            navigate('/user/appliedLoans');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Submission failed');
        } finally { setLoading(false); }
    };

    return (
        <div className="page-container">
            <UserNavbar />
            <motion.div className="page-content"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            >
                <motion.div className="vlh-card app-form-card"
                    initial={{ scale: 0.97 }} animate={{ scale: 1 }} transition={{ duration: 0.3 }}
                >
                    <h2 className="form-card-title">📝 Loan Application</h2>
                    <p className="app-form-sub">Fill in the details to apply for a loan</p>
                    <form onSubmit={handleSubmit}>
                        <motion.div className="vlh-form-row" style={{ marginBottom: '1.2rem' }}
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        >
                            <div className="vlh-form-group">
                                <label className="vlh-label">Loan Type</label>
                                <input name="loanType" value={form.loanType} onChange={handleChange}
                                    className={`vlh-input ${errors.loanType ? 'vlh-input-error' : ''}`}
                                    readOnly={!!selectedLoan} placeholder="Loan type" />
                                {errors.loanType && <span className="vlh-error-text">{errors.loanType}</span>}
                            </div>
                            <div className="vlh-form-group">
                                <label className="vlh-label">Submission Date</label>
                                <input name="submissionDate" type="date" value={form.submissionDate} onChange={handleChange}
                                    min={today}
                                    className="vlh-input vlh-date-input" />
                            </div>
                        </motion.div>

                        <motion.div className="vlh-form-row" style={{ marginBottom: '1.2rem' }}
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        >
                            <div className="vlh-form-group">
                                <label className="vlh-label">Annual Income (₹)</label>
                                <input name="income" type="number" placeholder="e.g. 500000" value={form.income} onChange={handleChange}
                                    className={`vlh-input ${errors.income ? 'vlh-input-error' : ''}`} />
                                {errors.income && <span className="vlh-error-text">{errors.income}</span>}
                            </div>
                            <div className="vlh-form-group">
                                <label className="vlh-label">Vehicle Model Year</label>
                                <input name="model" type="date" value={form.model} onChange={handleChange}
                                    className={`vlh-input ${errors.model ? 'vlh-input-error' : ''}`} />
                                {errors.model && <span className="vlh-error-text">{errors.model}</span>}
                            </div>
                        </motion.div>

                        <motion.div className="vlh-form-row" style={{ marginBottom: '1.2rem' }}
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                        >
                            <div className="vlh-form-group">
                                <label className="vlh-label">Purchase Price (₹)</label>
                                <input name="purchasePrice" type="number" placeholder="e.g. 800000" value={form.purchasePrice} onChange={handleChange}
                                    className={`vlh-input ${errors.purchasePrice ? 'vlh-input-error' : ''}`} />
                                {errors.purchasePrice && <span className="vlh-error-text">{errors.purchasePrice}</span>}
                            </div>
                            <div className="vlh-form-group">
                                <label className="vlh-label">Address</label>
                                <input name="address" placeholder="Your address" value={form.address} onChange={handleChange}
                                    className={`vlh-input ${errors.address ? 'vlh-input-error' : ''}`} />
                                {errors.address && <span className="vlh-error-text">{errors.address}</span>}
                            </div>
                        </motion.div>

                        <motion.div className="vlh-form-group"
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                        >
                            <label className="vlh-label">Upload Document</label>
                            <div className="file-upload-area">
                                <input type="file" id="file-input" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" />
                                <label htmlFor="file-input" className="file-upload-label">
                                    {fileName || 'Choose file (PDF, JPG, PNG)'}
                                </label>
                            </div>
                            {errors.file && <span className="vlh-error-text">{errors.file}</span>}
                        </motion.div>

                        <div className="lf-actions">
                            <motion.button type="submit" className="vlh-btn-primary vlh-btn-user" disabled={loading}
                                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                            >
                                {loading ? <span className="vlh-spinner"></span> : <><FiSend /> Submit Application</>}
                            </motion.button>
                            <motion.button type="button" className="vlh-btn-secondary"
                                onClick={() => navigate('/user/viewAllLoans')}
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

export default LoanApplicationForm;
