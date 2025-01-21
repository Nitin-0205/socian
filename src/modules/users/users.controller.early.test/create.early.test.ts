// Unit tests for: create

import { CreateUserDto } from '../dtos/user.dtos';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';

import { Test, TestingModule } from '@nestjs/testing';

// Mock class for UsersService
class MockUsersService {
  create = jest.fn();
}

describe('UsersController.create() create method', () => {
  let usersController: UsersController;
  let mockUsersService: MockUsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useClass: MockUsersService,
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    mockUsersService = module.get<UsersService>(UsersService) as any;
  });

  describe('Happy paths', () => {
    it('should create a user successfully with valid data', async () => {
      // Arrange
      const createUserDto: CreateUserDto = {
        phone: '1234567890',
        password: 'securePassword',
        interests: 'coding',
        username: 'testUser',
        location: 'Test City',
        age: 25,
      };
      const expectedResult = { id: 1, ...createUserDto };
      jest
        .mocked(mockUsersService.create)
        .mockResolvedValue(expectedResult as any);

      // Act
      const result = await usersController.create(createUserDto);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(mockUsersService.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('Edge cases', () => {
    it('should handle missing fields gracefully', async () => {
      // Arrange
      const createUserDto: Partial<CreateUserDto> = {
        phone: '1234567890',
        password: 'securePassword',
      } as any;
      jest.mocked(mockUsersService.create).mockResolvedValue(null as any);

      // Act
      const result = await usersController.create(
        createUserDto as CreateUserDto,
      );

      // Assert
      expect(result).toBeNull();
      expect(mockUsersService.create).toHaveBeenCalledWith(createUserDto);
    });

    it('should handle service errors gracefully', async () => {
      // Arrange
      const createUserDto: CreateUserDto = {
        phone: '1234567890',
        password: 'securePassword',
        interests: 'coding',
        username: 'testUser',
        location: 'Test City',
        age: 25,
      };
      jest
        .mocked(mockUsersService.create)
        .mockRejectedValue(new Error('Service error') as never);

      // Act & Assert
      await expect(usersController.create(createUserDto)).rejects.toThrow(
        'Service error',
      );
      expect(mockUsersService.create).toHaveBeenCalledWith(createUserDto);
    });
  });
});

// End of unit tests for: create
