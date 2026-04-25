import type { RequestHandler } from './$types';
import { error, json } from '@sveltejs/kit';
import * as db from '$lib/server/database';
import { cancelMatch, findMatch } from '$lib/server/matchmaking';

export const POST: RequestHandler = async ({ cookies, request }) => {
    const userId = Number(cookies.get('userId'));
    if (!Number.isInteger(userId)) throw error(401, 'Not logged in');

    const user = await db.getUser(userId);
    if (!user) throw error(401, 'User not found');

    request.signal.addEventListener('abort', () => {
        cancelMatch(userId);
    });

    const convoId = await findMatch(user);
    if (convoId === null) {
        return json({ timeout: true });
    }
    return json({ convoId });
};
