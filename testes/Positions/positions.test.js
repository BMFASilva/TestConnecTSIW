const axios = require('axios');
const { getPositions, createPosition } = require('./positions'); 
const { token } = require('../config');

jest.mock('axios');

describe('Integration Test for getPositions', () => {
  test('should return positions list', async () => {
    const mockResponse = {
      data: [
        { id: 1, name: 'Position 1' },
        { id: 2, name: 'Position 2' }
      ]
    };

    axios.get.mockResolvedValue(mockResponse);

    const data = await getPositions(token);
    expect(data).toEqual(mockResponse.data);
  });

  test('should throw an error for getPositions', async () => {
    const mockErrorResponse = {
      response: {
        data: {
          msg: 'error'
        }
      }
    };
    
    axios.get.mockRejectedValue(mockErrorResponse);

    await expect(getPositions(token)).rejects.toThrow('error');
  });
});

describe('Integration Test for createPosition', () => {
  test('should return success message if position was created', async () => {
    const mockResponse = {
      data: "Position created successfully",
      status: 201
    };

    axios.post.mockResolvedValue(mockResponse);

    const newPosition = "arrumador de carros";

    const data = await createPosition(newPosition, token);
    expect(data).toEqual(mockResponse.data);
  });

  test('should throw an error for createPosition', async () => {
    const mockErrorResponse = {
      response: {
        data: {
          msg: 'error'
        }
      }
    };

    axios.post.mockRejectedValue(mockErrorResponse);

    const newPosition = "arrumador de carros";

    await expect(createPosition(newPosition, token)).rejects.toThrow('error');
  });

  test('should handle repeated position error', async () => {
    const mockErrorResponse = {
      response: {
        data: {
          success: false,
          msg: "Position is already in the database"
        }
      }
    };

    axios.post.mockRejectedValue(mockErrorResponse);

    const newPosition = "arrumador de carros";

    await expect(createPosition(newPosition, token)).rejects.toThrow("Position is already in the database");
  });
});