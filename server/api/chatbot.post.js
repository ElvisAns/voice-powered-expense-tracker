import run from '~/server/utils/gemini.service';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { prompt } = body;
    const gemini_response = await run(prompt);
    return { response: JSON.parse(gemini_response) };
})