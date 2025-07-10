import { z } from 'zod'

export const configSchema = z.object({
    PORT: z.coerce.number().default(3000),
    LOGGER_TYPE: z.coerce.string().default('nest'),
    LOGGER_FORMAT: z.coerce.string().default('plain'),
    LOGGER_OUTPUT: z.coerce.string().default('console'),
    GLOBAL_PREFIX: z.coerce.string().default('api'),
    DATABASE_URL: z.coerce.string()
});
