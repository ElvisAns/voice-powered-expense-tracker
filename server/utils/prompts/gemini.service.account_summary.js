import execute from "../gemini.wrapper";

async function run(userinput) {
    const parts = [
        { text: `I will give you a json that represent all my spendings/earning and i want you to tell me back the total spent amount and income per every account and every currency.
        example :
        my spendings/earning : "[{ "type": "expense", "account": "ecobank account", "amount": 30000, "currency": "$" }, { "currency": "£", "account": "wallet", "amount": 200, "type": "expense" } ]", 
        your response : {"ecobank account":{"$":{"expense":30000,"income":0}},"wallet":{"£":{"expense":200,"income":0}}}
        Your answer should always be a plain json object
        `
        }, {
            text : `Here is my spendings/earning ${userinput}`
        }
    ];
    
    const response = await execute(parts)
    return response;
}

export default run;