import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
    startOnLoad: true,
    theme: 'base',
    themeVariables: {
        primaryColor: '#0a66c2',
        primaryTextColor: '#fff',
        primaryBorderColor: '#0a66c2',
        lineColor: '#0a66c2',
        secondaryColor: '#f8fafc',
        tertiaryColor: '#fff',
    },
    securityLevel: 'loose',
});

const VisualInfographic = ({ content }) => {
    const chartRef = useRef(null);

    // Extract mermaid code from content
    const mermaidMatch = content.match(/```mermaid\n([\s\S]*?)\n```/);
    const mermaidSource = mermaidMatch ? mermaidMatch[1] : null;

    useEffect(() => {
        if (mermaidSource && chartRef.current) {
            chartRef.current.innerHTML = `<div class="mermaid">${mermaidSource}</div>`;
            mermaid.contentLoaded();
        }
    }, [mermaidSource]);

    if (!mermaidSource) return null;

    return (
        <div className="infographic-render">
            <div ref={chartRef} />
        </div>
    );
};

export default VisualInfographic;
