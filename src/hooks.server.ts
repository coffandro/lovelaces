import type { ServerInit } from '@sveltejs/kit';
import * as db from '$lib/server/database';
import { startTick } from '$lib/server/background';

export const init: ServerInit = async () => {
    await db.load();
    startTick();
};