// Unit tests for: setInterestsEmpty

import { UsersController } from '../users.controller';

class MockUsersService {
  setInterestsEmpty = jest.fn();
}

describe('UsersController.setInterestsEmpty() setInterestsEmpty method', () => {
  let usersController: UsersController;
  let mockUsersService: MockUsersService;

  beforeEach(() => {
    mockUsersService = new MockUsersService() as any;
    usersController = new UsersController(mockUsersService as any);
  });

  describe('Happy paths', () => {
    it('should successfully set interests to empty for a valid user', async () => {
      // Arrange
      const userName = 'testUser';
      const longitude = '123.456';
      const latitude = '78.910';
      const interest = 'sports';
      jest
        .mocked(mockUsersService.setInterestsEmpty)
        .mockResolvedValue({ success: true } as any);

      // Act
      const result = await usersController.setInterestsEmpty(
        userName,
        longitude,
        latitude,
        interest,
      );

      // Assert
      expect(mockUsersService.setInterestsEmpty).toHaveBeenCalledWith(
        userName,
        longitude,
        latitude,
        interest,
      );
      expect(result).toEqual({ success: true });
    });
  });

  describe('Edge cases', () => {
    it('should handle empty userName gracefully', async () => {
      // Arrange
      const userName = '';
      const longitude = '123.456';
      const latitude = '78.910';
      const interest = 'sports';
      jest
        .mocked(mockUsersService.setInterestsEmpty)
        .mockResolvedValue({
          success: false,
          message: 'Invalid userName',
        } as any);

      // Act
      const result = await usersController.setInterestsEmpty(
        userName,
        longitude,
        latitude,
        interest,
      );

      // Assert
      expect(mockUsersService.setInterestsEmpty).toHaveBeenCalledWith(
        userName,
        longitude,
        latitude,
        interest,
      );
      expect(result).toEqual({ success: false, message: 'Invalid userName' });
    });

    it('should handle invalid coordinates gracefully', async () => {
      // Arrange
      const userName = 'testUser';
      const longitude = 'invalid';
      const latitude = 'invalid';
      const interest = 'sports';
      jest
        .mocked(mockUsersService.setInterestsEmpty)
        .mockResolvedValue({
          success: false,
          message: 'Invalid coordinates',
        } as any);

      // Act
      const result = await usersController.setInterestsEmpty(
        userName,
        longitude,
        latitude,
        interest,
      );

      // Assert
      expect(mockUsersService.setInterestsEmpty).toHaveBeenCalledWith(
        userName,
        longitude,
        latitude,
        interest,
      );
      expect(result).toEqual({
        success: false,
        message: 'Invalid coordinates',
      });
    });

    it('should handle missing interest gracefully', async () => {
      // Arrange
      const userName = 'testUser';
      const longitude = '123.456';
      const latitude = '78.910';
      const interest = '';
      jest
        .mocked(mockUsersService.setInterestsEmpty)
        .mockResolvedValue({
          success: false,
          message: 'Interest required',
        } as any);

      // Act
      const result = await usersController.setInterestsEmpty(
        userName,
        longitude,
        latitude,
        interest,
      );

      // Assert
      expect(mockUsersService.setInterestsEmpty).toHaveBeenCalledWith(
        userName,
        longitude,
        latitude,
        interest,
      );
      expect(result).toEqual({ success: false, message: 'Interest required' });
    });
  });
});

// End of unit tests for: setInterestsEmpty
