// Unit tests for: getTrendingInterests

import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';

import { Test, TestingModule } from '@nestjs/testing';

// Mock class for UsersService
class MockUsersService {
  getParentCategoryWithSubcategories = jest.fn();
}

describe('UsersController.getTrendingInterests() getTrendingInterests method', () => {
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
    it('should return trending interests successfully', async () => {
      // Arrange: Mock the service method to return a successful response
      const mockResponse = [
        { category: 'Sports', subcategories: ['Football', 'Basketball'] },
      ];
      jest
        .mocked(mockUsersService.getParentCategoryWithSubcategories)
        .mockResolvedValue(mockResponse as any as never);

      // Act: Call the controller method
      const result = await usersController.getTrendingInterests();

      // Assert: Verify the result matches the mock response
      expect(result).toEqual(mockResponse);
      expect(
        mockUsersService.getParentCategoryWithSubcategories,
      ).toHaveBeenCalled();
    });
  });

  describe('Edge cases', () => {
    it('should handle empty response gracefully', async () => {
      // Arrange: Mock the service method to return an empty array
      jest
        .mocked(mockUsersService.getParentCategoryWithSubcategories)
        .mockResolvedValue([] as any as never);

      // Act: Call the controller method
      const result = await usersController.getTrendingInterests();

      // Assert: Verify the result is an empty array
      expect(result).toEqual([]);
      expect(
        mockUsersService.getParentCategoryWithSubcategories,
      ).toHaveBeenCalled();
    });

    it('should handle service errors gracefully', async () => {
      // Arrange: Mock the service method to throw an error
      jest
        .mocked(mockUsersService.getParentCategoryWithSubcategories)
        .mockRejectedValue(new Error('Service error') as never);

      // Act & Assert: Call the controller method and expect it to throw an error
      await expect(usersController.getTrendingInterests()).rejects.toThrow(
        'Service error',
      );
      expect(
        mockUsersService.getParentCategoryWithSubcategories,
      ).toHaveBeenCalled();
    });
  });
});

// End of unit tests for: getTrendingInterests
