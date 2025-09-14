import z from 'zod';

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

export type CreateUserSchema = z.infer<typeof createUserSchemaValidation>;
