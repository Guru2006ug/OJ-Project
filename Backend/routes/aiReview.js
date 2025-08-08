const express = require('express');
const router = express.Router();
const { generateAiReview } = require('../generateAiReview');
const authMiddleware = require('../middleware/authMiddleware');

// AI Review endpoint - Protected route
router.post('/ai-review', authMiddleware, async (req, res) => {
    const { code } = req.body;
    
    // Enhanced validation
    if (!code || typeof code !== 'string' || code.trim() === '') {
        return res.status(400).json({
            success: false,
            error: "Empty code! Please provide valid code to review."
        });
    }
    
    // Check code length (prevent extremely large submissions)
    if (code.length > 10000) {
        return res.status(400).json({
            success: false,
            error: "Code too long! Please limit to 10,000 characters."
        });
    }
    
    try {
        console.log(`AI Review requested by user: ${req.user.id}`);
        const aiReview = await generateAiReview(code);
        
        res.status(200).json({
            success: true,
            data: aiReview
        });
    } catch (error) {
        console.error('Error in ai-review:', error.message);
        
        res.status(500).json({
            success: false,
            error: error.message || error.toString() || 'Error in ai-review endpoint'
        });
    }
});

module.exports = router;