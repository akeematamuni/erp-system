import { configSchema } from './config/config.schema';

describe('Config Schema', () => {
    it('validates env variable', () => {
        const PORT = '4000';
        const GLOBAL_PREFIX = 'api/test';

        const parsed = configSchema.safeParse({ PORT, GLOBAL_PREFIX });

        expect(parsed.success).toBe(true);
        expect(parsed.success && parsed.data.PORT).toBe(4000);
    });
});
