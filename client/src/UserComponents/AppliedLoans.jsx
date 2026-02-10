import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import API from '../apiConfig';
import { toast } from 'react-toastify';
import UserNavbar from './UserNavbar';
import DeleteModal from '../Components/DeleteModal';
import { FiTrash2, FiCalendar } from 'react-icons/fi';
import './AppliedLoans.css';

function AppliedLoans() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const { user } = useSelector((state) => state.user);

    const fetchApplications = async () => {
        try {
            const res = await API.get(`/loanApplication/getLoanApplicationsByUserId/${user?.id}`);
            setApplications(res.data);
        } catch { toast.error('Failed to fetch applications'); }
        finally { setLoading(false); }
    };

    useEffect(() => { if (user?.id) fetchApplications(); }, [user]);

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        try { await API.delete(`/loanApplication/delete/${deleteTarget}`); toast.success('Deleted!'); fetchApplications(); }
        catch { toast.error('Delete failed'); }
        finally { setDeleteTarget(null); }
    };

    const getStatusBadge = (s) => {
        if (s === 0) return <span className="vlh-badge vlh-badge-pending">Pending</span>;
        if (s === 1) return <span className="vlh-badge vlh-badge-approved">Approved</span>;
        return <span className="vlh-badge vlh-badge-rejected">Rejected</span>;
    };

    return (
        <div className="page-container">
            <UserNavbar />
            <motion.div className="page-content"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            >
                <h2 className="page-title" style={{ marginBottom: '2rem' }}>📄 My Applications</h2>

                {loading ? <div className="vlh-loading">Loading...</div> : applications.length === 0 ? <div className="vlh-empty">No applications yet. Browse available loans to apply!</div> : (
                    <div className="applied-grid">
                        {applications.map((app, i) => (
                            <motion.div key={app._id} className="vlh-card applied-card"
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.08 }}
                                whileHover={{ y: -4 }}
                            >
                                <div className="applied-card-top">
                                    <h3>{app.loanType}</h3>
                                    {getStatusBadge(app.loanStatus)}
                                </div>
                                <div className="applied-card-info">
                                    <div className="info-item">
                                        <span className="info-label">Income</span>
                                        <span className="info-value">₹{app.income?.toLocaleString()}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Purchase Price</span>
                                        <span className="info-value">₹{app.purchasePrice?.toLocaleString()}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Date</span>
                                        <span className="info-value"><FiCalendar /> {new Date(app.submissionDate).toLocaleDateString()}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Address</span>
                                        <span className="info-value al-addr">{app.address}</span>
                                    </div>
                                </div>
                                <motion.button className="al-delete-btn" onClick={() => setDeleteTarget(app._id)}
                                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                                >
                                    <FiTrash2 /> Delete Application
                                </motion.button>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>

            <DeleteModal
                isOpen={!!deleteTarget}
                onConfirm={confirmDelete}
                onCancel={() => setDeleteTarget(null)}
                title="Delete Application"
                message="Are you sure you want to delete this application? This action cannot be undone."
            />
        </div>
    );
}

export default AppliedLoans;
