import { GoogleGenerativeAI } from "@google/generative-ai";

const MODEL_NAME = "gemini-pro";
const API_KEY = process.env.GOOGLE_GEMINI_API_KEY;

async function run(userinput) {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const parts = [
        { text: `Your role is to translate the following text from French to English`}, {
            text : `${userinput}`
        }
    ];

    const result = await model.generateContent({
        contents: [{ role: "user", parts }],
    });

    const response = result.response;
    return response.text();
}

export default run;