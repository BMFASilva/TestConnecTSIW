const axios = require('axios');
const { getDistricts } = require('../testes/typePosts_districs');
const { token } = require('./config');

jest.mock('axios');

describe('Integration Test for getDistricts', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return a list of districts when successful', async () => {
    const mockResponse = {
      data: [
        { id_district: 1, district: "Aveiro" },
        { id_district: 2, district: "Beja" },
        { id_district: 3, district: "Braga" },
        { id_district: 4, district: "Bragança" },
        { id_district: 5, district: "Castelo Branco" },
        { id_district: 6, district: "Coimbra" },
        { id_district: 7, district: "Évora" },
        { id_district: 8, district: "Faro" },
        { id_district: 9, district: "Guarda" },
        { id_district: 10, district: "Leiria" },
        { id_district: 11, district: "Lisboa" },
        { id_district: 12, district: "Portalegre" },
        { id_district: 13, district: "Porto" },
        { id_district: 14, district: "Santarém" },
        { id_district: 15, district: "Setúbal" },
        { id_district: 16, district: "Viana do Castelo" },
        { id_district: 17, district: "Vila Real" },
        { id_district: 18, district: "Viseu" }
      ],
      status: 200 
    };

    axios.get.mockResolvedValue(mockResponse);

    const data = await getDistricts(token);
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

    await expect(getDistricts(token)).rejects.toThrow("Your token has expired! Please login again.");
  });

  test('should throw error if JWT is malformed', async () => {
    const errorResponse = {
      response: {
        data: { success: false, msg: "Malformed JWT! Please login again." },
        status: 400
      }
    };

    axios.get.mockRejectedValue(errorResponse);

    await expect(getDistricts(token)).rejects.toThrow("Malformed JWT! Please login again.");
  });
});