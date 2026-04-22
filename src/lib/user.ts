import { API_USER_IMG_DIR } from './config';

export interface User {
    id: number;
    
    name: string;
    //bio: string;
    //iconPath: string;
    iconExt: string;
    
    email: string;
    // Ka-chow was here >:DD
    phone: string;

    password: string; // Would be encrypted IRL...
}

export function GetUserIcon(user: User): string {
    return `${API_USER_IMG_DIR}/${user.id}.${user.iconExt}`;
}