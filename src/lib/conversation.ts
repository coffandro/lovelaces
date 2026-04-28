const TEN_MINUTES = 10 * 60_000 // Mmmm, magic numbers

export interface Message {
    message: string;
    userId: number;
}

export interface Conversation {
    id: number;
    // Our users
    firstId: number;
    secondId: number;

    messages: Message[]

    // Time stuffs
    startTime: number;
    ended?: boolean;
}

export function remainingTime(convo: Conversation): number {
    return convo.startTime + TEN_MINUTES - Date.now();
}

export function canContinue(convo: Conversation): boolean {
    return convo.startTime + TEN_MINUTES >= Date.now();
}