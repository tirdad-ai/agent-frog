import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { UserService } from '@repo/services';
import { prisma } from '@repo/database';
import { cleanupDatabase } from '../helpers/db';

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
      };

      const user = await userService.createUser(userData);

      expect(user).toBeDefined();
      expect(user.name).toBe(userData.name);
      expect(user.email).toBe(userData.email);
      expect(user.id).toBeDefined();
    });

    it('should throw error if user with email already exists', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
      };

      await userService.createUser(userData);

      await expect(userService.createUser(userData)).rejects.toThrow(
        'User with this email already exists'
      );
    });
  });

  describe('getUserById', () => {
    it('should retrieve user by id', async () => {
      const userData = {
        name: 'Jane Doe',
        email: 'jane@example.com',
      };

      const createdUser = await userService.createUser(userData);
      const retrievedUser = await userService.getUserById(createdUser.id);

      expect(retrievedUser).toBeDefined();
      expect(retrievedUser?.id).toBe(createdUser.id);
      expect(retrievedUser?.email).toBe(userData.email);
    });

    it('should throw error if user not found', async () => {
      await expect(userService.getUserById('nonexistent-id')).rejects.toThrow(
        'User not found'
      );
    });
  });

  describe('updateUser', () => {
    it('should update user data', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
      };

      const user = await userService.createUser(userData);
      const updatedUser = await userService.updateUser(user.id, {
        name: 'John Updated',
      });

      expect(updatedUser.name).toBe('John Updated');
      expect(updatedUser.email).toBe(userData.email);
    });
  });

  describe('deleteUser', () => {
    it('should delete user', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
      };

      const user = await userService.createUser(userData);
      await userService.deleteUser(user.id);

      const deletedUser = await prisma.user.findUnique({
        where: { id: user.id },
      });

      expect(deletedUser).toBeNull();
    });
  });

  describe('listUsers', () => {
    it('should list all users', async () => {
      await userService.createUser({
        name: 'User 1',
        email: 'user1@example.com',
      });
      await userService.createUser({
        name: 'User 2',
        email: 'user2@example.com',
      });

      const users = await userService.listUsers();

      expect(users).toHaveLength(2);
      expect(users[0]?.name).toBeDefined();
    });
  });
});
