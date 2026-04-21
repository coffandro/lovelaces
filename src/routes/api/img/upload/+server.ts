import { writeLogo } from '$lib/files';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
    const data = await request.json(); // Parse JSON data from the request

    // Here you can process the data, e.g., save it to a database
    console.log(data);

    writeLogo(data.logo);

    // Respond with a success message
    return new Response(JSON.stringify({ message: 'Post created successfully!' }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
    });
};