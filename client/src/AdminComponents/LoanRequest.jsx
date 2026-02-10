import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../apiConfig';
import { toast } from 'react-toastify';
import AdminNavbar from './AdminNavbar';
import { FiSearch, FiCheck, FiX, FiChevronLeft, FiChevronRight, FiEye } from 'react-icons/fi';
import './LoanRequest.css';

function LoanRequest() {
    const [applications, setApplications] = useState([]);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null);

    const fetchApplications = async () => {
        setLoading(true);
        try {
            const res = await API.post('/loanApplication/getAllLoanApplications', {
                searchValue: search, statusFilter: statusFilter, pageNo: page, pageSize: 8
            });
            setApplications(res.data.data || []);
            setTotalPages(Math.ceil((res.data.total || 0) / 8) || 1);
        } catch { toast.error('Failed to fetch'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchApplications(); }, [page, search, statusFilter]);

    const updateStatus = async (id, status) => {
        try {
            await API.put(`/loanApplication/update/${id}`, { loanStatus: status });
            toast.success(status === 1 ? 'Approved!' : 'Rejected!');
            fetchApplications();
        } catch { toast.error('Update failed'); }
    };

    const statusFilters = [
        { label: 'All', value: '' },
        { label: 'Pending', value: '0' },
        { label: 'Approved', value: '1' },
        { label: 'Rejected', value: '2' },
    ];

    const getStatusBadge = (s) => {
        if (s === 0) return <span className="vlh-badge vlh-badge-pending">Pending</span>;
        if (s === 1) return <span className="vlh-badge vlh-badge-approved">Approved</span>;
        return <span className="vlh-badge vlh-badge-rejected">Rejected</span>;
    };

    return (
        <div className="page-container">
            <AdminNavbar />
            <motion.div className="page-content"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            >
                <div className="page-header">
                    <h2 className="page-title">📋 Loan Requests</h2>
                    <div className="lr-filters">
                        <div className="vlh-search">
                            <FiSearch />
                            <input placeholder="Search..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
                        </div>
                        <div className="lr-status-tabs">
                            {statusFilters.map((f) => (
                                <motion.button key={f.label}
                                    className={`lr-tab ${statusFilter === f.value ? 'active' : ''}`}
                                    onClick={() => { setStatusFilter(f.value); setPage(1); }}
                                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                >
                                    {f.label}
                                </motion.button>
                            ))}
                        </div>
                    </div>
                </div>

                {loading ? <div className="vlh-loading">Loading requests...</div> : applications.length === 0 ? <div className="vlh-empty">No applications found</div> : (
                    <motion.div className="vlh-table-wrap"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                    >
                        <table className="vlh-table">
                            <thead><tr><th>Applicant</th><th>Loan Type</th><th>Income</th><th>Price</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
                            <tbody>
                                {applications.map((app, i) => (
                                    <React.Fragment key={app._id}>
                                        <motion.tr
                                            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.04 }}
                                        >
                                            <td>{app.userName}</td>
                                            <td className="vl-type-badge">{app.loanType}</td>
                                            <td>₹{app.income?.toLocaleString()}</td>
                                            <td>₹{app.purchasePrice?.toLocaleString()}</td>
                                            <td>{new Date(app.submissionDate).toLocaleDateString()}</td>
                                            <td>{getStatusBadge(app.loanStatus)}</td>
                                            <td>
                                                <div className="vl-actions">
                                                    <motion.button className="vlh-icon-btn vlh-icon-btn-info" onClick={() => setExpandedId(expandedId === app._id ? null : app._id)}
                                                        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} title="Show More"
                                                    ><FiEye /></motion.button>
                                                    {app.loanStatus === 0 && (
                                                        <>
                                                            <motion.button className="vlh-icon-btn vlh-icon-btn-approve" onClick={() => updateStatus(app._id, 1)}
                                                                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} title="Approve"
                                                            ><FiCheck /></motion.button>
                                                            <motion.button className="vlh-icon-btn vlh-icon-btn-reject" onClick={() => updateStatus(app._id, 2)}
                                                                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} title="Reject"
                                                            ><FiX /></motion.button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </motion.tr>
                                        <AnimatePresence>
                                            {expandedId === app._id && (
                                                <motion.tr key={`${app._id}-detail`} className="detail-row"
                                                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }}
                                                >
                                                    <td colSpan="7">
                                                        <div className="detail-content">
                                                            <div className="detail-grid">
                                                                <div><span className="detail-label-sm">Address</span><span>{app.address || 'N/A'}</span></div>
                                                                <div><span className="detail-label-sm">Model Year</span><span>{app.model ? new Date(app.model).getFullYear() : 'N/A'}</span></div>
                                                                <div><span className="detail-label-sm">User ID</span><span className="detail-mono">{app.userId}</span></div>
                                                                {app.file && (
                                                                    <div>
                                                                        <span className="detail-label-sm">Document</span>
                                                                        <button className="doc-view-btn" onClick={() => {
                                                                            try {
                                                                                const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                                                                                const fileUrl = `${baseUrl}/uploads/${app.file}`;
                                                                                window.open(fileUrl, '_blank');
                                                                            } catch { toast.error('Could not open document'); }
                                                                        }}>📎 View Document</button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            )}
                                        </AnimatePresence>
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </motion.div>
                )}

                {totalPages > 1 && (
                    <div className="vlh-pagination">
                        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}><FiChevronLeft /> Prev</button>
                        <span>Page {page} of {totalPages}</span>
                        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next <FiChevronRight /></button>
                    </div>
                )}
            </motion.div>
        </div>
    );
}

export default LoanRequest;
