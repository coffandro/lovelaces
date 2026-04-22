import type { PageServerLoad } from './$types';
import * as db from '$lib/server/database';

export const load: PageServerLoad = async () => {
    const users = await db.getUsers();
    const convos = await db.getConvos();

    return {
        users,
        convos,
    };
};
