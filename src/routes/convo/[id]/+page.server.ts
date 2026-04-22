import type { PageServerLoad } from './$types';
import * as db from '$lib/server/database';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, url }) => {
    const convoId = Number(params.id);
    if (!Number.isInteger(convoId)) {
        throw error(400, `Invalid conversation id: ${params.id}`);
    }

    const convo = await db.getConvo(convoId);
    if (!convo) {
        throw error(404, `Conversation ${params.id} not found`);
    }

    const first = await db.getUser(convo.firstId);
    const second = await db.getUser(convo.secondId);

    const asParam = url.searchParams.get('as');
    const asId = asParam === null ? null : Number(asParam);
    const asUser =
        asId !== null && Number.isInteger(asId) && (asId === convo.firstId || asId === convo.secondId)
            ? await db.getUser(asId)
            : null;

    return {
        convo,
        first,
        second,
        asUser,
    };
};
