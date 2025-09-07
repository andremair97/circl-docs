import { z } from 'zod';

// Example user schema to share across apps.
export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export type User = z.infer<typeof UserSchema>;
