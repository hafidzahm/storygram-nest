import z from 'zod';
import { createProfileSchema } from './create-profile.dto';

// Zod schema for update: all fields optional
export const updateProfileSchema = createProfileSchema.partial();

export type UpdateProfileDto = z.infer<typeof updateProfileSchema>;
