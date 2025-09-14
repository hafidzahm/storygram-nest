import { z } from 'zod';

// User schema
export const createUserSchemaValidation = z.object({
  username: z
    .string('Username required')
    .min(5, 'Minimum character for username is 5'),
  password: z
    .string('Password required')
    .min(5, 'Minimum character for password is 5'),
  email: z.string('Email is required').email('Email must be email format'),
  role: z.enum(['ADMIN', 'USER']),
});

// Profile schema with nested user
export const createProfileSchema = z.object({
  name: z.string('Name required'),
  gender: z.string('Gender required'),
  age: z.number('Age required').int(),
  UserId: z.number().int().optional(),
  user: createUserSchemaValidation,
});

// TypeScript type from schema
export type CreateProfileDto = z.infer<typeof createProfileSchema>;
