import { GoogleGenerativeAI } from "@google/generative-ai";

const MODEL_NAME = "gemini-1.5-pro";
const API_KEY = process.env.GOOGLE_GEMINI_API_KEY;

async function execute(parts) {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const result = await model.generateContent({
        contents: [{ role: "user", parts }],
    });
    const response = result.response.text();
    
    const index1 = response.indexOf("```json");
    if(index1){
        return response;
    }
    const index2 = response.lastIndexOf("```");
    const json = response.slice(index1 + 7, index2)
    return json;
}

export default execute;