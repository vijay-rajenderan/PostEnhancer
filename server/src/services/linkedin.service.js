import logger from '../utils/logger.js';

class LinkedInService {
    constructor() {
        this.baseUrl = 'https://api.linkedin.com/rest';
        this.apiVersion = '202601';
    }

    /**
     * Posts content to LinkedIn using native fetch (Node 18+)
     * @param {string} content - The text content to post
     * @param {string} correlationId 
     */
    async postContent(content, correlationId) {
        const token = process.env.LINKEDIN_ACCESS_TOKEN;
        let personUrn = process.env.LINKEDIN_PERSON_URN;

        if (personUrn && !personUrn.startsWith('urn:li:')) {
            personUrn = `urn:li:person:${personUrn}`;
        }

        if (!token || !personUrn) {
            logger.error('LinkedIn credentials missing', { correlationId });
            throw new Error('LinkedIn configuration missing (TOKEN or PERSON_URN)');
        }

        logger.info('Attempting to post to LinkedIn', { correlationId });

        try {
            const response = await fetch(`${this.baseUrl}/posts`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'LinkedIn-Version': this.apiVersion,
                    'X-Restli-Protocol-Version': '2.0.0',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    author: personUrn,
                    commentary: content,
                    visibility: 'PUBLIC',
                    distribution: {
                        feedDistribution: 'MAIN_FEED',
                        targetEntities: [],
                        thirdPartyDistributionChannels: []
                    },
                    lifecycleState: 'PUBLISHED',
                    isReshareDisabledByAuthor: false
                })
            });

            const text = await response.text();
            let data = {};
            try {
                if (text) data = JSON.parse(text);
            } catch (e) {
                // Ignore parse errors if status is OK
            }

            if (!response.ok) {
                const errorMessage = data.message || `HTTP error! status: ${response.status} - ${text}`;
                logger.error('LinkedIn Post Failed', {
                    correlationId,
                    error: errorMessage,
                    details: data
                });
                throw new Error(`LinkedIn Integration Error: ${errorMessage}`);
            }

            logger.info('Successfully posted to LinkedIn', {
                correlationId,
                postId: response.headers.get('x-restli-id') || 'unknown'
            });

            return data;
        } catch (error) {
            logger.error('LinkedIn Integration Error', {
                correlationId,
                error: error.message
            });
            throw error;
        }
    }
}

export default new LinkedInService();
