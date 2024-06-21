const axios = require('axios');
const { deleteBackgroundById, updateBackgroundById } = require('./background');
const { token } = require('../config');

jest.mock('axios');

describe('Integration Test for deleteBackgroundById', () => {
  test('should return success message if deletion was successful', async () => {
    const mockResponse = {
      data: "Background deleted successfully",
      status: 200
    };

    axios.delete.mockResolvedValue(mockResponse); // Configura o mock para axios.delete

    const id_background = 2;

    const data = await deleteBackgroundById(id_background, token);
    expect(data).toEqual(mockResponse.data);
  });

  test('should throw an error for invalid background ID', async () => {
    axios.delete.mockRejectedValue(new Error('error'));

    const id_background = 999;

    await expect(deleteBackgroundById(id_background)).rejects.toThrow('error');
  });

  test('should handle Malformed JWT error', async () => {
    axios.delete.mockRejectedValue(new Error('Malformed JWT')); 

    const id_background = 3;

    await expect(deleteBackgroundById(id_background, token)).rejects.toThrow('Malformed JWT');
  });

  test('should handle Invalid Token error', async () => {
    axios.delete.mockRejectedValue(new Error('Invalid Token')); 

    const id_background = 3;

    await expect(deleteBackgroundById(id_background, token)).rejects.toThrow('Invalid Token');
  });
});

describe('Integration Test for updateBackgroundById', () => {
  test('should update background successfully', async () => {
    const mockData = {
      begin_date: "2024-01-30",
      company: "Beniregion",
      end_date: "2024-04-28"
    };

    const mockResponse = {
      data: {
        success: true,
        msg: `Background with ID 3 was updated successfully`
      },
      status: 200
    };

    axios.patch.mockResolvedValue(mockResponse);

    const id_background = 3;

    const data = await updateBackgroundById(id_background, token, mockData);
    expect(data).toEqual(mockResponse.data);
  });

  test('should throw an error for invalid background ID', async () => {
    axios.patch.mockRejectedValue(new Error('error'));

    const id_background = 999; // Assuming this ID does not exist

    await expect(updateBackgroundById(id_background, token, {})).rejects.toThrow('error');
  });

  test('should handle Malformed JWT error', async () => {
    axios.patch.mockRejectedValue(new Error('Malformed JWT'));

    const id_background = 3;

    await expect(updateBackgroundById(id_background, token, {})).rejects.toThrow('Malformed JWT');
  });

  test('should handle Invalid Token error', async () => {
    axios.patch.mockRejectedValue(new Error('Invalid Token'));

    const id_background = 3;

    await expect(updateBackgroundById(id_background, token, {})).rejects.toThrow('Invalid Token');
  });

  test('should handle No updates made error', async () => {
    const mockResponse = {
      data: {
        success: true,
        msg: 'No updates were made on background with ID 3.'
      },
      status: 200
    };

    axios.patch.mockResolvedValue(mockResponse);

    const id_background = 3;

    const data = await updateBackgroundById(id_background, token, {});
    expect(data).toEqual(mockResponse.data);
  });
});