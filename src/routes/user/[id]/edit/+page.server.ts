import { type User, Gender, Sexuality, Pronoun } from '$lib/user';
import type { Actions } from './$types';
import * as db from "$lib/server/database"
import { fail } from '@sveltejs/kit';
import * as fs from "node:fs";
import * as path from 'node:path';
import { USER_IMG_DIR } from "$lib/config";

export const load: PageServerLoad = async ({ params }) => {
	let error: string | null = null;

	const user: User = await db.getUser(params.id);

	if (!user) {
		error = `User with id ${params.id} not found`;
	}

	return {
		user: user,
		error: error
	};
};

export const actions = {
	default: async ({ cookies, request }) => {
		const form = await request.formData();

		const icon = form.get('icon') as File | null;
		if (!icon || !icon.name || icon.name === 'undefined') {
			return fail(400, {
				error: true,
				message: 'You must upload an image of yourself'
			});
		}

		const name = form.get('name') as string;
		const bio = form.get('bio') as string;
		const age = Number(form.get('age'));
		const city = form.get('city') as string;
		const gender = Number(form.get('gender')) as Gender;
		const sexuality = Number(form.get('sexuality')) as Sexuality;
		const pronouns = form.getAll('pronouns').map((p) => Number(p) as Pronoun);
		const email = form.get('email') as string;
		const phone = form.get('phone') as string;
		const password = form.get('password') as string;

		const icon_string = icon.name.split(".");
		const file_type = icon_string[icon_string.length - 1];

		let user: User = {
			id: -1,
			name,
			iconExt: file_type,
			bio,
			age,
			city,
			gender,
			pronouns,
			sexuality,
			email,
			phone,
			password,
		};
		const id = await db.addUser(user);

		fs.writeFileSync(path.join(USER_IMG_DIR, id + "." + file_type), Buffer.from(await icon.arrayBuffer()));

		return {
			success: true
		};
	},
} satisfies Actions;
