import run from '~/server/utils/prompts/gemini.service.insights'

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { prompt } = body;
    const gemini_response = await run(prompt);
    return gemini_response;
})