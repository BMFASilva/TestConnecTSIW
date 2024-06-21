const axios = require("axios");
const apiBaseUrl = 'http://127.0.0.1:8090';

exports.getDistricts = async function(token) {
    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      const response = await axios.get(`${apiBaseUrl}/districts`, { headers });
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.msg || error.response.data.error || 'Failed to get districts');
    }
  };
  
  exports.getTypePosts = async function(token) {
    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      const response = await axios.get(`${apiBaseUrl}/type_posts`, { headers });
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.msg || error.response.data.error || 'Failed to get type posts');
    }
  };