const axios = require("axios");
const apiBaseUrl = 'http://127.0.0.1:8090';

exports.login = async function (username, password) {
  if (!username || !password) {
    throw new Error('Failed! Must provide username and password.');
  }
  try {
    const response = await axios.post(
      `${apiBaseUrl}/users/login`,
      { username, password }
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw new Error('Invalid Credentials');
    } else{
      throw new Error('User not found.');
    }
  }
};

exports.createUser = async function (username, password, role) {
  if (!username || !password || !role) {
    throw new Error('Bad request! Must provide username, password and role');
  }
  if (role !== 'regular' && role !== 'admin') {
    throw new Error('Role must be regular or admin');
  }
  try {
    const response = await axios.post(
      `${apiBaseUrl}/users`,
      { username, password, role }
    );
    return response.data;
  } catch (error) {
      throw new Error('User is already in the database');
  }
};

exports.getUserById = async function (id) {
  if (typeof id !== 'number') {
    throw new Error('user ID must be an integer');
  }
  try {
    const response = await axios.get(`${apiBaseUrl}/users/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('error');
  }
};

exports.getAllUsers = async function () {
  try {
    const response = await axios.get(`${apiBaseUrl}/users`);
    return response.data;
  } catch (error) {
    throw new Error("error");
  }
};

exports.getUserBackgrounds = async function (id, body) {
  if (isNaN(id)) {
    throw new Error('User ID must be an integer');
  }
  if (Object.keys(body).length > 1) {
    throw new Error('Only one body element is allowed');
  }
  try {
    const response = await axios.get(`${apiBaseUrl}/users/${id}/backgrounds`, { params: body });
    return response.data;
  } catch (error) {
  }
};

exports.getUserXP = async function (id) {
  if (isNaN(id)) {
    throw new Error('user ID must be an integer');
  }
  try {
    const response = await axios.get(`${apiBaseUrl}/users/${id}/xp`);
    return response.data;
  } catch (error) {
      throw new Error(error.response.data.msg);
  }
};

exports.createUserBackground = async function (id_user, body) {
  const { company, idPosition, description, beginDate, idDistrict } = body;

  if (!company || !idPosition || !description || !beginDate || !id_user || !idDistrict) {
    throw new Error('Bad request! Must provide company, idPosition, description, begin date, idUser and idDistrict');
  }

  try {
    const response = await axios.post(`${apiBaseUrl}/users/${id_user}/backgrounds`, body);
    return response.data;
  } catch (error) {   
      const { status, data } = error.response;
      if (data.msg === 'Background is already in the database') {
        throw new Error('Background is already in the database');
      } else if (data.msg === 'Malformed JWT! Please login again.') {
        throw new Error('Malformed JWT! Please login again.');
      } else {
        throw new Error('Your token has expired! Please login again.');
      }
    
  }
};