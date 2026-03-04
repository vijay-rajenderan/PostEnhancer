import geminiService from '../services/gemini.service.js';
import logger from '../utils/logger.js';

/**
 * Controller for LinkedIn Post Enhancement
 * Adheres to SOLID: Handles HTTP logic separately from business logic.
 */
export const enhancePost = async (req, res) => {
    const { correlationId } = req;
    const { rawContent, style, targetLength, personaText } = req.body;

    if (!rawContent || rawContent.trim().length === 0) {
        logger.warn('Empty content received in enhance request', { correlationId });
        return res.status(400).json({
            error: 'Raw content is required',
            correlationId
        });
    }

    try {
        const result = await geminiService.enhancePost(rawContent, correlationId, style, targetLength, personaText);

        res.status(200).json({
            success: true,
            enhancedContent: result.enhancedContent,
            engagementScore: result.engagementScore,
            correlationId
        });
    } catch (error) {
        // Error is already logged in the service
        res.status(500).json({
            error: 'Internal Server Error',
            message: error.message,
            correlationId
        });
    }
};

/**
 * Controller for Smart Polishing
 */
export const smartPolish = async (req, res) => {
    const { correlationId } = req;
    const { content } = req.body;

    if (!content) {
        return res.status(400).json({ error: 'Content is required', correlationId });
    }

    try {
        const polishedContent = await geminiService.smartPolish(content, correlationId);
        res.status(200).json({ success: true, polishedContent, correlationId });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error', message: error.message, correlationId });
    }
};
