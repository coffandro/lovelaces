import type { Actions, PageServerLoad } from './$types';
import * as db from '$lib/server/database';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
    const users = await db.getUsers();
    return { users };
};

export const actions = {
    default: async ({ request }) => {
        const form = await request.formData();
        const firstId = Number(form.get('firstId'));
        const secondId = Number(form.get('secondId'));

        if (!Number.isInteger(firstId) || !Number.isInteger(secondId)) {
            return fail(400, { error: 'Pick two users' });
        }
        if (firstId === secondId) {
            return fail(400, { error: 'Pick two different users' });
        }

        const first = await db.getUser(firstId);
        const second = await db.getUser(secondId);
        if (!first || !second) {
            return fail(400, { error: 'One of the users was not found' });
        }

        const convo = await db.startConversation(first, second);
        throw redirect(303, `/convo/${convo.id}?as=${first.id}`);
    },
} satisfies Actions;
