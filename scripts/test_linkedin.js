
import linkedinService from './server/src/services/linkedin.service.js';
import logger from './server/src/utils/logger.js';

// Mock logger to avoid cluttering output
logger.info = () => { };
logger.error = () => { };

async function runTests() {
    console.log('🚀 Starting Unit Tests for LinkedInService...\n');
    let passed = 0;
    let failed = 0;

    // Test 1: Configuration Check
    try {
        process.env.LINKEDIN_ACCESS_TOKEN = '';
        process.env.LINKEDIN_PERSON_URN = '';
        await linkedinService.postContent('test', 'id');
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

    // Test 2: API Request Formatting (Mocking fetch)
    try {
        process.env.LINKEDIN_ACCESS_TOKEN = 'fake_token';
        process.env.LINKEDIN_PERSON_URN = 'urn:li:person:123';

        // Mock global fetch
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
                    json: async () => ({ id: 'urn:li:share:123' }),
                    headers: { get: (name) => name === 'x-restli-id' ? 'urn:li:share:123' : null }
                };
            }
            throw new Error('Invalid fetch call');
        };

        const result = await linkedinService.postContent('Hello World', 'id');
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

    // Test 3: Error Handling for API Errors
    try {
        global.fetch = async () => ({
            ok: false,
            status: 401,
            json: async () => ({ message: 'Expired Token' })
        });

        await linkedinService.postContent('test', 'id');
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
