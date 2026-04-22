import { type User } from "$lib/user";
import { JSONFilePreset } from "lowdb/node";
import { type Low } from "lowdb";
import type { Conversation } from "$lib/conversation";

let db: Low<Data>;

export async function load() {
    console.log("loading DB...");

    db = await JSONFilePreset("db.json", { users: [], convos: [] })

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

export async function getUsers(): Promise<User[]|null> {
    return db.data.users;
}

export async function getUser(id: number): Promise<User|null> {
    if (id <= db.data.users.length) {
        let user: User = db.data.users[id];

        return user;
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

export async function getConvos(): Promise<User[]|null> {
    return db.data.convos;
}

export async function getConvo(id: number): Promise<Conversation|null> {
    if (id <= db.data.convos.length) {
        let convo: Conversation = db.data.convos[id];

        return convo;
    }

    return null;
}