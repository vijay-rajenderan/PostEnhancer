import { useState, useEffect } from 'react';
import PostPreview from './components/PostPreview';
import HistorySidebar from './components/HistorySidebar';
import PersonaSettings from './components/PersonaSettings';
import { enhancePost, postToLinkedIn } from './services/api.service';
import { Sparkles, Clipboard, Check, LayoutGrid, Linkedin, Send, UserCircle } from 'lucide-react';
import './App.css';

function App() {
    const [rawContent, setRawContent] = useState('');
    const [enhancedContent, setEnhancedContent] = useState('');
    const [selectedStyle, setSelectedStyle] = useState('thoughtful');
    const [isLoading, setIsLoading] = useState(false);
    const [isPosting, setIsPosting] = useState(false);
    const [postStatus, setPostStatus] = useState({ type: '', message: '' });
    const [engagementScore, setEngagementScore] = useState(0);
    const [targetLength, setTargetLength] = useState(1500);

    // Persona State
    const [personaText, setPersonaText] = useState('');
    const [usePersona, setUsePersona] = useState(false);
    const [isPersonaModalOpen, setIsPersonaModalOpen] = useState(false);

    const styles = [
        { id: 'thoughtful', label: 'Thoughtful', icon: '🧠' },
        { id: 'contrarian', label: 'Contrarian', icon: '🔥' },
        { id: 'minimalist', label: 'Minimalist', icon: '💎' },
        { id: 'marketer', label: 'Hype', icon: '🚀' },
        { id: 'career', label: 'Career', icon: '💼' },
        { id: 'storyteller', label: 'Story', icon: '📖' },
        { id: 'hardtruths', label: 'Hard Truths', icon: '🛑' },
        { id: 'notebook', label: 'Notebook', icon: '📓' },
        { id: 'infographic', label: 'Visual', icon: '📊' }
    ];
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState('');
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const savedHistory = localStorage.getItem('li_enhancer_history');
        if (savedHistory) setHistory(JSON.parse(savedHistory));

        const savedPersona = localStorage.getItem('li_enhancer_persona');
        if (savedPersona) setPersonaText(savedPersona);

        const savedUsePersona = localStorage.getItem('li_enhancer_use_persona');
        if (savedUsePersona) setUsePersona(JSON.parse(savedUsePersona));
    }, []);

    // Save persona when it changes
    useEffect(() => {
        localStorage.setItem('li_enhancer_persona', personaText);
    }, [personaText]);

    useEffect(() => {
        localStorage.setItem('li_enhancer_use_persona', JSON.stringify(usePersona));
    }, [usePersona]);

    // Save history when it changes
    useEffect(() => {
        localStorage.setItem('li_enhancer_history', JSON.stringify(history));
    }, [history]);

    const handleEnhance = async () => {
        if (!rawContent.trim()) return;

        setIsLoading(true);
        setError('');
        try {
            const result = await enhancePost(
                rawContent,
                selectedStyle,
                targetLength,
                usePersona ? personaText : null
            );
            setEnhancedContent(result.enhancedContent);
            setEngagementScore(result.engagementScore);

            // Add to history (limit to 10 items)
            const newItem = {
                id: result.correlationId || Date.now().toString(),
                timestamp: new Date().toISOString(),
                rawContent,
                enhancedContent: result.enhancedContent,
                style: selectedStyle
            };
            setHistory(prev => [newItem, ...prev].slice(0, 10));

        } catch (err) {
            setError(err.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePostToLinkedIn = async () => {
        if (!enhancedContent) return;

        setIsPosting(true);
        setPostStatus({ type: '', message: '' });

        try {
            await postToLinkedIn(enhancedContent);
            setPostStatus({ type: 'success', message: 'Posted to LinkedIn!' });
            setTimeout(() => setPostStatus({ type: '', message: '' }), 5000);
        } catch (err) {
            setPostStatus({ type: 'error', message: err.message });
        } finally {
            setIsPosting(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(enhancedContent);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSelectHistory = (item) => {
        setRawContent(item.rawContent);
        setEnhancedContent(item.enhancedContent);
        setSelectedStyle(item.style);
    };

    const handleClearHistory = () => {
        if (window.confirm('Clear all your history?')) {
            setHistory([]);
        }
    };

    return (
        <div className="layout">
            <header className="navbar">
                <div className="logo">
                    <Sparkles className="icon-sparkle" size={24} />
                    <span>POSTENHANCER <span className="logo-ai">AI</span></span>
                </div>
                <nav className="nav-menu">
                    <span className="nav-item active">Dashboard</span>
                    <span className="nav-item">My Posts</span>
                    <span className="nav-item">History</span>
                </nav>
                <div className="nav-actions">
                    <button
                        className={`persona-trigger ${usePersona ? 'active' : ''}`}
                        onClick={() => setIsPersonaModalOpen(true)}
                    >
                        <UserCircle size={20} />
                        <span>Persona</span>
                    </button>
                </div>
            </header>

            <main className="main-content">
                <HistorySidebar
                    history={history}
                    onSelect={handleSelectHistory}
                    onClear={handleClearHistory}
                />
                <div className="workspace">
                    <div className="editor-section">
                        <div className="section-header">
                            <h2 className="premium-label">YOUR TECHNICAL BRAIN DUMP</h2>
                            <div className="length-selector">
                                <label>Target Length: <span>{targetLength} chars</span></label>
                                <input
                                    type="range"
                                    min="300"
                                    max="3000"
                                    step="100"
                                    value={targetLength}
                                    onChange={(e) => setTargetLength(parseInt(e.target.value))}
                                />
                            </div>
                        </div>

                        <div className="brain-dump-card">
                            <div className="card-body">
                                <textarea
                                    placeholder="Paste your raw, messy thoughts here..."
                                    value={rawContent}
                                    onChange={(e) => setRawContent(e.target.value)}
                                    disabled={isLoading}
                                />
                                <div className="card-footer">
                                    <button
                                        className="btn-primary"
                                        onClick={handleEnhance}
                                        disabled={isLoading || !rawContent.trim()}
                                    >
                                        {isLoading ? 'Enhancing...' : 'Enhance Post'}
                                        <Sparkles size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="style-palette">
                            <span className="palette-label">SELECT POST DNA:</span>
                            <div className="style-grid">
                                {styles.map(s => (
                                    <button
                                        key={s.id}
                                        className={`style-card ${selectedStyle === s.id ? 'active' : ''}`}
                                        onClick={() => setSelectedStyle(s.id)}
                                    >
                                        <span className="style-icon">{s.icon}</span>
                                        <span className="style-name">{s.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                        {error && <p className="error-msg">{error}</p>}
                    </div>

                    <div className="preview-section">
                        <div className="section-header">
                            <h2 className="premium-label"><span className="label-gold">PREMIUM</span> LINKEDIN PREVIEW</h2>
                            <div className="preview-controls">
                                {enhancedContent && (
                                    <span className={`char-count ${enhancedContent.length > 3000 ? 'over-limit' : ''}`}>
                                        {enhancedContent.length} / 3000
                                    </span>
                                )}
                                {enhancedContent && (
                                    <div className={`score-badge ${engagementScore >= 8 ? 'high' : engagementScore >= 5 ? 'medium' : 'low'}`}>
                                        Rating: {engagementScore}/10
                                    </div>
                                )}
                                {enhancedContent && (
                                    <button className="btn-secondary" onClick={handleCopy}>
                                        {copied ? <Check size={18} /> : <Clipboard size={18} />}
                                        {copied ? 'Copied' : 'Copy Text'}
                                    </button>
                                )}
                                {enhancedContent && (
                                    <button
                                        className={`btn-linkedin ${isPosting ? 'loading' : ''}`}
                                        onClick={handlePostToLinkedIn}
                                        disabled={isPosting}
                                    >
                                        <Linkedin size={18} />
                                        {isPosting ? 'Posting...' : 'Post to LinkedIn'}
                                    </button>
                                )}
                            </div>
                        </div>
                        {postStatus.message && (
                            <div className={`status-banner ${postStatus.type}`}>
                                {postStatus.message}
                            </div>
                        )}
                        <PostPreview
                            content={enhancedContent}
                            onEdit={setEnhancedContent}
                        />
                    </div>
                </div>
            </main>

            <PersonaSettings
                isOpen={isPersonaModalOpen}
                onClose={() => setIsPersonaModalOpen(false)}
                personaText={personaText}
                setPersonaText={setPersonaText}
                usePersona={usePersona}
                setUsePersona={setUsePersona}
            />
        </div>
    );
}

export default App;
