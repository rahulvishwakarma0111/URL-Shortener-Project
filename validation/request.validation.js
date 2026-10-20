import { z } from 'zod';

export const signupPostRequestBodySchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long')
});

export const loginPostRequestBodySchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long')
});


export const shortenUrlPostRequestBodySchema = z.object({
    url: z.string().url('Invalid URL'),
    code: z.string().optional()
});