import { z } from 'zod';

export const tokenSchema = z.object({
    id: z.string()
});