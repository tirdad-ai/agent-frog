import { logger } from '../infrastructure/logger';
import { UserRepository } from './user.repository';
import type { CreateUserInput, UpdateUserInput } from './user.types';

export class UserService {
  private repository: UserRepository;

  constructor() {
    this.repository = new UserRepository();
  }

  async getUserById(id: string) {
    try {
      const user = await this.repository.findById(id);
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      logger.error('Error fetching user', { id, error });
      throw error;
    }
  }

  async getUserByEmail(email: string) {
    try {
      return await this.repository.findByEmail(email);
    } catch (error) {
      logger.error('Error fetching user by email', { email, error });
      throw error;
    }
  }

  async createUser(data: CreateUserInput) {
    try {
      // Check if user already exists
      const existing = await this.repository.findByEmail(data.email);
      if (existing) {
        throw new Error('User with this email already exists');
      }

      const user = await this.repository.create(data);
      logger.info('User created', { userId: user.id });
      return user;
    } catch (error) {
      logger.error('Error creating user', { data, error });
      throw error;
    }
  }

  async updateUser(id: string, data: UpdateUserInput) {
    try {
      const user = await this.repository.update(id, data);
      logger.info('User updated', { userId: id });
      return user;
    } catch (error) {
      logger.error('Error updating user', { id, data, error });
      throw error;
    }
  }

  async deleteUser(id: string) {
    try {
      await this.repository.delete(id);
      logger.info('User deleted', { userId: id });
    } catch (error) {
      logger.error('Error deleting user', { id, error });
      throw error;
    }
  }

  async listUsers() {
    try {
      return await this.repository.list();
    } catch (error) {
      logger.error('Error listing users', { error });
      throw error;
    }
  }
}
