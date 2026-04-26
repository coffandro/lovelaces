import { type User, Gender, Sexuality, Pronoun } from '$lib/user';
import type { Actions, PageServerLoad } from './$types';
import * as db from '$lib/server/database';
import { fail, redirect } from '@sveltejs/kit';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { USER_IMG_DIR } from '$lib/config';

export const load: PageServerLoad = async ({ cookies }) => {
	const userId = Number(cookies.get('userId'));
	if (!Number.isInteger(userId)) {
		throw redirect(303, '/');
	}

	const user = db.getUser(userId);
	if (!user) {
		throw redirect(303, '/');
	}

	return { user };
};

export const actions = {
	save: async ({ cookies, request }) => {
		const userId = Number(cookies.get('userId'));
		const existing = db.getUser(userId);
		if (!existing) {
			return fail(401, {
				error: true,
				message: 'You must be logged in'
			});
		}

		const form = await request.formData();
		const icon = form.get('icon') as File | null;

		let iconExt = existing.iconExt;
		if (icon && icon.name && icon.name !== 'undefined' && icon.size > 0) {
			const parts = icon.name.split('.');
			iconExt = parts[parts.length - 1];
			fs.writeFileSync(
				path.join(USER_IMG_DIR, existing.id + '.' + iconExt),
				Buffer.from(await icon.arrayBuffer())
			);
		}

		let pronouns = form.getAll('pronouns').map((p) => Number(p) as Pronoun);
		if (pronouns.length === 0) {
			// Form had no pronouns selected — keep what's already on file rather
			// than wiping them on every save.
			pronouns = existing.pronouns;
		}

		const updated: User = {
			id: existing.id,
			name: form.get('name') as string,
			iconExt,
			bio: form.get('bio') as string,
			age: Number(form.get('age')),
			city: form.get('city') as string,
			gender: Number(form.get('gender')) as Gender,
			pronouns,
			sexuality: Number(form.get('sexuality')) as Sexuality,
			email: form.get('email') as string,
			phone: form.get('phone') as string,
			password: form.get('password') as string
		};

		await db.modifyUser(updated);

		throw redirect(303, '/');
	},

	delete: async ({ cookies }) => {
		const userId = Number(cookies.get('userId'));
		if (Number.isInteger(userId)) {
			await db.removeUser(userId);
		}
		cookies.delete('userId', { path: '/' });
		throw redirect(303, '/');
	}
} satisfies Actions;
