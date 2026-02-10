import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertTriangle, FiTrash2, FiX } from 'react-icons/fi';
import './DeleteModal.css';

function DeleteModal({ isOpen, onConfirm, onCancel, title = 'Delete', message = 'Are you sure you want to delete?' }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div className="modal-overlay"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    onClick={onCancel}
                >
                    <motion.div className="modal-box"
                        initial={{ opacity: 0, scale: 0.85, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.85, y: 30 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-icon">
                            <FiAlertTriangle />
                        </div>
                        <h3 className="modal-title">{title}</h3>
                        <p className="modal-message">{message}</p>
                        <div className="modal-actions">
                            <motion.button className="modal-btn modal-btn-danger" onClick={onConfirm}
                                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                            >
                                <FiTrash2 /> Yes, Delete
                            </motion.button>
                            <motion.button className="modal-btn modal-btn-cancel" onClick={onCancel}
                                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                            >
                                <FiX /> Cancel
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default DeleteModal;
