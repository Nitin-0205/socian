// Unit tests for: findUsersWithSameInterests

import { jest } from '@jest/globals';
import { UsersController } from '../users.controller';

// Mock class for UsersService
class MockUsersService {
  findUsersWithSameParentCategory = jest.fn();
}

describe('UsersController.findUsersWithSameInterests() findUsersWithSameInterests method', () => {
  let usersController: UsersController;
  let mockUsersService: MockUsersService;

  beforeEach(() => {
    mockUsersService = new MockUsersService() as any;
    usersController = new UsersController(mockUsersService as any);
  });

  describe('Happy paths', () => {
    it('should return users with the same interests', async () => {
      // Arrange
      const mockInterests = 'sports,music';
      const mockUserName = 'john_doe';
      const expectedUsers = [{ id: 1, name: 'Jane Doe' }];
      jest
        .mocked(mockUsersService.findUsersWithSameParentCategory)
        .mockResolvedValue(expectedUsers as any as never);

      // Act
      const result = await usersController.findUsersWithSameInterests(
        mockInterests,
        mockUserName,
      );

      // Assert
      expect(
        mockUsersService.findUsersWithSameParentCategory,
      ).toHaveBeenCalledWith(mockInterests, mockUserName);
      expect(result).toEqual(expectedUsers);
    });
  });

  describe('Edge cases', () => {
    it('should handle empty interests string', async () => {
      // Arrange
      const mockInterests = '';
      const mockUserName = 'john_doe';
      jest
        .mocked(mockUsersService.findUsersWithSameParentCategory)
        .mockResolvedValue([] as any as never);

      // Act
      const result = await usersController.findUsersWithSameInterests(
        mockInterests,
        mockUserName,
      );

      // Assert
      expect(
        mockUsersService.findUsersWithSameParentCategory,
      ).toHaveBeenCalledWith(mockInterests, mockUserName);
      expect(result).toEqual([]);
    });

    it('should handle non-existent user', async () => {
      // Arrange
      const mockInterests = 'sports';
      const mockUserName = 'non_existent_user';
      jest
        .mocked(mockUsersService.findUsersWithSameParentCategory)
        .mockResolvedValue([] as any as never);

      // Act
      const result = await usersController.findUsersWithSameInterests(
        mockInterests,
        mockUserName,
      );

      // Assert
      expect(
        mockUsersService.findUsersWithSameParentCategory,
      ).toHaveBeenCalledWith(mockInterests, mockUserName);
      expect(result).toEqual([]);
    });

    it('should handle service throwing an error', async () => {
      // Arrange
      const mockInterests = 'sports';
      const mockUserName = 'john_doe';
      jest
        .mocked(mockUsersService.findUsersWithSameParentCategory)
        .mockRejectedValue(new Error('Service error') as never);

      // Act & Assert
      await expect(
        usersController.findUsersWithSameInterests(mockInterests, mockUserName),
      ).rejects.toThrow('Service error');
    });
  });
});

// End of unit tests for: findUsersWithSameInterests
