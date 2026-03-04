import React, { useState } from 'react';
import { UserCircle, ShieldCheck, FileText, X } from 'lucide-react';
import './PersonaSettings.css';

const PersonaSettings = ({ isOpen, onClose, personaText, setPersonaText, usePersona, setUsePersona }) => {
    if (!isOpen) return null;

    return (
        <div className="persona-overlay" onClick={onClose}>
            <div className="persona-modal" onClick={e => e.stopPropagation()}>
                <div className="persona-header">
                    <div className="title">
                        <UserCircle className="icon" size={24} />
                        <h3>AI Architect Persona</h3>
                    </div>
                    <button className="close-btn" onClick={onClose}><X size={20} /></button>
                </div>

                <div className="persona-body">
                    <p className="description">
                        Paste your resume or professional bio here. This grounds the AI in your actual experience to create an authoritative "AI Architect" voice.
                    </p>

                    <div className="toggle-group">
                        <label className="switch">
                            <input
                                type="checkbox"
                                checked={usePersona}
                                onChange={(e) => setUsePersona(e.target.checked)}
                            />
                            <span className="slider round"></span>
                        </label>
                        <span className="toggle-label">Enable Custom Persona (Overrides Base Styles)</span>
                    </div>

                    <textarea
                        placeholder="Paste your resume, experience, and key skills here..."
                        value={personaText}
                        onChange={(e) => setPersonaText(e.target.value)}
                        className="resume-input"
                    />

                    <div className="persona-features">
                        <div className="feature">
                            <ShieldCheck size={16} />
                            <span>Professional Emojis Only</span>
                        </div>
                        <div className="feature">
                            <FileText size={16} />
                            <span>Grounds in Experience</span>
                        </div>
                    </div>
                </div>

                <div className="persona-footer">
                    <button className="btn-save" onClick={onClose}>Apply Persona</button>
                </div>
            </div>
        </div>
    );
};

export default PersonaSettings;
