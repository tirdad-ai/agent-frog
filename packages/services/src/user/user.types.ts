import type { User } from '@repo/database';

export type CreateUserInput = {
  name: string;
  email: string;
  image?: string;
};

export type UpdateUserInput = Partial<CreateUserInput>;

export type UserWithoutPassword = Omit<User, 'password'>;
