const axios = require('axios');
const { getTypePosts } = require('../testes/typePosts_districs');
const { token } = require('./config');

jest.mock('axios');

describe('Integration Test for getTypePosts', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return a list of type posts when successful', async () => {
    const mockResponse = {
      data: [
        { "id_type_post": 1, "type_post_desc": "evento" },
        { "id_type_post": 2, "type_post_desc": "vaga" }
      ],
      status: 200
    };

    axios.get.mockResolvedValue(mockResponse);

    const data = await getTypePosts(token);
    expect(data).toEqual(mockResponse.data);
  });

  test('should throw error if token is expired', async () => {
    const errorResponse = {
      response: {
        data: { success: false, msg: "Your token has expired! Please login again." },
        status: 401
      }
    };

    axios.get.mockRejectedValue(errorResponse);

    await expect(getTypePosts(token)).rejects.toThrow("Your token has expired! Please login again.");
  });

  test('should throw error if JWT is malformed', async () => {
    const errorResponse = {
      response: {
        data: { success: false, msg: "Malformed JWT! Please login again." },
        status: 400 
      }
    };

    axios.get.mockRejectedValue(errorResponse);

    await expect(getTypePosts(token)).rejects.toThrow("Malformed JWT! Please login again.");
  });

  test('should throw error if user is not admin', async () => {
    const errorResponse = {
      response: {
        data: { success: false, msg: "This request requires ADMIN role!" },
        status: 403
      }
    };

    axios.get.mockRejectedValue(errorResponse);

    await expect(getTypePosts(token)).rejects.toThrow("This request requires ADMIN role!");
  });
});