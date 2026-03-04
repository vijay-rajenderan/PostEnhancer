import { GoogleGenerativeAI } from '@google/generative-ai';
import retry from 'async-retry';
import logger from '../utils/logger.js';

class GeminiService {
    constructor() {
        if (!process.env.GEMINI_API_KEY) {
            logger.error('GEMINI_API_KEY is missing from environment variables');
            throw new Error('GEMINI_API_KEY is mandatory');
        }

        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        this.model = this.genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig: {
                temperature: 0.7,
                topP: 0.95,
                topK: 64,
                maxOutputTokens: 2048,
            }
        });

        // Prompt Library: Different "Opinionated" Personas
        this.styles = {
            contrarian: `
                You are the "Contrarian Engineer". Your goal is to challenge common industry myths.
                - Tone: Provocative, bold, slightly cynical.
                - Format: Start with "Unpopular opinion: [Statement]".
                - Focus: Why the common way of thinking is wrong.
            `,
            thoughtful: `
                You are the "Thoughtful Tech Lead". Your goal is to share deep, nuanced insights.
                - Tone: Empathetic, experienced, mentoring.
                - Format: Start with a personal story or observation.
                - Focus: Lessons learned and the "human side" of engineering.
            `,
            minimalist: `
                You are the "Minimalist Architect". Your goal is absolute clarity.
                - Tone: Direct, punchy, zero fluff.
                - Format: Use bullet points and short sentences.
                - Focus: Maximum value in minimum words.
            `,
            marketer: `
                You are the "Hype Marketer". Your goal is to build massive excitement.
                - Tone: High energy, enthusiastic, use emojis strategically.
                - Format: Start with an explosive realization or huge claim.
                - Focus: Transformation, speed, and massive results.
            `,
            career: `
                You are the "Career Strategist". Your goal is to help people level up.
                - Tone: Professional, authoritative, actionable.
                - Format: Start with a hard truth about the job market.
                - Focus: Salary, promotion, and professional growth.
            `,
            storyteller: `
                You are the "Master Storyteller". Your goal is to create an emotional connection.
                - Tone: Vulnerable, narrative, engaging.
                - Format: Start with "I'll never forget the day...".
                - Focus: Failures, lessons, and the journey.
            `,
            hardtruths: `
                You are the "Truth Bomb" Engineer. Your goal is to call out the limitations and hard truths of a situation.
                - Tone: Brutally honest, direct, professional.
                - Format: Start with "I have a hard truth for you:".
                - Focus: Constraints, why people fail, and why more tech isn't always the answer.
            `,
            notebook: `
                You are the "Notebook Analyst". Your goal is to create a deep-dive knowledge digest.
                - Format: Use headers like ## 📝 Executive Brief, ## 💡 Key Insights, and ## ❓ FAQ.
                - Focus: Context, definitions, and logical connections.
                - Tone: Academic yet accessible.
            `,
            infographic: `
                You are the "Visual Architect". Your goal is to create a structural breakdown.
                - Logic: Transform the input into a Mermaid.js diagram and a summary.
                - Output Format: 
                  1. A short header.
                  2. A Mermaid code block starting with \`\`\`mermaid and ending with \`\`\`.
                  3. Use either 'graph TD' or 'mindmap'.
                  4. A concluding "Key Takeaway".
            `
        };

        this.baseInstruction = `
            Strict Editorial Rules:
            1. THE TITLE: Start the post with a short, punchy title using Unicode BOLD characters (or ALL CAPS if bold is unavailable). Start this title with one of your 3 allowable professional emojis.
            2. THE HOOK: The second line must be a scroll-stopper that hits a pain point.
            3. STRUCTURE: Use "1-2 sentence paragraphs" only. Use single line breaks for flow and double breaks only between major themes/sections.
            4. ICONS: Use emojis SPARINGLY. Limit to maximum 3 professional emojis per post inclusive of the title (🏗️, 🧠, 🛡️, ⚙️, 📈, 💡, 🏛️, 💎). Never use multiple emojis in a row.
            5. CLOSING: Always end with a specific, engaging "Call to Conversation" question.
            6. HASHTAGS: Add exactly 5 highly relevant hashtags at the bottom.
            7. LENGTH: Maintain total length close to TARGET_LENGTH (max 3000 chars).
            8. NO PLACEHOLDERS: Do not use brackets like [Name].
            9. RICH TEXT: Use Unicode BOLD (𝐚𝐛𝐜) for the title and key technical terms. Use Unicode ITALIC (𝘢𝘣𝘤) for emphasis on action verbs or strategic adjectives.
        `;
    }

    /**
     * Enhances a raw thought dump into a premium LinkedIn post.
     * @param {string} rawInput 
     * @param {string} correlationId 
     * @param {string} style
     * @param {number} targetLength
     * @param {string} personaText
     */
    async enhancePost(rawInput, correlationId, style = 'thoughtful', targetLength = 1500, personaText = '') {
        const styleRubric = this.styles[style] || this.styles.thoughtful;
        const isAnalytical = ['notebook', 'infographic'].includes(style);

        logger.info(`ENHANCE_REQUEST: Style = ${style}, IsAnalytical = ${isAnalytical} `, { correlationId });

        const systemInstruction = isAnalytical ? `
            STRICT MODE: ANALYTICAL KNOWLEDGE ANALYST.
            PROHIBITED: DO NOT USE LINKEDIN FORMATTING.DO NOT USE STORIES.DO NOT USE HOOKS.
                REQUIRED: OUTPUT ONLY THE DATA IN ${style.toUpperCase()} FORMAT.
            DATA FORMAT: ${style === 'infographic' ? 'USE MERMAID.JS \`\`\`mermaid BLOCKS.' : 'USE MARKDOWN HEADERS ##.'}
            CONTENT RULES: ${styleRubric}
        ` : `
            You are the "Professional AI Architect".
            ${personaText ? `GROUNDING CONTEXT (User Resume/Experience): ${personaText}` : styleRubric}
            ${personaText ? 'Role: Senior AI Architect providing high-level technical and strategic insights.' : ''}
            ${this.baseInstruction}
        TARGET_LENGTH: ${targetLength || 1500} characters.
            EMOJI POLICY: STRICTLY PROFESSIONAL.Use only: 🏗️, 🧠, 🛡️, ⚙️, 📈, 💡, 🏛️, 💎, 💼.
        `;

        const model = this.genAI.getGenerativeModel({
            model: "gemini-flash-latest",
            systemInstruction
        });

        return await retry(
            async (bail) => {
                try {
                    const finalPrompt = isAnalytical
                        ? `COMMAND: ANALYZE AND TRANSFORM TO ${style.toUpperCase()}. 
                           REQUIREMENT: Return your response in RAW JSON format with two keys:
                           "enhancedContent": (the string containing the ${style.toUpperCase()} content)
                           "engagementScore": (a number 1-10)
                           
                           CONTENT: \n${rawInput}`
                        : `THOUGHT DUMP: ${rawInput} 
                           TASK: Transform this into a premium LinkedIn post.
                           REQUIREMENT: Return the response in RAW JSON format with two keys: 
                           "enhancedContent": (the string post)
                           "engagementScore": (a number 1-10 evaluating the scroll-stopping potential).`;

                    logger.info(`Gemini Call Payload Style: ${style}`, { correlationId });

                    // Use the specific model instance with system instruction
                    const result = await model.generateContent({
                        contents: [{ role: 'user', parts: [{ text: finalPrompt }] }],
                        generationConfig: { responseMimeType: "application/json" }
                    });
                    const response = await result.response;
                    const text = response.text();

                    if (!text) {
                        throw new Error('Empty response from Gemini');
                    }

                    // Robustly extract JSON from the text
                    try {
                        let jsonContent = text;
                        const jsonMatch = text.match(/\{[\s\S]*\}/);
                        if (jsonMatch) {
                            jsonContent = jsonMatch[0];
                        }

                        const parsed = JSON.parse(jsonContent);

                        logger.info('Successfully generated enhanced post with score', { correlationId });
                        return parsed;
                    } catch (parseError) {
                        logger.warn('Failed to parse Gemini JSON, falling back to raw text cleanup', { correlationId });
                        // If parsing fails, try to strip common markdown artifacts to show clean text
                        const cleanedText = text.replace(/```json|```/gi, '').trim();
                        return { enhancedContent: cleanedText, engagementScore: 7 };
                    }
                } catch (error) {
                    // Bail on 400 errors (like prompt injection blocks or invalid keys)
                    if (error.message?.includes('400') || error.message?.includes('API_KEY_INVALID')) {
                        logger.error('Permanent Gemini Error - Bailing', { correlationId, error: error.message });
                        return bail(error);
                    }

                    logger.warn('Transient Gemini Error - Retrying...', { correlationId, error: error.message });
                    throw error; // Rethrow for retry
                }
            },
            {
                retries: 3,
                factor: 2,
                minTimeout: 1000,
                maxTimeout: 5000,
            }
        );
    }

    /**
     * Polishes an existing post with Unicode bold/italic for key points.
     */
    async smartPolish(content, correlationId) {
        const systemInstruction = `
            You are a "Metadata Polisher". 
            TASK: Take the provided LinkedIn post and enhance its visual hierarchy using Unicode Bold (𝐚𝐛𝐜) and Italic (𝘢𝘣𝘤).
            RULES:
            1. BOLD: Use for Titles, headers, and 2-3 key technical terms per post.
            2. ITALIC: Use for 2-3 strategic emphasis points or soft skills.
            3. CONTENT: DO NOT CHANGE THE ACTUAL WORDING. Only add the Unicode formatting.
            4. OUTPUT: Return RAW JSON with one key: "polishedContent".
        `;

        const model = this.genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig: { responseMimeType: "application/json" }
        });

        try {
            const prompt = `${systemInstruction}\n\nCONTENT TO POLISH: \n${content}`;
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            const parsed = JSON.parse(text);
            return parsed.polishedContent || content;
        } catch (error) {
            logger.error('Smart Polish failed', { correlationId, error: error.message });
            return content;
        }
    }
}

// Export as Singleton
export default new GeminiService();
