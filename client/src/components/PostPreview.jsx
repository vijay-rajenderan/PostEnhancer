import React from 'react';
import { ThumbsUp, MessageSquare, Share2, Send, FileText, Info, Bold, Italic, Sparkles, Loader2 } from 'lucide-react';
import VisualInfographic from './VisualInfographic';
import { formatToBold, formatToItalic } from '../utils/textFormatter';
import { smartPolish } from '../services/api.service';
import '../styles/PostPreview.css';

const PostPreview = ({ content, onEdit }) => {
    const [isPolishing, setIsPolishing] = React.useState(false);
    const textareaRef = React.useRef(null);
    const handleFormat = (type) => {
        if (!textareaRef.current) return;

        const start = textareaRef.current.selectionStart;
        const end = textareaRef.current.selectionEnd;
        const selectedText = content.substring(start, end);

        if (!selectedText) return;

        let formattedText = selectedText;
        if (type === 'bold') formattedText = formatToBold(selectedText);
        if (type === 'italic') formattedText = formatToItalic(selectedText);

        const newContent = content.substring(0, start) + formattedText + content.substring(end);
        onEdit(newContent);
    };

    const handleSmartPolish = async () => {
        setIsPolishing(true);
        try {
            const result = await smartPolish(content);
            if (result.polishedContent) {
                onEdit(result.polishedContent);
            }
        } catch (error) {
            console.error('Smart Polish Error:', error);
        } finally {
            setIsPolishing(false);
        }
    };

    if (!content) {
        return (
            <div className="preview-card">
                <div className="placeholder-text">
                    Your enhanced, scroll-stopping post will appear here...
                </div>
            </div>
        );
    }

    const isInfographic = content.includes('```mermaid');
    const isNotebook = content.includes('##');
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    return (
        <div className={`preview-card ${isNotebook ? 'notebook-mode' : ''}`}>
            <div className="preview-header">
                <div className="avatar-placeholder">
                    {isNotebook ? <FileText size={20} /> : (isInfographic ? <Info size={20} /> : 'ME')}
                </div>
                <div className="user-info">
                    <span className="user-name">
                        {isNotebook ? 'Notebook Digest' : (isInfographic ? 'Visual Insight' : 'Professional Creator')}
                    </span>
                    <span className="user-headline">
                        {isNotebook ? 'LLM Briefing' : (isInfographic ? 'Structural Breakdown' : `Opinionated Engineer • ${today}`)}
                    </span>
                </div>
            </div>

            <div className="preview-body">
                {isInfographic && <VisualInfographic content={content} />}

                <div className="edit-toolbar">
                    <button
                        className="toolbar-btn"
                        title="Bold"
                        onClick={() => handleFormat('bold')}
                        disabled={isInfographic || isNotebook}
                    >
                        <Bold size={14} />
                    </button>
                    <button
                        className="toolbar-btn"
                        title="Italic"
                        onClick={() => handleFormat('italic')}
                        disabled={isInfographic || isNotebook}
                    >
                        <Italic size={14} />
                    </button>
                    <div className="toolbar-divider"></div>
                    <button
                        className={`toolbar-btn smart-polish ${isPolishing ? 'loading' : ''}`}
                        title="AI Smart Format"
                        onClick={handleSmartPolish}
                        disabled={isInfographic || isNotebook || isPolishing}
                    >
                        {isPolishing ? <Loader2 size={14} className="spin" /> : <Sparkles size={14} />}
                        <span>Smart Format</span>
                    </button>
                </div>

                <textarea
                    ref={textareaRef}
                    className="editable-content"
                    value={content.replace(/```mermaid[\s\S]*?```/g, '')}
                    onChange={(e) => onEdit(e.target.value)}
                    rows={12}
                    placeholder="Refine your post here..."
                />
            </div>

            {!isNotebook && !isInfographic && (
                <div className="preview-footer">
                    <div className="footer-item"><ThumbsUp size={16} /> Like</div>
                    <div className="footer-item"><MessageSquare size={16} /> Comment</div>
                    <div className="footer-item"><Share2 size={16} /> Share</div>
                    <div className="footer-item"><Send size={16} /> Send</div>
                </div>
            )}
        </div>
    );
};

export default PostPreview;
