import execute from "../gemini.wrapper";

async function run(userinput) {
    const parts = [
        { text: `I will give you a informations about my spendings/earning in the last 7 days the you will have to extract some insights for me.
            The insight can be anything related to analytics (how i am spending, how to optimize my spending, what did i spent the most on,etc...).
            `
        }, {
            text : `Here is the information in json format for you to easy understand : ${userinput}`
        }
    ];
    const response = await execute(parts)
    return response;
}

export default run;