import { createProfileSchema } from './create-profile.dto';

// Zod schema for update: all fields optional
export const updateProfileSchema = createProfileSchema.partial();

export type UpdateProfileDto = typeof updateProfileSchema;
