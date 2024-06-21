const axios = require("axios");
const apiBaseUrl = 'http://127.0.0.1:8090';

exports.deleteBackgroundById = async function(id,token) {
  try {
    const header = `Authorization: Bearer ${token}`;
    const response = await axios.delete(`${apiBaseUrl}/backgrounds/${id}`, { headers: { header } });
    return response.data;
  } catch (error) {
    throw Error(error.message);
  }
};

exports.updateBackgroundById = async function(id, token, newData) {
  try {
    const header = `Authorization: Bearer ${token}`;
    const response = await axios.patch(`${apiBaseUrl}/backgrounds/${id}`, newData, { headers: { header } });
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};
