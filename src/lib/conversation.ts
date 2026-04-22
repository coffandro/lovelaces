const TEN_MINUTES = 10 * 60000 // Mmmm, magic numbers

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
}

export function canContinue(convo: Conversation): boolean {
    return convo.startTime + TEN_MINUTES < Date.now();
}