import { GoogleGenerativeAI } from "@google/generative-ai";

const MODEL_NAME = "gemini-pro";
const API_KEY = process.env.GOOGLE_GEMINI_API_KEY;

async function run(userinput) {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const parts = [
        { text: `Your task to extract expense/income information in json format from user text. You have to extract the following data from the text and return the following key information in json format: {"currency","amount", "item", "account", "type"}.
        example1 :
        my input : "Hello, today i spent $50 on meal and drink from my cash", 
        your response : {"currency":"$", "amount": 50,"item":"meal and drink","account":"cash","type":"expense"}
        
        example2 :
        my input : "Hello, today i received my $3500 salary onto my bank account", 
        your response : {"currency":"$","amount": 3500, "item":"salary","account":"Bank account","type":"income"}

        if my input does not describe anything related to income/expense or has some missing information, dont return the json, just tell me that some information are missing
        example : 
        my input : "Hello, today i received my salary onto my bank account", 
        your response : {"error":"You did not specify any amount, please be specific"}`
        }, {
            text : `Here is my input ${userinput}`
        }
    ];

    const result = await model.generateContent({
        contents: [{ role: "user", parts }],
    });

    const response = result.response;
    return response.text();
}

export default run;