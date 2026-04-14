import type { PageServerLoad } from './$types';
import * as db from '$lib/server/database';
import type { User } from '$lib/user';

export const load: PageServerLoad = async ({ params }) => {
    let error: string|null = null;

    const user: User = await db.getUser(params.id);

    if (!user) {
        error = `User with id ${params.id} not found`;
    }

	return {
		user: user,
        error: error
	};
};