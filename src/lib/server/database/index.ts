import { type User } from "$lib/user";
import { JSONFilePreset } from "lowdb/node";
import { type Low } from "lowdb";
import type { Conversation, Message } from "$lib/conversation";

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

export async function getUsers(): Promise<User[]> {
    return db.data.users;
}

export async function getUser(id: number): Promise<User | null> {
    if (id >= 0 && id < db.data.users.length) {
        return db.data.users[id];
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

export async function getConvos(): Promise<Conversation[]> {
    return db.data.convos;
}

export async function getConvo(id: number): Promise<Conversation | null> {
    if (id >= 0 && id < db.data.convos.length) {
        return db.data.convos[id];
    }

    return null;
}

export async function appendMessage(convoId: number, msg: Message): Promise<Conversation | null> {
    const convo = await getConvo(convoId);
    if (!convo) return null;

    convo.messages.push(msg);
    db.data.convos[convoId] = convo;
    await db.write();

    return convo;
}
