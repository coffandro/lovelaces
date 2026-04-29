import { canContinue, type Conversation } from "$lib/conversation";
import * as db from '$lib/server/database';

const INTERVAL: number = 100;

export function startTick() {
    setInterval(timeTick, INTERVAL);
}

function timeTick() {
    let currentConvos: Conversation[] = db.getConvos();

    for (let i: number = 1; i < currentConvos.length; i++) {
        let convo: Conversation = currentConvos[i];

        if (!canContinue(convo)) {
            console.log(convo);
            db.endConversation(convo);
        }
    }
}

