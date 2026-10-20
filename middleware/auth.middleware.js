import { verifyToken } from '../utils/token.js';

/**
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 */



export async function authenticateToken(req, res, next) {
    
    const authHeader = req.headers['authorization'];

    if (!authHeader) return next();

    // This means the current logged-in user does not have an authorization header.

    // The user is logged out

    if (!authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authorization header must start with Bearer' });
    }

    const token = authHeader.split(' ')[1];

    try {
        req.user = await verifyToken(token);
        next();
    } catch {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }

}


export function ensureAuthenticated(req, res, next) {
    
    if( !req.user || !req.user.id) {
        return res.status(401).json({ error: 'User not authenticated' });
    }
    next();
}