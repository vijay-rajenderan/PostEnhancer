
// Minimal mock for logger
const logger = {
    info: () => { },
    error: () => { },
    warn: () => { }
};

// LinkedInService logic extracted from linkedin.service.js
class LinkedInService {
    constructor() {
        this.baseUrl = 'https://api.linkedin.com/rest';
        this.apiVersion = '202401';
    }

    async postContent(content, correlationId) {
        const token = process.env.LINKEDIN_ACCESS_TOKEN;
        const personUrn = process.env.LINKEDIN_PERSON_URN;

        if (!token || !personUrn) {
            logger.error('LinkedIn credentials missing', { correlationId });
            throw new Error('LinkedIn configuration missing (TOKEN or PERSON_URN)');
        }

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

            const data = await response.json();

            if (!response.ok) {
                const errorMessage = data.message || `HTTP error! status: ${response.status}`;
                throw new Error(`LinkedIn Integration Error: ${errorMessage}`);
            }

            return data;
        } catch (error) {
            throw error;
        }
    }
}

const service = new LinkedInService();

async function runTests() {
    console.log('🚀 Starting Unit Tests for LinkedIn Posting Logic...\n');
    let passed = 0;
    let failed = 0;

    // Test 1: Configuration Check
    try {
        process.env.LINKEDIN_ACCESS_TOKEN = '';
        process.env.LINKEDIN_PERSON_URN = '';
        await service.postContent('test', 'id');
        console.log('❌ Test 1 Failed: Should throw error if config is missing');
        failed++;
    } catch (err) {
        if (err.message.includes('configuration missing')) {
            console.log('✅ Test 1 Passed: Throws error on missing config');
            passed++;
        } else {
            console.log('❌ Test 1 Failed: Unexpected error - ' + err.message);
            failed++;
        }
    }

    // Test 2: API Request Formatting
    try {
        process.env.LINKEDIN_ACCESS_TOKEN = 'fake_token';
        process.env.LINKEDIN_PERSON_URN = 'urn:li:person:123';

        global.fetch = async (url, options) => {
            const body = JSON.parse(options.body);
            if (
                url.includes('/posts') &&
                options.method === 'POST' &&
                options.headers['Authorization'] === 'Bearer fake_token' &&
                body.author === 'urn:li:person:123' &&
                body.commentary === 'Hello World'
            ) {
                return {
                    ok: true,
                    status: 201,
                    json: async () => ({ id: 'urn:li:share:123' })
                };
            }
            throw new Error('Invalid fetch call');
        };

        const result = await service.postContent('Hello World', 'id');
        if (result.id === 'urn:li:share:123') {
            console.log('✅ Test 2 Passed: Correctly formats API request');
            passed++;
        } else {
            console.log('❌ Test 2 Failed: Unexpected result - ' + JSON.stringify(result));
            failed++;
        }
    } catch (err) {
        console.log('❌ Test 2 Failed: ' + err.message);
        failed++;
    }

    // Test 3: Error Handling
    try {
        global.fetch = async () => ({
            ok: false,
            status: 401,
            json: async () => ({ message: 'Expired Token' })
        });

        await service.postContent('test', 'id');
        console.log('❌ Test 3 Failed: Should throw error on bad response');
        failed++;
    } catch (err) {
        if (err.message.includes('Expired Token')) {
            console.log('✅ Test 3 Passed: Correctly propagates API errors');
            passed++;
        } else {
            console.log('❌ Test 3 Failed: Unexpected error - ' + err.message);
            failed++;
        }
    }

    console.log(`\n📊 Summary: ${passed} passed, ${failed} failed`);
    process.exit(failed > 0 ? 1 : 0);
}

runTests();
