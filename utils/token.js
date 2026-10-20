import jwt from 'jsonwebtoken';
import { tokenSchema } from '../validation/token.validation.js';

const JWT_SECRET = process.env.JWT_SECRET;

export const generateToken = async (payload) => {
    
    const validationResult = await tokenSchema.safeParseAsync(payload);

    if (validationResult.error) {
        throw new Error(validationResult.error.message);
    }

    const payloadValidatedData = validationResult.data;

    const token = jwt.sign(payloadValidatedData, JWT_SECRET);

    return token;
};

// This function generates a JWT token using the provided payload and the secret key from the environment variables.
// It returns the generated token as a string.



export const verifyToken = async (token) => {
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded;
    } catch (error) {
        throw new Error('Invalid token');
    }
};


// This function verifies the provided JWT token using the secret key from the environment variables.

// It returns the decoded payload if the token is valid, otherwise it throws an error.