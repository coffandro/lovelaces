import * as fs from "node:fs";
import * as path from 'node:path';
import { IMG_DIR } from "$lib/config";

export async function writeLogo(logo: any) {
    let logoPath = '';
    let logoUrl = '';
    if (
        logo &&
        typeof logo === 'object' &&
        typeof logo.arrayBuffer === 'function'
    ) {
        const arrayBuffer = await logo.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        logoUrl = logo.name;
        logoPath = path.join(IMG_DIR, logoUrl);
        fs.writeFileSync(logoPath, buffer);
    } else {
        console.log("error with logo ", logo);
    }
}