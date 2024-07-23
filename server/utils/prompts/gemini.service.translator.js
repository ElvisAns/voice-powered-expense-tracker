import execute from "../gemini.wrapper";
async function run(userinput) {
    const parts = [
        { text: `Your role is to translate the following text from French to English`}, {
            text : `${userinput}`
        }
    ];
    const response = await execute(parts)
    return response;
}

export default run;