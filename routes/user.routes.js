import express from 'express';
import  db  from '../db/index.js';
import { getUserByEmail } from '../services/user.service.js';
import { usersTable } from '../models/index.js';
import { eq } from 'drizzle-orm';
import { createHmac, randomBytes } from 'node:crypto';
import { signupPostRequestBodySchema, loginPostRequestBodySchema } from '../validation/request.validation.js';
import { hashPassword } from '../utils/hash.js';
import jwt from 'jsonwebtoken';
import { generateToken } from '../utils/token.js';

const router = express.Router();

router.post('/signup', async (req, res) => {
    
    // const { firstName, lastName, email, password } = req.body;

    // If validation fails, return an error response

    const validationResult = await signupPostRequestBodySchema.safeParseAsync(req.body);

    if (validationResult.error) {
        return res.status(400).json({ error: validationResult.error });
    }


    const { firstName, lastName, email, password } = validationResult.data;

    // const [existingUser] = await db.select({ id: usersTable.id }).from(usersTable).where(eq(usersTable.email, email));

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
    }
    
    // Insert the new user into the database
    
    // const salt = randomBytes(256).toString('hex');

    // const hashedPassword = createHmac('sha256', salt).update(password).digest('hex');

    const { salt, password: hashedPassword } = hashPassword(password);

    const [user] = await db.insert(usersTable).values({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        salt
    }).returning({ id: usersTable.id });
    
    res.status(201).json({ data : { userId: user.id }  });

});


router.post('/login', async (req, res) => {
    
    const validationResult = await loginPostRequestBodySchema.safeParseAsync(req.body);

    if (validationResult.error) {
        return res.status(400).json({ error: validationResult.error });
    }

    const { email, password } = validationResult.data;

    const existingUser = await getUserByEmail(email);

    if (!existingUser) {
        return res.status(400).json({ error: 'Invalid email or password' });
    }

    const { password: hashedPassword } = hashPassword(password, existingUser.salt);


    if (hashedPassword !== existingUser.password) {
        return res.status(400).json({ error: 'Invalid  password' });
    }

    // const token = jwt.sign({ id: existingUser.id}, process.env.JWT_SECRET)

    const token = await generateToken({ id: existingUser.id });

    res.status(200).json({ data: { token } });
});

export default router;