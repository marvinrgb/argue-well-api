const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize with API Key from .env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// The real "secret sauce" is in the prompt design
const getAnalysisPrompt = (argumentText) => `
    Act as a world-class debate and logic coach. Analyze the following argument.
    Your response MUST be in a valid JSON format. Do not include any text outside of the JSON object.
    The JSON object must have these exact keys: "fallacies", "clarityScore", "evidenceFeedback", "concisenessFeedback".
    - "fallacies": An array of objects. Each object should have a "name" and "explanation" key for any logical fallacies found. If none, return an empty array.
    - "clarityScore": An integer between 0 and 100 representing how clear and easy to understand the argument is.
    - "evidenceFeedback": A short string providing feedback on the strength and specificity of the evidence.
    - "concisenessFeedback": A short string with suggestions for making the argument more concise.

    Here is the argument to analyze:
    ---
    ${argumentText}
    ---
`;

async function analyzeArgument(argument) {
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});
    const prompt = getAnalysisPrompt(argument);
    const result = await model.generateContent(prompt);
    const responseText = await result.response.text();
    return JSON.parse(responseText); // Return the structured JSON
}

async function generateCounterArguments(argument) {
    // ... similar logic with a different prompt ...
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `
        Act as a devil's advocate. Generate three distinct and strong counter-arguments to the following claim.
        Your response MUST be a valid JSON object with a single key "counterArguments" which is an array of strings.
        Do not include any text outside of the JSON object.

        Claim to challenge:
        ---
        ${argument}
        ---
    `;
    const result = await model.generateContent(prompt);
    const responseText = await result.response.text();
    return JSON.parse(responseText);
}

module.exports = { analyzeArgument, generateCounterArguments };
