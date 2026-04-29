import { API_USER_IMG_DIR } from './config';

export enum Gender {
    MAN,
    WOMAN,
    NONBINARY,
}

export enum Sexuality {
    STRAIGHT,
    GAY,
    BISEXUAL,
    PANSEXUAL,
}

export enum Pronoun {
    SHE,
    HE,
    THEY
}

export interface User {
    id: number;

    name: string;
    iconExt: string;

    bio: string;
    age: number;
    city: string;
    gender: Gender;
    pronouns: Pronoun[];
    sexuality: Sexuality;

    email: string;
    phone: string;

    password: string; // Would be encrypted IRL...
}

export function PronounString(pronouns: Pronoun[]): string {
    let retArr: string[] = [];

    for (const pronoun of pronouns) {
        switch (pronoun) {
            case Pronoun.SHE:
                retArr.push("She/Her");
                break;

            case Pronoun.HE:
                retArr.push("He/Him");
                break;

            case Pronoun.THEY:
                retArr.push("They/Them");
                break;

            default:
                break;
        }
    }

    return retArr.join(", ");
}

export function SexualityString(sexuality: Sexuality): string {
    switch (sexuality) {
        case Sexuality.STRAIGHT:
            return "Straight";

        case Sexuality.GAY:
            return "Gay";

        case Sexuality.BISEXUAL:
            return "Bisexual";

        case Sexuality.PANSEXUAL:
            return "Pansexual";

        default:
            return "";
    }
}

export function GenderString(gender: Gender): string {
    switch (gender) {
        case Gender.MAN:
            return "Man";

        case Gender.WOMAN:
            return "Woman";

        case Gender.NONBINARY:
            return "Non-Binary";

        default:
            return "";
    }
}

export function GetInterestedGenders(user: User): Gender[] {
    let allGenders = [
        Gender.MAN,
        Gender.WOMAN,
        Gender.NONBINARY,
    ];

    switch (user.sexuality) {
        case Sexuality.STRAIGHT:
            // All genders but the users
            switch (user.gender) {
                case Gender.MAN:
                    return [Gender.WOMAN];

                case Gender.WOMAN:
                    return [Gender.MAN];

                case Gender.NONBINARY:
                    return [Gender.MAN, Gender.WOMAN];

                default:
                    return [];
            }

        case Sexuality.GAY:
            // We return the same gender, would cause enby-enby which... Might be desired?
            return [user.gender];

        case Sexuality.BISEXUAL:
            return [
                Gender.MAN,
                Gender.WOMAN,
            ];

        case Sexuality.PANSEXUAL:
            return allGenders;

        default:
            return [];
    }
}

export function GetUserIcon(user: User): string {
    return `/${API_USER_IMG_DIR}/${user.id}.${user.iconExt}`;
}