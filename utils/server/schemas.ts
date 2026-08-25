import { z } from 'zod';

export const studyKeySchema = z.string().min(2).max(50).regex(
    /^[a-zA-Z0-9_-]+$/,
    'Study key must contain only letters, numbers, hyphens, and underscores.'
);
