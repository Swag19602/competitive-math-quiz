import { GoogleGenerativeAI } from "@google/generative-ai";

// const GEMINI_API_URL =
//   "https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText";
const apiKey =
  process.env.GEMINI_API_KEY || "AIzaSyAUwgaznaRgaq7Ml7wlPlBx9VKuGjZpv4Q";

if (!apiKey) {
  throw new Error(
    "Google Gemini API key is missing. Please add it to your .env file."
  );
}

// Helper function to make requests to Gemini API
const makeGeminiRequest = async (prompt: string): Promise<string> => {
  try {
    const genAI = new GoogleGenerativeAI(apiKey );
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    
    return result.response.text(); // Return the generated content
  } catch (error) {
    console.error("Error making request to Gemini API:", error);
    throw error;
  }
};

// 1. Generate a random math question
export const generateMathQuestion = async (): Promise<string> => {
  const prompt = "Generate a random new math question for a quiz.";
  const question = await makeGeminiRequest(prompt);
  return question;
};

// 2. Check if the user's answer is correct
export const checkAnswer = async (
  userAnswer: string,
  userQuestion: string
): Promise<boolean> => {
//   const prompt = `Is "${userAnswer}" the correct answer for this math question? The quetsion is "${userQuestion}". Respond with "true" or "false".`;
  const prompt = `Is the answer to the following math question: "${userQuestion}", "${userAnswer}"? Respond with true or false, considering possible variations.`;
  const result = await makeGeminiRequest(prompt);
  console.log(result)
  return result.toLowerCase().includes("true");
};

// 3. Fetch the correct answer for a given question
export const fetchCorrectAnswer = async (question: string): Promise<string> => {
  const prompt = `What is the correct answer to this math question: "${question}"?`;
  const correctAnswer = await makeGeminiRequest(prompt);
  return correctAnswer;
};
