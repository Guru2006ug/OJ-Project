const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');
dotenv.config();

const ai = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

const generateAiReview = async (code) => {
    try {
        // Get the generative model
        const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        // Create a detailed prompt for code review
        const prompt = `
        Please review the following code and provide:
        1. Overall code quality assessment
        2. Potential bugs or issues
        3. Performance improvements
        4. Best practices suggestions
        5. Code readability improvements
        
        Code to review:
        \`\`\`
        ${code}
        \`\`\`
        
        Please provide a structured response with clear recommendations.
        `;
        
        // Generate content
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const reviewText = response.text();
        
        return {
            success: true,
            review: reviewText,
            timestamp: new Date().toISOString(),
            codeLength: code.length
        };
        
    } catch (error) {
        console.error('Error in generateAiReview:', error);
        throw new Error(`AI Review failed: ${error.message}`);
    }
};

module.exports = {
    generateAiReview,
};