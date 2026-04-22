import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';
import * as db from '$lib/server/database';
import { subscribe } from '$lib/server/messageHub';

export const GET: RequestHandler = async ({ params }) => {
    const convoId = Number(params.id);
    if (!Number.isInteger(convoId)) {
        throw error(400, 'Invalid conversation id');
    }

    const convo = await db.getConvo(convoId);
    if (!convo) throw error(404, 'Conversation not found');

    const encoder = new TextEncoder();
    let cleanup = () => {};

    const stream = new ReadableStream<Uint8Array>({
        start(controller) {
            const unsubscribe = subscribe(convoId, (msg) => {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify(msg)}\n\n`));
            });

            controller.enqueue(encoder.encode(`: connected\n\n`));

            const heartbeat = setInterval(() => {
                try {
                    controller.enqueue(encoder.encode(`: ping\n\n`));
                } catch {
                    cleanup();
                }
            }, 25_000);

            cleanup = () => {
                clearInterval(heartbeat);
                unsubscribe();
            };
        },
        cancel() {
            cleanup();
        },
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache, no-transform',
            Connection: 'keep-alive',
            'X-Accel-Buffering': 'no',
        },
    });
};
