import { type User, Gender, Sexuality, Pronoun } from '$lib/user';
import type { Actions, PageServerLoad } from './$types';
import * as db from '$lib/server/database';
import { fail, redirect } from '@sveltejs/kit';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { USER_IMG_DIR } from '$lib/config';
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

		const updated: User = {
			id: existing.id,
			name,
			iconExt,
			bio,
			age,
			city,
			gender,
			pronouns,
			sexuality,
			email,
			phone: normalizedPhone,
			password
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
