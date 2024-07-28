import execute from "../gemini.wrapper";

async function run(userinput) {
    const parts = [
        { text: `Your task to extract expense/income information in json format from user text. You have to extract the following data from the text and return the following key information in json format: {"currency","amount", "item", "account", "type"}.
        example1 :
        my input : "Hello, today i spent $50 on meal and drink from my cash", 
        your response : {"currency":"$", "amount": 50,"item":"meal and drink","account":"cash","type":"expense","category":"food"}
        
        example2 :
        my input : "Hello, today i received my $3500 salary onto my bank account", 
        your response : {"currency":"$","amount": 3500, "item":"salary","account":"Bank account","type":"income","category":"monthly earning"}

        if my input does not describe anything related to income/expense or has some missing information, dont return the json, just tell me that some information are missing
        example : 
        my input : "Hello, today i received my salary onto my bank account", 
        your response : {"error":"You did not specify any amount, please be specific"}
        Make the outputs in JSON format.
        `
        }, {
            text : `Here is my input ${userinput}`
        }
    ];
    
    const response = await execute(parts)
    return response;
}

export default run;