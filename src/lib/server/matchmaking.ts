import { GetInterestedGenders, type Gender, type User } from '$lib/user';
import { MATCH_TIMEOUT_MS } from '$lib/matchmaking';
import * as db from './database';

interface Waiter {
    user: User;
    interestedGenders: Gender[];
    resolve: (convoId: number | null) => void;
    timer: ReturnType<typeof setTimeout>;
}

const waiters = new Map<number, Waiter>();

function mutualMatch(
    a: { user: User; interestedGenders: Gender[] },
    b: { user: User; interestedGenders: Gender[] }
): boolean {
    return a.interestedGenders.includes(b.user.gender) && b.interestedGenders.includes(a.user.gender);
}

export async function findMatch(user: User): Promise<number | null> {
    cancelMatch(user.id);

    const interestedGenders: Gender[] = GetInterestedGenders(user);
    const candidate = { user, interestedGenders };

    for (const other of waiters.values()) {
        if (other.user.id === user.id) continue;
        if (mutualMatch(candidate, other)) {
            clearTimeout(other.timer);
            waiters.delete(other.user.id);

            const convo = await db.startConversation(user, other.user);
            other.resolve(convo.id);
            return convo.id;
        }
    }

    return new Promise<number | null>((resolve) => {
        const timer = setTimeout(() => {
            waiters.delete(user.id);
            resolve(null);
        }, MATCH_TIMEOUT_MS);

        waiters.set(user.id, { user, interestedGenders, resolve, timer });
    });
}

export function cancelMatch(userId: number): void {
    const w = waiters.get(userId);
    if (!w) return;
    clearTimeout(w.timer);
    waiters.delete(userId);
    w.resolve(null);
}
