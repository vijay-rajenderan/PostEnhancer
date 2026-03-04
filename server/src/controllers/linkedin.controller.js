import linkedinService from '../services/linkedin.service.js';
import logger from '../utils/logger.js';

/**
 * Handles the request to post content to LinkedIn
 */
export const postToLinkedIn = async (req, res) => {
    const { content } = req.body;
    const { correlationId } = req;

    if (!content) {
        return res.status(400).json({ error: 'Content is required' });
    }

    try {
        logger.info('Received request to post to LinkedIn', { correlationId });
        const result = await linkedinService.postContent(content, correlationId);

        res.status(201).json({
            message: 'Successfully posted to LinkedIn',
            data: result
        });
    } catch (error) {
        logger.error('Controller Error: LinkedIn Posting', {
            correlationId,
            error: error.message
        });

        // Specific error handling for missing config
        if (error.message.includes('configuration missing')) {
            return res.status(501).json({ error: 'LinkedIn integration not configured on server' });
        }

        res.status(500).json({ error: error.message });
    }
};
