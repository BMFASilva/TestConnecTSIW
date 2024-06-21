const axios = require("axios");
const apiBaseUrl = 'http://127.0.0.1:8090';

exports.deletePostById = async function(id,token) {
  try {
    const header = `Authorization: Bearer ${token}`;
    const response = await axios.delete(`${apiBaseUrl}/posts/${id}`, { headers: { header } });
    return response.data;
  } catch (error) {
    throw Error("error");
  }
};
exports.createPost = async function(formData, token) {
  try {
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    };

    const response = await axios.post(`${apiBaseUrl}/posts`, formData, { headers });
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getPosts = async function() {
  try {
    const response = await axios.get(`${apiBaseUrl}/posts/`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch posts");
  }
};

exports.createComment = async function(postId, commentData, token) {
  try {
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    const response = await axios.post(`${apiBaseUrl}/posts/${postId}/comments`, commentData, { headers });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.msg || error.response.data.error || 'Failed to create comment');
  }
};

exports.getComments = async function(postId) {
  try {
    const response = await axios.get(`${apiBaseUrl}/posts/${postId}/comments`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.msg || error.response?.data?.error || 'Failed to fetch comments');
  }
};

exports.createPresence = async function(presenceData, token) {
  try {
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    const response = await axios.post(`${apiBaseUrl}/posts/1/present_users`, presenceData, { headers });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.msg || error.response?.data?.error || 'Failed to create presence');
  }
};

exports.deletePresence = async function(presenceData, token) {
  try {
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    const response = await axios.delete(`${apiBaseUrl}/posts/1/present_users`, {
      headers,
      data: presenceData
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.msg || error.response?.data?.error || 'Failed to delete presence');
  }
};

exports.getPresentUsers = async function(postId, token) {
  try {
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    const response = await axios.get(`${apiBaseUrl}/posts/${postId}/present_users`, { headers });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.msg || error.response?.data?.error || 'Failed to fetch present users');
  }
};

exports.getLikes = async function(postId, token) {
  try {
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    const response = await axios.get(`${apiBaseUrl}/posts/${postId}/likes`, { headers });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.msg || error.response?.data?.error || 'Failed to fetch likes');
  }
};

exports.deleteLike = async function(idUser, idPost, token) {
  try {
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    const response = await axios.delete(`${apiBaseUrl}/posts/1/likes`, { headers, data: { idUser, idPost } });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.msg || error.response?.data?.error || 'Failed to delete like');
  }
};

exports.addLike = async function(idUser, idPost, token) {
  try {
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    const response = await axios.post(`${apiBaseUrl}/posts/1/likes`, { idUser, idPost }, { headers });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.msg || error.response?.data?.error || 'Failed to add like');
  }
};