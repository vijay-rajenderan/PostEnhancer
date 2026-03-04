import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

/**
 * Service to interact with the LinkedIn Enhancer API
 */
export const enhancePost = async (rawContent, style = 'thoughtful', targetLength = 1500, personaText = '') => {
    try {
        const response = await api.post('/api/enhance', { rawContent, style, targetLength, personaText });
        return response.data;
    } catch (error) {
        console.error('API Error:', error.response?.data || error.message);
        throw new Error(error.response?.data?.error || 'Failed to enhance post');
    }
};

export const postToLinkedIn = async (content) => {
    try {
        const response = await api.post('/api/linkedin/post', { content });
        return response.data;
    } catch (error) {
        console.error('LinkedIn API Error:', error.response?.data || error.message);
        throw new Error(error.response?.data?.error || 'Failed to post to LinkedIn');
    }
};

export const smartPolish = async (content) => {
    try {
        const response = await api.post('/api/polish', { content });
        return response.data;
    } catch (error) {
        console.error('Polish API Error:', error.response?.data || error.message);
        throw new Error(error.response?.data?.error || 'Failed to polish post');
    }
};

export default {
    enhancePost,
    postToLinkedIn,
    smartPolish
};
