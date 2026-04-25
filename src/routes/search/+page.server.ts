import type { PageServerLoad } from './$types';
import * as db from '$lib/server/database';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ cookies }) => {
    const userId = Number(cookies.get('userId'));
    if (!Number.isInteger(userId)) {
        throw redirect(303, '/');
    }
    const user = await db.getUser(userId);
    if (!user) {
        throw redirect(303, '/');
    }
    return { user };
};
