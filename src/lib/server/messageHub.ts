import type { Message } from "$lib/conversation";

type Subscriber = (msg: Message) => void;

const subscribers = new Map<number, Set<Subscriber>>();

export function subscribe(convoId: number, fn: Subscriber): () => void {
    let set = subscribers.get(convoId);
    if (!set) {
        set = new Set();
        subscribers.set(convoId, set);
    }
    set.add(fn);

    return () => {
        set!.delete(fn);
        if (set!.size === 0) subscribers.delete(convoId);
    };
}

export function publish(convoId: number, msg: Message) {
    const set = subscribers.get(convoId);
    if (!set) return;
    for (const fn of set) {
        try {
            fn(msg);
        } catch {
            // swallow — a dead subscriber shouldn't break others
        }
    }
}
