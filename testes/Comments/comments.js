const axios = require("axios");
const apiBaseUrl = 'http://127.0.0.1:8090';

exports.deleteCommentById = async function(id, token) {
  try {
    const header = `Bearer ${token}`;
    const response = await axios.delete(`${apiBaseUrl}/comments/${id}`, { headers: { Authorization: header } });
    return response.data;
  } catch (error) {
    throw new Error("Error deleting comment");
  }
};

exports.likeComment = async function(idComment, idUser, token) {
  try {
    const header = `Bearer ${token}`;
    const response = await axios.post(`${apiBaseUrl}/comments/${idComment}/likes`, { idUser }, { headers: { Authorization: header } });
    return response.data;
  } catch (error) {
    throw new Error("Error liking comment");
  }
};

exports.getCommentLikes = async function(idComment, token) {
  try {
    const header = `Bearer ${token}`;
    const response = await axios.get(`${apiBaseUrl}/comments/${idComment}/likes`, { headers: { Authorization: header } });
    return response.data;
  } catch (error) {
    throw new Error("Error getting comment likes");
  }
};

exports.unlikeComment = async function(idComment, token) {
  try {
    const header = `Bearer ${token}`;
    const response = await axios.delete(`${apiBaseUrl}/comments/${idComment}/likes`, { headers: { Authorization: header } });
    return response.data;
  } catch (error) {
    throw new Error("Error unliking comment");
  }
};