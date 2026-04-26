import type { PageServerLoad } from './$types';
import * as db from '$lib/server/database';
import type { User } from '$lib/user';

export const load: PageServerLoad = async ({ params }) => {
    const user: User = await db.getUser(params.id);

    return {
        user: user,
    };
};