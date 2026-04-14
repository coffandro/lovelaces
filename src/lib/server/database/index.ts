import { type User } from "$lib/user";
import { JSONFilePreset } from "lowdb/node";
import { type Low } from "lowdb";

let db: Low<Data>;

export async function load() {
    console.log("loading DB...");

    db = await JSONFilePreset("db.json", { users: [] })

    console.log("DB loaded!");
}

export async function addUser(user: User) {
    if (user.id == -1) {
        user.id = db.data.users.length;
    }

    db.data.users[user.id] = user;
    await db.write();
}

export async function getUsers(): Promise<User[]|null> {
    // Figure out returning the actual stuff...
    return db.data.users;
}

export async function getUser(id: number): Promise<User|null> {
    // Figure out returning the actual stuff...
    if (id <= db.data.users.length) {
        let user: User = db.data.users[id];

        return user;
    }

    return null;
}