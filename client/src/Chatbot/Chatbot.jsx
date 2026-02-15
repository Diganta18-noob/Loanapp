import { useState, useRef, useEffect, useCallback } from 'react';
import API from '../apiConfig';
import './Chatbot.css';

// ============================================================
//  SVG Icons (inline to avoid extra dependencies)
// ============================================================
const ChatIcon = () => (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z" />
        <path d="M7 9h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z" />
    </svg>
);

const CloseIcon = () => (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
    </svg>
);

const SendIcon = () => (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
    </svg>
);

const MinimizeIcon = () => (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 13H5v-2h14v2z" />
    </svg>
);

const BotAvatarIcon = () => (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="22" height="22">
        <path fill="#fff" d="M12 2a2 2 0 012 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 017 7v1a2 2 0 01-2 2h-1v1a2 2 0 01-2 2H8a2 2 0 01-2-2v-1H5a2 2 0 01-2-2v-1a7 7 0 017-7h1V5.73A2 2 0 0112 2zm-3 10a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm6 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
    </svg>
);

// ============================================================
//  Chatbot Component
// ============================================================
export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showBadge, setShowBadge] = useState(true);
    const [remaining, setRemaining] = useState(null); // null = unknown/admin, number = user limit
    const [dailyLimit, setDailyLimit] = useState(null);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Auto-scroll to bottom on new messages
    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading, scrollToBottom]);

    // Focus input when chat opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 350);
        }
    }, [isOpen]);

    const formatTime = () => {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Toggle chat window open/close
    const toggleChat = () => {
        if (isOpen) {
            setIsClosing(true);
            setTimeout(() => {
                setIsOpen(false);
                setIsClosing(false);
            }, 250);
        } else {
            setIsOpen(true);
            setShowBadge(false);
        }
    };

    // Send message to backend
    const sendMessage = async (messageText = null) => {
        const text = (messageText || input).trim();
        if (!text || isLoading) return;

        // Add user message
        const userMsg = {
            id: Date.now(),
            type: 'user',
            text,
            time: formatTime()
        };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                // User not logged in
                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    type: 'bot',
                    text: '🔒 Please log in to use the chatbot. Your session may have expired.',
                    time: formatTime(),
                    confidence: 'low'
                }]);
                setIsLoading(false);
                return;
            }

            const { data } = await API.get('/chatbot', { params: { q: text } });

            // Track remaining usage
            if (data.remaining !== undefined && data.remaining !== -1) {
                setRemaining(data.remaining);
                setDailyLimit(data.dailyLimit);
            }

            const botMsg = {
                id: Date.now() + 1,
                type: 'bot',
                text: data.message,
                time: formatTime(),
                confidence: data.confidence,
                responseType: data.type,
                suggestions: data.suggestions || [],
                relatedQuestions: data.relatedQuestions || [],
                matchedQuestion: data.matchedQuestion,
                score: data.score,
                isLimitReached: data.type === 'limit'
            };

            // If limit reached, update remaining to 0
            if (data.type === 'limit') {
                setRemaining(0);
                setDailyLimit(data.dailyLimit);
            }

            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            const errorMsg = {
                id: Date.now() + 1,
                type: 'bot',
                text: error.response?.data?.message || '⚠️ Something went wrong. Please try again.',
                time: formatTime(),
                confidence: 'low'
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const handleSuggestionClick = (text) => {
        sendMessage(text);
    };

    // Check if user is logged in
    const isLoggedIn = !!localStorage.getItem('token');

    return (
        <>
            {/* Floating Toggle Button */}
            <button
                className={`chatbot-toggle ${isOpen ? 'open' : ''}`}
                onClick={toggleChat}
                aria-label={isOpen ? 'Close chat' : 'Open chat'}
                id="chatbot-toggle-btn"
            >
                {isOpen ? <CloseIcon /> : <ChatIcon />}
                {showBadge && !isOpen && <span className="chatbot-badge" />}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className={`chatbot-window ${isClosing ? 'closing' : ''}`} id="chatbot-window">
                    {/* Header */}
                    <div className="chatbot-header">
                        <div className="chatbot-header-avatar">
                            <BotAvatarIcon />
                        </div>
                        <div className="chatbot-header-info">
                            <div className="chatbot-header-title">Loan Assistant</div>
                            <div className="chatbot-header-status">
                                <span className="online-dot" />
                                Always online
                            </div>
                        </div>
                        <button className="chatbot-header-close" onClick={toggleChat} aria-label="Minimize chat">
                            <MinimizeIcon />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="chatbot-messages" id="chatbot-messages">
                        {messages.length === 0 ? (
                            /* Welcome Screen */
                            <div className="chatbot-welcome">
                                <div className="chatbot-welcome-icon">🚗</div>
                                <h3>Vehicle Loan Assistant</h3>
                                <p>I can help you with loan types, interest rates, eligibility, application process, and more!</p>
                                {isLoggedIn && (
                                    <div className="chatbot-welcome-suggestions">
                                        {[
                                            "What types of vehicle loans are available?",
                                            "What is the interest rate?",
                                            "How do I apply for a loan?",
                                            "What documents are needed?"
                                        ].map((suggestion, idx) => (
                                            <button
                                                key={idx}
                                                className="chatbot-suggestion-chip"
                                                onClick={() => handleSuggestionClick(suggestion)}
                                            >
                                                {suggestion}
                                            </button>
                                        ))}
                                    </div>
                                )}
                                {!isLoggedIn && (
                                    <p style={{ color: 'rgba(255,200,100,0.8)', fontSize: '12px', marginTop: '8px' }}>
                                        🔒 Please log in to start chatting
                                    </p>
                                )}
                            </div>
                        ) : (
                            /* Message List */
                            messages.map((msg) => (
                                <div key={msg.id} className={`chatbot-message ${msg.type}`}>
                                    <div className="chatbot-msg-avatar">
                                        {msg.type === 'bot' ? '🤖' : '👤'}
                                    </div>
                                    <div className="chatbot-msg-content">
                                        <div className="chatbot-msg-bubble">
                                            {msg.text}
                                        </div>

                                        {/* Confidence Badge */}
                                        {msg.type === 'bot' && msg.confidence && (
                                            <span className={`chatbot-confidence ${msg.confidence}`}>
                                                {msg.confidence === 'high' ? '✓ ' : msg.confidence === 'medium' ? '~ ' : '? '}
                                                {msg.confidence} confidence
                                                {msg.score ? ` · ${msg.score}%` : ''}
                                            </span>
                                        )}

                                        {/* Suggestion Chips */}
                                        {msg.type === 'bot' && msg.suggestions && msg.suggestions.length > 0 && (
                                            <div className="chatbot-suggestions">
                                                {msg.suggestions.map((s, idx) => (
                                                    <button key={idx} className="chatbot-suggestion-chip" onClick={() => handleSuggestionClick(s)}>
                                                        {s}
                                                    </button>
                                                ))}
                                            </div>
                                        )}

                                        {/* Related Questions */}
                                        {msg.type === 'bot' && msg.relatedQuestions && msg.relatedQuestions.length > 0 && (
                                            <div className="chatbot-suggestions">
                                                {msg.relatedQuestions.map((rq, idx) => (
                                                    <button key={idx} className="chatbot-suggestion-chip" onClick={() => handleSuggestionClick(rq.question)}>
                                                        {rq.question}
                                                    </button>
                                                ))}
                                            </div>
                                        )}

                                        <span className="chatbot-msg-time">{msg.time}</span>
                                    </div>
                                </div>
                            ))
                        )}

                        {/* Typing Indicator */}
                        {isLoading && (
                            <div className="chatbot-message bot">
                                <div className="chatbot-msg-avatar">🤖</div>
                                <div className="chatbot-typing">
                                    <div className="chatbot-typing-dots">
                                        <span /><span /><span />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="chatbot-input-area">
                        <div className="chatbot-input-wrapper">
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder={!isLoggedIn ? "Please log in first..." : remaining === 0 ? "Daily limit reached..." : "Ask about vehicle loans..."}
                                disabled={!isLoggedIn || isLoading || remaining === 0}
                                id="chatbot-input"
                            />
                            <button
                                className="chatbot-send-btn"
                                onClick={() => sendMessage()}
                                disabled={!input.trim() || isLoading || !isLoggedIn || remaining === 0}
                                aria-label="Send message"
                                id="chatbot-send-btn"
                            >
                                <SendIcon />
                            </button>
                        </div>
                        {/* Usage Counter */}
                        {remaining !== null && dailyLimit && (
                            <div className="chatbot-usage-counter">
                                <div className="chatbot-usage-bar">
                                    <div className="chatbot-usage-fill" style={{ width: `${(remaining / dailyLimit) * 100}%` }} />
                                </div>
                                <span className="chatbot-usage-text">
                                    {remaining}/{dailyLimit} messages remaining today
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
