import type { User } from '$lib/user';
import type { Actions } from './$types';
import * as db from "$lib/server/database"

export const actions = {
	default: async ({ cookies, request }) => {
		const data = await request.formData();
		
		const name = data.get('name') as string;
		const email = data.get('email') as string;
		const phone = data.get('phone') as string;
		const password = data.get('password') as string;
		let user: User = { id: -1, name, email, phone, password };
		db.addUser(user);
	},
} satisfies Actions;