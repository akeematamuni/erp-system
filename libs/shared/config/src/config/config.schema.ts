import { z } from 'zod'

export const configSchema = z.object({
    PORT: z.coerce.number().default(3000),
    LOGGER_TYPE: z.coerce.string().default('nest'),
    GLOBAL_PREFIX: z.coerce.string().default('api'),
    DATABASE_URL: z.coerce.string(),
});
