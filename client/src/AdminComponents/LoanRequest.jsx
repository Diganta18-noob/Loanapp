import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../apiConfig';
import { toast } from 'react-toastify';
import AdminNavbar from './AdminNavbar';
import { FiSearch, FiCheck, FiX, FiEye } from 'react-icons/fi';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    ToggleButton, ToggleButtonGroup, Button, IconButton, Chip, Tooltip,
    ThemeProvider, createTheme, CssBaseline, Box, Typography, TextField, InputAdornment
} from '@mui/material';
import './LoanRequest.css';

// Dark Theme for MUI
const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: { main: '#667eea' },
        background: { paper: '#1a1a2e', default: '#0f0f19' },
        text: { primary: '#fff', secondary: 'rgba(255, 255, 255, 0.7)' },
    },
    components: {
        MuiPaper: { styleOverrides: { root: { backgroundImage: 'none', backgroundColor: 'rgba(26, 26, 46, 0.8)', backdropFilter: 'blur(10px)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' } } },
        MuiTableCell: { styleOverrides: { root: { borderBottom: '1px solid rgba(255, 255, 255, 0.05)', color: 'rgba(255, 255, 255, 0.8)' }, head: { fontWeight: 600, color: '#fff', backgroundColor: 'rgba(255, 255, 255, 0.05)' } } },
        MuiToggleButton: { styleOverrides: { root: { color: 'rgba(255, 255, 255, 0.6)', borderColor: 'rgba(255, 255, 255, 0.1)', '&.Mui-selected': { backgroundColor: 'rgba(102, 126, 234, 0.2)', color: '#fff', '&:hover': { backgroundColor: 'rgba(102, 126, 234, 0.3)' } } } } },
    }
});

function LoanRequest() {
    const [applications, setApplications] = useState([]);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null);
    const [docPreview, setDocPreview] = useState(null);

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

    const handleFormat = (event, newFormat) => {
        if (newFormat !== null) {
            setStatusFilter(newFormat);
            setPage(1);
        }
    };

    const getStatusChip = (s) => {
        if (s === 0) return <Chip label="Pending" size="small" sx={{ bgcolor: 'rgba(255, 193, 7, 0.15)', color: '#ffc107', fontWeight: 600 }} />;
        if (s === 1) return <Chip label="Approved" size="small" sx={{ bgcolor: 'rgba(76, 175, 80, 0.15)', color: '#66bb6a', fontWeight: 600 }} />;
        return <Chip label="Rejected" size="small" sx={{ bgcolor: 'rgba(244, 67, 54, 0.15)', color: '#ef5350', fontWeight: 600 }} />;
    };

    return (
        <ThemeProvider theme={darkTheme}>
            <div className="page-container">
                <AdminNavbar />
                <motion.div className="page-content" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                        <Typography variant="h5" component="h2" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                            📋 Loan Requests
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                            <TextField
                                placeholder="Search..."
                                variant="outlined"
                                size="small"
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><FiSearch color="gray" /></InputAdornment>,
                                    sx: { bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2, '& fieldset': { border: 'none' } }
                                }}
                            />
                            <ToggleButtonGroup
                                value={statusFilter}
                                exclusive
                                onChange={handleFormat}
                                aria-label="status filter"
                                size="small"
                            >
                                <ToggleButton value="">All</ToggleButton>
                                <ToggleButton value="0">Pending</ToggleButton>
                                <ToggleButton value="1">Approved</ToggleButton>
                                <ToggleButton value="2">Rejected</ToggleButton>
                            </ToggleButtonGroup>
                        </Box>
                    </Box>

                    {loading ? <div className="vlh-loading">Loading requests...</div> : applications.length === 0 ? <div className="vlh-empty">No applications found</div> : (
                        <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Applicant</TableCell>
                                        <TableCell>Loan Type</TableCell>
                                        <TableCell>Income</TableCell>
                                        <TableCell>Price</TableCell>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {applications.map((app) => (
                                        <React.Fragment key={app._id}>
                                            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                <TableCell component="th" scope="row">{app.userName}</TableCell>
                                                <TableCell><Chip label={app.loanType} variant="outlined" size="small" sx={{ borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.8)' }} /></TableCell>
                                                <TableCell>₹{app.income?.toLocaleString()}</TableCell>
                                                <TableCell>₹{app.purchasePrice?.toLocaleString()}</TableCell>
                                                <TableCell>{new Date(app.submissionDate).toLocaleDateString()}</TableCell>
                                                <TableCell>{getStatusChip(app.loanStatus)}</TableCell>
                                                <TableCell align="right">
                                                    <Tooltip title="View Details">
                                                        <IconButton onClick={() => setExpandedId(expandedId === app._id ? null : app._id)} color="primary" size="small">
                                                            <FiEye />
                                                        </IconButton>
                                                    </Tooltip>
                                                    {app.loanStatus === 0 && (
                                                        <>
                                                            <Tooltip title="Approve">
                                                                <IconButton onClick={() => updateStatus(app._id, 1)} color="success" size="small">
                                                                    <FiCheck />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title="Reject">
                                                                <IconButton onClick={() => updateStatus(app._id, 2)} color="error" size="small">
                                                                    <FiX />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                            {expandedId === app._id && (
                                                <TableRow>
                                                    <TableCell colSpan={7} sx={{ py: 0, borderBottom: 'none' }}>
                                                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}>
                                                            <Box sx={{ p: 2, bgcolor: 'rgba(0,0,0,0.2)', borderRadius: 2, m: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
                                                                <Box><Typography variant="caption" color="text.secondary">Address</Typography><Typography variant="body2">{app.address || 'N/A'}</Typography></Box>
                                                                <Box><Typography variant="caption" color="text.secondary">Model Year</Typography><Typography variant="body2">{app.model ? new Date(app.model).getFullYear() : 'N/A'}</Typography></Box>
                                                                <Box><Typography variant="caption" color="text.secondary">User ID</Typography><Typography variant="body2" sx={{ fontFamily: 'monospace', opacity: 0.7 }}>{app.userId}</Typography></Box>
                                                                {app.file && (
                                                                    <Box>
                                                                        <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>Document</Typography>
                                                                        <Button variant="outlined" size="small" onClick={() => {
                                                                            try {
                                                                                const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                                                                                setDocPreview(`${baseUrl}/uploads/${app.file}`);
                                                                            } catch { toast.error('Error'); }
                                                                        }}>View Document</Button>
                                                                    </Box>
                                                                )}
                                                            </Box>
                                                        </motion.div>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}

                    {totalPages > 1 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, gap: 2 }}>
                            <Button variant="outlined" disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Previous</Button>
                            <Typography sx={{ alignSelf: 'center' }}>Page {page} of {totalPages}</Typography>
                            <Button variant="outlined" disabled={page === totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>Next</Button>
                        </Box>
                    )}
                </motion.div>

                {/* Document Preview Modal */}
                <AnimatePresence>
                    {docPreview && (
                        <motion.div className="doc-preview-overlay" onClick={() => setDocPreview(null)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <motion.div className="doc-preview-modal" onClick={(e) => e.stopPropagation()} initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 30 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }}>
                                <div className="doc-preview-header">
                                    <h3>📄 Document Preview</h3>
                                    <button className="doc-preview-close" onClick={() => setDocPreview(null)}>✕</button>
                                </div>
                                <div className="doc-preview-body">
                                    {/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(docPreview) ? (
                                        <img src={docPreview} alt="Document Preview" className="doc-preview-img" />
                                    ) : (
                                        <iframe src={docPreview} title="Document Preview" className="doc-preview-iframe" />
                                    )}
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </ThemeProvider>
    );
}

export default LoanRequest;
