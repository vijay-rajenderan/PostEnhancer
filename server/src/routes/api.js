import express from 'express';
import * as enhanceController from '../controllers/enhance.controller.js';
import * as linkedinController from '../controllers/linkedin.controller.js';

const router = express.Router();

/**
 * @route POST /api/enhance
 * @desc Transforms raw thoughts into a LinkedIn post
 */
router.post('/enhance', enhanceController.enhancePost);

/**
 * @route POST /api/polish
 * @desc Polishes content using AI-assisted formatting
 */
router.post('/polish', enhanceController.smartPolish);

/**
 * @route POST /api/linkedin/post
 * @desc Posts content directly to LinkedIn
 */
router.post('/linkedin/post', linkedinController.postToLinkedIn);

export default router;
