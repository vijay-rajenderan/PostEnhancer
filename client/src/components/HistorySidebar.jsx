import React from 'react';
import { History, Trash2, Clock, ChevronRight } from 'lucide-react';
import '../styles/HistorySidebar.css';

const HistorySidebar = ({ history, onSelect, onClear }) => {
    if (history.length === 0) {
        return (
            <div className="history-empty">
                <History size={32} />
                <p>No history yet</p>
                <span>Enhanced posts will appear here</span>
            </div>
        );
    }

    return (
        <div className="history-container">
            <div className="history-header">
                <h3><Clock size={16} /> Recent History</h3>
                <button className="clear-btn" onClick={onClear} title="Clear all history">
                    <Trash2 size={14} />
                </button>
            </div>
            <div className="history-list">
                {history.map((item) => (
                    <div
                        key={item.id}
                        className="history-item"
                        onClick={() => onSelect(item)}
                    >
                        <div className="item-meta">
                            <span className="item-style">{item.style}</span>
                            <span className="item-date">
                                {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                        <p className="item-snippet">{item.rawContent.substring(0, 60)}...</p>
                        <ChevronRight size={14} className="chevron" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HistorySidebar;
