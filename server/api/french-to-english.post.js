import run from '~/server/utils/gemini.service.translator';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { prompt } = body;
    const gemini_response = await run(prompt);
    return { response: gemini_response };
})