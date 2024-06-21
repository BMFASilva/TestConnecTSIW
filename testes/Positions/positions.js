const axios = require("axios");
const apiBaseUrl = 'http://127.0.0.1:8090';

exports.getPositions = async function(token) {
  try {
    const header = `Authorization: Bearer ${token}`;
    const response = await axios.get(`${apiBaseUrl}/positions`, { headers: { header } });
    return response.data;
  } catch (error) {
      throw Error(error.response.data.msg);
  }
};

exports.createPosition = async function(position, token) {
  try {
    const header = `Authorization: Bearer ${token}`;
    const response = await axios.post(`${apiBaseUrl}/positions`, { position }, { headers: { header } });
    return response.data;
  } catch (error) {
      throw Error(error.response.data.msg);
  }
};