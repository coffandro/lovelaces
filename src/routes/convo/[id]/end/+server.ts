import type { RequestHandler } from './$types';
import { json, error } from '@sveltejs/kit';
import * as db from '$lib/server/database';

export const POST: RequestHandler = async ({ params, request }) => {
    const convoId = Number(params.id);
    if (!Number.isInteger(convoId)) {
        throw error(400, 'Invalid conversation id');
    }

    const body = (await request.json()) as { userId?: number; message?: string };
    const userId = Number(body.userId);

    if (!Number.isInteger(userId)) throw error(400, 'Invalid userId');

    const convo = await db.getConvo(convoId);
    if (!convo) throw error(404, 'Conversation not found');

    if (userId !== convo.firstId && userId !== convo.secondId) {
        throw error(403, 'User is not a participant in this conversation');
    }

    await db.endConversation(convo);

    return json({ ok: true });
};
