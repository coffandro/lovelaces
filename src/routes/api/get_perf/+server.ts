import { writeLogo } from '$lib/files';
import type { RequestHandler } from '@sveltejs/kit';
import process from 'process';

export const GET: RequestHandler = async ({ request }) => {
    let perf = process.memoryUsage();

    console.log(perf);

    // Respond with a success message
    return new Response(JSON.stringify({ message: `Perf: ${perf}` }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
    });
};