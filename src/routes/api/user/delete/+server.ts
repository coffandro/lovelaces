import { fail } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import * as db from '$lib/server/database';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { USER_IMG_DIR } from '$lib/config';

export const POST: RequestHandler = async ({ cookies }) => {
    const userId = Number(cookies.get('userId'));

    if (!Number.isInteger(userId)) {
        return new Response(
            JSON.stringify({
                error: true,
                message: 'You must be logged in'
            }),
            { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
    }

    const user = db.getUser(userId);
    if (!user) {
        return new Response(
            JSON.stringify({
                error: true,
                message: 'User not found'
            }),
            { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
    }

    // Delete user's profile image if it exists
    if (user.iconExt) {
        const imagePath = path.join(USER_IMG_DIR, `${userId}.${user.iconExt}`);
        try {
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        } catch (e) {
            console.error('Failed to delete user image:', e);
        }
    }

    // Delete the user from the database
    await db.removeUser(userId);

    // Clear the userId cookie
    cookies.delete('userId', { path: '/' });

    return new Response(
        JSON.stringify({
            error: false,
            message: 'Account deleted successfully'
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
};
