import express from 'express';
import { shortenUrlPostRequestBodySchema } from '../validation/request.validation.js';
import { nanoid } from 'nanoid';
import { ensureAuthenticated } from '../middleware/auth.middleware.js';
import { getShortenResult } from '../services/user.service.js';
import db from '../db/index.js';
import { urlTable } from '../models/index.js';
import { eq, and } from 'drizzle-orm';

const router = express.Router();



router.post('/shorten', ensureAuthenticated, async (req, res) => {

    // const userID = req.user?.id;

    // console.log('User ID:', userID);

    // if (!userID) {
    //     return res.status(401).json({ error: 'You are not authorized. Please log in.' });
    // }

    const validationResult = await shortenUrlPostRequestBodySchema.safeParseAsync(req.body);

    if (validationResult.error) {
        return res.status(400).json({ error: 'Invalid request body', details: validationResult.error.errors });
    }

    const { url, code } = validationResult.data;

    const shortCode = code ?? nanoid(6);

    // Here we generate the short code if it wasn't provided in the request body

    const result = await getShortenResult(req.user.id, url, shortCode);

    return res.status(200).json({
        id: result.id,
        shortCode: result.shortCode,
        targetUrl: result.targetUrl,
    });
});


router.get('/codes', ensureAuthenticated, async (req, res) => {

   const codes = await db.select().from(urlTable).where(eq(urlTable.userId, req.user.id));

   return res.status(200).json(codes);
});

router.delete('/:id', ensureAuthenticated, async (req, res) => {

    const id = req.params.id;

    const result = await db.delete(urlTable).where(and(eq(urlTable.id, id), eq(urlTable.userId, req.user.id)))

    if (!result.length) {
        return res.status(404).json({ error: 'Short code not found' });
    }

    return res.status(200).json({ message: 'Short code deleted successfully' });
});


router.get('/:shortCode', async (req, res) => {

    const code = req.params.shortCode;

    const [result] = await db.select().from(urlTable).where(eq(urlTable.shortCode, code));

    if (!result) {
        return res.status(404).json({ error: 'Short code not found' });
    }

    return res.redirect(result.targetUrl);
});


export default router;