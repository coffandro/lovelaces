import type { User } from '$lib/user';
import type { Actions } from './$types';
import * as db from "$lib/server/database"
import { writeLogo } from '$lib/files';
import * as fs from "node:fs";
import * as path from 'node:path';
import { IMG_DIR } from "$lib/config";

export const actions = {
	default: async ({ cookies, request }) => {
		const data = await request.formData();

		console.log(data);
		
		const name = data.get('name') as string;
		const email = data.get('email') as string;
		const phone = data.get('phone') as string;
		const password = data.get('password') as string;
		
		let logo = data.get("icon");
		let logoPath = '';
		let logoUrl = '';
		if (
			logo &&
			typeof logo === 'object' &&
			typeof logo.arrayBuffer === 'function'
		) {
			const arrayBuffer = await logo.arrayBuffer();
			const buffer = Buffer.from(arrayBuffer);
			logoUrl = logo.name;
			logoPath = path.join(IMG_DIR, logoUrl);
			fs.writeFileSync(logoPath, buffer);
		} else {
			console.log("error with logo ", logo);
		}

		let user: User = { id: -1, name, email, phone, password };
		db.addUser(user);
	},
} satisfies Actions;