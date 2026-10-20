import db from '../db/index.js';
import { urlTable, usersTable } from '../models/index.js';
import { eq } from 'drizzle-orm';


export async function getUserByEmail(email) {

    const [existingUser] = await db
        .select({
            id: usersTable.id,
            firstName: usersTable.firstName,
            lastName: usersTable.lastName,
            email: usersTable.email,
            password: usersTable.password,
            salt: usersTable.salt
        })
        .from(usersTable)
        .where(eq(usersTable.email, email));

    return existingUser;
}


export async function getShortenResult(userId, url, shortCode) {

    const [result] = await db.insert(urlTable).values({
        userId: userId,
        targetUrl: url,
        shortCode,
    }).returning({
        id: urlTable.id,
        shortCode: urlTable.shortCode,
        targetUrl: urlTable.targetUrl,
    });

    return result;
}