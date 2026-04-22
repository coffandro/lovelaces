import type { User } from '$lib/user';
import type { Actions } from './$types';
import * as db from "$lib/server/database"
import { fail } from '@sveltejs/kit';
import * as fs from "node:fs";
import * as path from 'node:path';
import { USER_IMG_DIR } from "$lib/config";

export const actions = {
	default: async ({ cookies, request }) => {
		const data = Object.fromEntries(await request.formData());
		
		if (
			!(data.icon as File).name ||
			(data.icon as File).name === 'undefined'
		) {
			return fail(400, {
				error: true,
				message: 'You must provide a file to upload'
			});
		}

    	const {
			icon,
			name,
			email,
			phone,
			password,
		} = data as {
			icon: File,
			name: string,
			email: string,
			phone: string,
			password: string,
		};

		const icon_string = icon.name.split(".");
		const file_type = icon_string[icon_string.length - 1];

		
		let user: User = { id: -1, name, iconExt: file_type, email, phone, password };
		const id = await db.addUser(user);

		fs.writeFileSync(path.join(USER_IMG_DIR, id + "." + file_type), Buffer.from(await icon.arrayBuffer()));

		return {
			success: true
		};
	},
} satisfies Actions;