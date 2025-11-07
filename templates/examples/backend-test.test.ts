/**
 * Example Backend Service Test
 * 
 * Framework: Vitest (or Jest)
 * Pattern: Arrange-Act-Assert (AAA)
 * Purpose: Test service layer business logic with TDD
 * 
 * This example shows:
 * - Service testing with mocked repositories
 * - Arrange-Act-Assert pattern
 * - Happy path + error cases
 * - Proper mocking with Vitest
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UserService } from '@/services/users/user.service';
import { UserRepository } from '@/services/users/user.repository';
import { ValidationError, NotFoundError } from '@/services/errors';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: UserRepository;

  beforeEach(() => {
    // Fresh instances for each test
    userRepository = new UserRepository();
    userService = new UserService(userRepository);
  });

  describe('createUser', () => {
    it('should create user with valid data', async () => {
      // Arrange
      const userData = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'SecurePass123!',
      };

      const expectedUser = {
        id: 'user-123',
        email: userData.email,
        name: userData.name,
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock repository to avoid database
      vi.spyOn(userRepository, 'findByEmail').mockResolvedValue(null);
      vi.spyOn(userRepository, 'create').mockResolvedValue(expectedUser);

      // Act
      const result = await userService.createUser(userData);

      // Assert
      expect(result).toBeDefined();
      expect(result.id).toBe('user-123');
      expect(result.email).toBe(userData.email);
      expect(result.name).toBe(userData.name);
      
      // Verify repository was called correctly
      expect(userRepository.findByEmail).toHaveBeenCalledWith(userData.email);
      expect(userRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: userData.email,
          name: userData.name,
        })
      );
      
      // Verify password was hashed (not stored in plain text)
      expect(userRepository.create).not.toHaveBeenCalledWith(
        expect.objectContaining({ password: userData.password })
      );
    });

    it('should throw ValidationError with invalid email', async () => {
      // Arrange
      const invalidData = {
        email: 'not-an-email',
        name: 'Test User',
        password: 'SecurePass123!',
      };

      // Act & Assert
      await expect(userService.createUser(invalidData)).rejects.toThrow(
        ValidationError
      );
      await expect(userService.createUser(invalidData)).rejects.toThrow(
        'Invalid email format'
      );
      
      // Repository should not be called with invalid data
      expect(userRepository.create).not.toHaveBeenCalled();
    });

    it('should throw ValidationError with short password', async () => {
      // Arrange
      const invalidData = {
        email: 'test@example.com',
        name: 'Test User',
        password: '123', // Too short
      };

      // Act & Assert
      await expect(userService.createUser(invalidData)).rejects.toThrow(
        ValidationError
      );
      await expect(userService.createUser(invalidData)).rejects.toThrow(
        'Password must be at least 8 characters'
      );
    });

    it('should throw error if email already exists', async () => {
      // Arrange
      const userData = {
        email: 'existing@example.com',
        name: 'Test User',
        password: 'SecurePass123!',
      };

      const existingUser = {
        id: 'user-456',
        email: userData.email,
        name: 'Existing User',
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock repository to return existing user
      vi.spyOn(userRepository, 'findByEmail').mockResolvedValue(existingUser);

      // Act & Assert
      await expect(userService.createUser(userData)).rejects.toThrow(
        'User with this email already exists'
      );
      
      // Create should not be called
      expect(userRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('getUserById', () => {
    it('should return user when found', async () => {
      // Arrange
      const userId = 'user-123';
      const expectedUser = {
        id: userId,
        email: 'test@example.com',
        name: 'Test User',
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.spyOn(userRepository, 'findById').mockResolvedValue(expectedUser);

      // Act
      const result = await userService.getUserById(userId);

      // Assert
      expect(result).toEqual(expectedUser);
      expect(userRepository.findById).toHaveBeenCalledWith(userId);
    });

    it('should throw NotFoundError when user not found', async () => {
      // Arrange
      const userId = 'non-existent';
      vi.spyOn(userRepository, 'findById').mockResolvedValue(null);

      // Act & Assert
      await expect(userService.getUserById(userId)).rejects.toThrow(
        NotFoundError
      );
      await expect(userService.getUserById(userId)).rejects.toThrow(
        'User not found'
      );
    });
  });

  describe('updateUser', () => {
    it('should update user with valid data', async () => {
      // Arrange
      const userId = 'user-123';
      const updateData = {
        name: 'Updated Name',
      };

      const existingUser = {
        id: userId,
        email: 'test@example.com',
        name: 'Old Name',
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedUser = {
        ...existingUser,
        name: updateData.name,
        updatedAt: new Date(),
      };

      vi.spyOn(userRepository, 'findById').mockResolvedValue(existingUser);
      vi.spyOn(userRepository, 'update').mockResolvedValue(updatedUser);

      // Act
      const result = await userService.updateUser(userId, updateData);

      // Assert
      expect(result.name).toBe(updateData.name);
      expect(userRepository.update).toHaveBeenCalledWith(userId, updateData);
    });

    it('should throw NotFoundError when updating non-existent user', async () => {
      // Arrange
      const userId = 'non-existent';
      const updateData = { name: 'Updated Name' };

      vi.spyOn(userRepository, 'findById').mockResolvedValue(null);

      // Act & Assert
      await expect(userService.updateUser(userId, updateData)).rejects.toThrow(
        NotFoundError
      );
      
      // Update should not be called
      expect(userRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('deleteUser', () => {
    it('should soft delete user', async () => {
      // Arrange
      const userId = 'user-123';
      const existingUser = {
        id: userId,
        email: 'test@example.com',
        name: 'Test User',
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      vi.spyOn(userRepository, 'findById').mockResolvedValue(existingUser);
      vi.spyOn(userRepository, 'softDelete').mockResolvedValue(undefined);

      // Act
      await userService.deleteUser(userId);

      // Assert
      expect(userRepository.softDelete).toHaveBeenCalledWith(userId);
    });

    it('should throw NotFoundError when deleting non-existent user', async () => {
      // Arrange
      const userId = 'non-existent';
      vi.spyOn(userRepository, 'findById').mockResolvedValue(null);

      // Act & Assert
      await expect(userService.deleteUser(userId)).rejects.toThrow(
        NotFoundError
      );
      
      // Delete should not be called
      expect(userRepository.softDelete).not.toHaveBeenCalled();
    });
  });
});
