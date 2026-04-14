import type { PageServerLoad } from './$types';
import * as db from '$lib/server/database';
import type { User } from '$lib/user';

export const load: PageServerLoad = async ({ params }) => {
    let error: string|null = null;

    const users: User[] = await db.getUsers();

    if (!users) {
        error = `Users not found`;
    }

    return {
        users: users,
        error: error
    };
};