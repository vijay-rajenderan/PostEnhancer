
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config({ path: '../.env' });

/**
 * FULL INTEGRATION TEST
 * 1. Enhances a sample thought using Gemini
 * 2. Posts the result to LinkedIn using the real credentials
 */
async function runFullTest() {
    console.log('🚀 Starting Full Integration Test...\n');

    const rawThought = "I just automated my LinkedIn posting using an AI agent. It's built with Node.js and Gemini 1.5 Flash. This is a live test!";
    const correlationId = 'test-' + Date.now();

    try {
        // --- STEP 1: GEMINI ENHANCEMENT ---
        console.log('🟢 Step 1: Enhancing thought with Gemini...');
        if (!process.env.GEMINI_API_KEY) throw new Error('GEMINI_API_KEY missing');

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const systemInstruction = `You are a LinkedIn strategist. Enhance the input into a punchy, professional post with whitespace and 3 hashtags. Output ONLY the post content.`;
        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: rawThought }] }],
            systemInstruction: { parts: [{ text: systemInstruction }] }
        });

        const enhancedContent = result.response.text().trim();
        console.log('✨ Enhanced Content:\n' + enhancedContent + '\n');

        // --- STEP 2: LINKEDIN POSTING ---
        console.log('🟢 Step 2: Posting to LinkedIn...');
        const token = process.env.LINKEDIN_ACCESS_TOKEN;
        let personUrn = process.env.LINKEDIN_PERSON_URN;

        if (!token || !personUrn) throw new Error('LinkedIn Credentials missing in .env');
        if (!personUrn.startsWith('urn:li:')) personUrn = `urn:li:person:${personUrn}`;

        const liResponse = await fetch('https://api.linkedin.com/rest/posts', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'LinkedIn-Version': '202601',
                'X-Restli-Protocol-Version': '2.0.0',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                author: personUrn,
                commentary: enhancedContent,
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

        const text = await liResponse.text();
        let liData = {};
        try {
            if (text) liData = JSON.parse(text);
        } catch (e) {
            console.log('⚠️ Could not parse response as JSON, but continuing...');
        }

        if (!liResponse.ok) {
            console.error('❌ LinkedIn API Error:', text || liResponse.statusText);
            throw new Error(`LinkedIn failed with status ${liResponse.status}: ${liData.message || 'Unknown error'}`);
        }

        console.log('\n✅ SUCCESS! Post shared to LinkedIn.');
        console.log('Post ID:', liResponse.headers.get('x-restli-id') || 'Check your feed!');

    } catch (error) {
        console.error('\n❌ FULL TEST FAILED');
        console.error('Reason:', error.message);
        process.exit(1);
    }
}

runFullTest();
