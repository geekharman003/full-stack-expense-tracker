const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function createCategory(description) {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-001",
    contents: `${description} - give me only one category for this.
    i am making an expense tracker.don't include asterisk symbols in response.`,
  });

  return response.text;
}

module.exports = { createCategory };
