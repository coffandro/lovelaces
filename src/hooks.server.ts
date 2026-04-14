import type { ServerInit } from '@sveltejs/kit';
import * as db from '$lib/server/database';

export const init: ServerInit = async () => {
    await db.load();
};