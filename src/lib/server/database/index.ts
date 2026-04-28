import { type User } from "$lib/user";
import { JSONFilePreset } from "lowdb/node";
import { type Low } from "lowdb";
import type { Conversation, Message } from "$lib/conversation";
import { publish } from "$lib/server/messageHub";

interface Data {
    users: User[];
    convos: Conversation[];
}

let db: Low<Data>;

export async function load() {
    console.log("loading DB...");

    db = await JSONFilePreset<Data>("db.json", { users: [], convos: [] });

    console.log("DB loaded!");
}

export async function addUser(user: User): Promise<number> {
    if (user.id == -1) {
        user.id = db.data.users.length;
    }

    db.data.users[user.id] = user;
    await db.write();

    return user.id;
}

export async function modifyUser(user: User) {
    // We assume that id has not been destroyed
    db.data.users[getUserIndex(user)] = user;
    await db.write();
}

export async function removeUser(id: number) {
    // Leave a hole rather than splicing so other users keep their IDs
    // (conversations reference users by id).
    delete db.data.users[id];
    await db.write();
}

export function getUsers(): User[] {
    return db.data.users;
}

export function getUserIndex(user: User): number {
    let ret: number = -1;

    for (let i: number = 0; i < db.data.users.length; i++) {
        if (db.data.users[i] && user.id == db.data.users[i].id) {
            ret = i;
        }
    }

    return ret;
}

export function getUser(id: number): User | null {
    if (id >= 0 && id < db.data.users.length) {
        return db.data.users[id] ?? null;
    }

    return null;
}

export function getUserFromEmail(email: string): User | null {
    for (const user of getUsers()) {
        if (user && user.email == email) {
            return user;
        }
    }

    return null;
}

export async function addConvo(convo: Conversation) {
    if (convo.id == -1) {
        convo.id = db.data.convos.length;
    }

    db.data.convos[convo.id] = convo;
    await db.write();
}

export async function startConversation(firstUser: User, secondUser: User): Promise<Conversation> {
    const convo: Conversation = {
        id: db.data.convos.length,
        firstId: firstUser.id,
        secondId: secondUser.id,

        messages: [],

        startTime: Date.now(),
    };

    await addConvo(convo);

    return convo;
}

export function endConversation(convo: Conversation) {
    removeConvo(convo.id);

    // Sentinel userId=-1 signals "conversation ended" to any connected clients.
    console.log(convo);
    publish(convo.id, { userId: -1, message: '__ended__' });
}

export function getConvos(): Conversation[] {
    return db.data.convos;
}

export function getConvo(id: number): Conversation | undefined {
    const convo = db.data.convos.find((convo) => {
        return convo.id == id;
    });

    return convo;
}

export async function removeConvo(id: number) {
    const convo = await getConvo(id);
    if (!convo) return;

    if (db.data.convos.includes(convo)) {
        db.data.convos.splice(id);
        await db.write();
    }
}

export async function appendMessage(convoId: number, msg: Message): Promise<Conversation | null> {
    const convo = await getConvo(convoId);
    if (!convo) return null;

    convo.messages.push(msg);
    db.data.convos[convoId] = convo;
    await db.write();

    return convo;
}
