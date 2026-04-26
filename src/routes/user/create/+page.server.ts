import { type User, Gender, Sexuality, Pronoun } from '$lib/user';
import type { Actions } from './$types';
import * as db from "$lib/server/database"
import { fail, redirect } from '@sveltejs/kit';
import * as fs from "node:fs";
import * as path from 'node:path';
import { USER_IMG_DIR } from "$lib/config";
import { normalizeDanishPhone } from '$lib/phone';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_GENDERS: Gender[] = [Gender.MAN, Gender.WOMAN, Gender.NONBINARY];
const VALID_SEXUALITIES: Sexuality[] = [
	Sexuality.STRAIGHT,
	Sexuality.GAY,
	Sexuality.BISEXUAL,
	Sexuality.PANSEXUAL
];
const VALID_PRONOUNS: Pronoun[] = [Pronoun.SHE, Pronoun.HE, Pronoun.THEY];

function readRequiredString(form: FormData, key: string): string | null {
	const raw = form.get(key);
	if (typeof raw !== 'string') {
		return null;
	}

	const value = raw.trim();
	return value.length > 0 ? value : null;
}

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

		const name = readRequiredString(form, 'name');
		const bio = readRequiredString(form, 'bio');
		const city = readRequiredString(form, 'city');
		const email = readRequiredString(form, 'email');
		const phone = readRequiredString(form, 'phone');
		const password = readRequiredString(form, 'password');
		const age = Number(form.get('age'));
		const gender = Number(form.get('gender')) as Gender;
		const sexuality = Number(form.get('sexuality')) as Sexuality;
		const pronouns = form
			.getAll('pronouns')
			.map((p) => Number(p) as Pronoun)
			.filter((p) => VALID_PRONOUNS.includes(p));

		if (!name || !bio || !city || !email || !phone || !password) {
			return fail(400, {
				error: true,
				message: 'Please fill in all required fields'
			});
		}

		if (!EMAIL_PATTERN.test(email)) {
			return fail(400, {
				error: true,
				message: 'Please enter a valid email address'
			});
		}

		const normalizedPhone = normalizeDanishPhone(phone);
		if (!normalizedPhone) {
			return fail(400, {
				error: true,
				message: 'Please enter a valid phone number'
			});
		}

		if (!Number.isFinite(age) || age < 0) {
			return fail(400, {
				error: true,
				message: 'Please enter a valid age'
			});
		}

		if (!VALID_GENDERS.includes(gender)) {
			return fail(400, {
				error: true,
				message: 'Please pick a valid gender'
			});
		}

		if (!VALID_SEXUALITIES.includes(sexuality)) {
			return fail(400, {
				error: true,
				message: 'Please pick a valid sexuality'
			});
		}

		if (pronouns.length === 0) {
			return fail(400, {
				error: true,
				message: 'Please select at least one pronoun'
			});
		}

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
			phone: normalizedPhone,
			password,
		};
		const id = await db.addUser(user);

		fs.writeFileSync(path.join(USER_IMG_DIR, id + "." + file_type), Buffer.from(await icon.arrayBuffer()));
		cookies.set("userId", user.id.toString(), { path: "/" });

		throw redirect(303, "/");
	},
} satisfies Actions;
