import { z } from 'zod'

export const configSchema = z.object({
    PORT: z.coerce.number().default(3000),
    GLOBAL_PREFIX: z.coerce.string().default('api'),
});
