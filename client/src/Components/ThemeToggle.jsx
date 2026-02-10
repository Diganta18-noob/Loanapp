import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../ThemeContext';
import { FiChevronDown } from 'react-icons/fi';
import './ThemeToggle.css';

function ThemeToggle() {
    const { currentTheme, setCurrentTheme, themes, themeList } = useTheme();
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="theme-toggle-wrap" ref={ref}>
            <motion.button
                className="theme-toggle-btn"
                onClick={() => setOpen(!open)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <span className="theme-toggle-emoji">{themes[currentTheme].emoji}</span>
                <span className="theme-toggle-name">{themes[currentTheme].name}</span>
                <motion.span
                    animate={{ rotate: open ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="theme-toggle-chevron"
                >
                    <FiChevronDown />
                </motion.span>
            </motion.button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        className="theme-dropdown"
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                    >
                        {themeList.map((key, i) => (
                            <motion.button
                                key={key}
                                className={`theme-option ${currentTheme === key ? 'active' : ''}`}
                                onClick={() => { setCurrentTheme(key); setOpen(false); }}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.04 }}
                                whileHover={{ x: 4 }}
                            >
                                <span className="theme-option-emoji">{themes[key].emoji}</span>
                                <span className="theme-option-name">{themes[key].name}</span>
                                {currentTheme === key && (
                                    <motion.span
                                        className="theme-check"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: 'spring', stiffness: 500 }}
                                    >
                                        ✓
                                    </motion.span>
                                )}
                            </motion.button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default ThemeToggle;
