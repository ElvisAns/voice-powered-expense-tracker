import run from '~/server/utils/prompts/gemini.service.expense';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { prompt } = body;
    const gemini_response = await run(prompt);
    let response = "";
    try{
        response = JSON.parse(gemini_response);
    }
    catch (error){
        response = gemini_response;
    }
    return { response };
})