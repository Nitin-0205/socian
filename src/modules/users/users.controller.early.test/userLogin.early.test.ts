// Unit tests for: userLogin

import { LoginUserDto } from '../dtos/user.dtos';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';

import { Test, TestingModule } from '@nestjs/testing';

class MockUsersService {
  userLogin = jest.fn();
}

describe('UsersController.userLogin() userLogin method', () => {
  let usersController: UsersController;
  let mockUsersService: MockUsersService;

  beforeEach(async () => {
    mockUsersService = new MockUsersService();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
  });

  describe('Happy paths', () => {
    it('should successfully login a user with valid credentials', async () => {
      // Arrange
      const loginUserDto: LoginUserDto = {
        user_id: 'validUserId',
        password: 'validPassword',
      };
      const expectedResponse = { token: 'someToken' };
      jest
        .mocked(mockUsersService.userLogin)
        .mockResolvedValue(expectedResponse as any as never);

      // Act
      const result = await usersController.userLogin(loginUserDto);

      // Assert
      expect(result).toEqual(expectedResponse);
      expect(mockUsersService.userLogin).toHaveBeenCalledWith(loginUserDto);
    });
  });

  describe('Edge cases', () => {
    it('should handle login with incorrect credentials', async () => {
      // Arrange
      const loginUserDto: LoginUserDto = {
        user_id: 'invalidUserId',
        password: 'invalidPassword',
      };
      jest
        .mocked(mockUsersService.userLogin)
        .mockRejectedValue(new Error('Invalid credentials') as never);

      // Act & Assert
      await expect(usersController.userLogin(loginUserDto)).rejects.toThrow(
        'Invalid credentials',
      );
      expect(mockUsersService.userLogin).toHaveBeenCalledWith(loginUserDto);
    });

    it('should handle login with missing user_id', async () => {
      // Arrange
      const loginUserDto: LoginUserDto = {
        user_id: '',
        password: 'somePassword',
      };
      jest
        .mocked(mockUsersService.userLogin)
        .mockRejectedValue(new Error('User ID is required') as never);

      // Act & Assert
      await expect(usersController.userLogin(loginUserDto)).rejects.toThrow(
        'User ID is required',
      );
      expect(mockUsersService.userLogin).toHaveBeenCalledWith(loginUserDto);
    });

    it('should handle login with missing password', async () => {
      // Arrange
      const loginUserDto: LoginUserDto = {
        user_id: 'someUserId',
        password: '',
      };
      jest
        .mocked(mockUsersService.userLogin)
        .mockRejectedValue(new Error('Password is required') as never);

      // Act & Assert
      await expect(usersController.userLogin(loginUserDto)).rejects.toThrow(
        'Password is required',
      );
      expect(mockUsersService.userLogin).toHaveBeenCalledWith(loginUserDto);
    });
  });
});

// End of unit tests for: userLogin
