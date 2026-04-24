import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import * as db from '$lib/server/database';
import type { User } from '$lib/user';

export const load: PageServerLoad = async ({ cookies }) => {
    const userId = cookies.get("userId");
    let user: User | null = null;

    if (Number.isInteger(Number(userId))) {
        user = await db.getUser(Number(userId));
    }

    const convos = await db.getConvos();

    return {
        user,
        convos
    };
};


export const actions = {
    default: async ({ cookies, request }) => {
        const data = Object.fromEntries(await request.formData());

        const {
            email,
            password,
        } = data as {
            email: string,
            password: string,
        };

        let user: User | null = await db.getUserFromEmail(email);

        if (!user || user.password != password) {
            return fail(400, {
                error: true,
                message: 'Invalid email or password'
            });
        }
        cookies.set("userId", user.id.toString(), { path: "/" });

        return {
            success: true
        };
    },
} satisfies Actions;
