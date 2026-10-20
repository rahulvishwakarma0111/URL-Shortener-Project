import { createHmac, randomBytes } from 'node:crypto';

export const hashPassword = (password, userSalt = undefined ) => {
    const salt = userSalt ?? randomBytes(256).toString('hex');
    const hashedPassword = createHmac('sha256', salt).update(password).digest('hex');

    return { salt, password: hashedPassword };
};


// This function hashes a password using a salt. If a userSalt is provided, it uses that; otherwise, it generates a new random salt. It returns an object containing the salt and the hashed password.

// 