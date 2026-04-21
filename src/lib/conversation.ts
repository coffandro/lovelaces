const TEN_MINUTES = 10 * 60000 // Mmmm, magic numbers

export interface Conversation {
    id: number;
    // Our users
    firstId: number;
    secondId: number;

    // Time stuffs
    startTime: number;
}

export async function startConversation(users: number) {
    
}

export function canContinue(convo: Conversation): boolean {
    return convo.startTime + TEN_MINUTES < Date.now();
}