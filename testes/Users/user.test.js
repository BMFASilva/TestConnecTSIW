const axios = require('axios');
const {
  login,
  createUser,
  getUserById,
  getAllUsers,
  getUserBackgrounds,
  getUserXP,
  createUserBackground
} = require('./user');

jest.mock('axios');

describe('Integration Test for Login', () => {
  test('should return data if login was successful', async () => {
    const mockResponse = {
      data: {
        id: 1,
        token: 'abcd1234'
      }
    };
    axios.post.mockResolvedValue(mockResponse);

    const data = await login('bruno', '123');
    expect(data).toEqual(mockResponse.data);
  });

  test('should throw an error for invalid login credentials', async () => {
    axios.post.mockRejectedValue({ response: { status: 401 } });

    await expect(login('wronguser', 'wrongpass')).rejects.toThrow('Invalid Credentials');
  });

  test('should throw an error for user not found', async () => {
    axios.post.mockRejectedValue({ response: { status: 404 } });

    await expect(login('nonexistentuser', 'password')).rejects.toThrow('User not found.');
  });

  test('should throw an error for missing username or password', async () => {
    await expect(login('', 'password')).rejects.toThrow('Failed! Must provide username and password.');
    await expect(login('username', '')).rejects.toThrow('Failed! Must provide username and password.');
  });
});

describe('Integration Test for CreateUser', () => {
  test('should return success message if user creation was successful', async () => {
    const mockResponse = {
      data: 'User created successfully',
      status: 201
    };
    axios.post.mockResolvedValue(mockResponse);

    const data = await createUser('goncalo', '123', 'regular');
    expect(data).toEqual(mockResponse.data);
  });

  test('should throw an error for existing user', async () => {
    axios.post.mockRejectedValue({ response: { status: 409 } });

    await expect(createUser('existinguser', 'password', 'regular')).rejects.toThrow('User is already in the database');
  });

  test('should throw an error for invalid role', async () => {
    await expect(createUser('newuser', 'password', 'invalidrole')).rejects.toThrow('Role must be regular or admin');
  });

  test('should throw an error for missing username, password, or role', async () => {
    await expect(createUser('', 'password', 'regular')).rejects.toThrow('Bad request! Must provide username, password and role');
    await expect(createUser('username', '', 'regular')).rejects.toThrow('Bad request! Must provide username, password and role');
    await expect(createUser('username', 'password', '')).rejects.toThrow('Bad request! Must provide username, password and role');
  });
});

describe('Integration Test for getUserById', () => {
  test('should return user data for a valid user ID', async () => {
    const mockResponse = {
      data: {
        "id_user": 1,
        "nif": 123456789,
        "first_name": "John",
        "last_name": "Doe",
        "username": "johndoe",
        "email": "johndoe@gmail.com",
        "password": "$2y$12$8AA59FCE83DF6D56E0186762FCBE5306784BE95C3E65D9BC10F9412E65F955AC80889EA309C7B2BF368393B818BD027FC7A40AF6A344DDADA5B25AB3877CD4E958114d6e551c0cbc7500989745bbd5161e31256d57ba4c71d64877fb976",
        "role": "regular",
        "foto": null,
        "cloudinary_id_foto": null,
        "CV": null,
        "cloudinary_id_CV": null,
        "about": null,
        "xp": 0,
        "create_date": "2024-06-18T16:15:42.000Z"
      }
    };

    axios.get.mockResolvedValue(mockResponse);

    const id_user = mockResponse.data.id_user;
    const data = await getUserById(id_user);
    expect(data).toEqual(mockResponse.data);
  });

  test('should throw an error for an invalid user ID', async () => {
    axios.get.mockRejectedValue(new Error('error'));

    await expect(getUserById(999)).rejects.toThrow('error');
  });
  test('should throw an error for a non-numeric user ID', async () => {
    const id_user = 'invalid_id';
    await expect(getUserById(id_user)).rejects.toThrow('user ID must be an integer');
  });
});

describe('Integration Test for getAllUsers', () => {
  test('should return all users', async () => {
    const mockResponse = {
      data: [
        {
          "id_user": 1,
          "nif": 123456789,
          "first_name": "John",
          "last_name": "Doe",
          "username": "johndoe",
          "email": "johndoe@gmail.com",
          "password": "$2y$12$8AA59FCE83DF6D56E0186762FCBE5306784BE95C3E65D9BC10F9412E65F955AC80889EA309C7B2BF368393B818BD027FC7A40AF6A344DDADA5B25AB3877CD4E958114d6e551c0cbc7500989745bbd5161e31256d57ba4c71d64877fb976",
          "role": "regular",
          "foto": null,
          "cloudinary_id_foto": null,
          "CV": null,
          "cloudinary_id_CV": null,
          "about": null,
          "xp": 0,
          "create_date": "2024-06-18T16:15:42.000Z"
        },
        {
          "id_user": 2,
          "nif": 987654321,
          "first_name": "Jane",
          "last_name": "Doe",
          "username": "janedoe",
          "email": "janedoe@gmail.com",
          "password": "$2y$12$8AA59FCE83DF6D56E0186762FCBE5306784BE95C3E65D9BC10F9412E65F955AC80889EA309C7B2BF368393B818BD027FC7A40AF6A344DDADA5B25AB3877CD4E958114d6e551c0cbc7500989745bbd5161e31256d57ba4c71d64877fb976",
          "role": "regular",
          "foto": null,
          "cloudinary_id_foto": null,
          "CV": null,
          "cloudinary_id_CV": null,
          "about": null,
          "xp": 0,
          "create_date": "2024-06-18T16:15:42.000Z"
        }
      ]
    };

    axios.get.mockResolvedValue(mockResponse);

    const data = await getAllUsers();
    expect(data).toEqual(mockResponse.data);
  });

  test('should throw an error if unable to fetch users', async () => {
    axios.get.mockRejectedValue(new Error('error'));

    await expect(getAllUsers()).rejects.toThrow('error');
  });
});

describe('Integration Test for getUserBackgrounds', () => {
  test('should return backgrounds for a valid user ID', async () => {
    const mockResponse = {
      data: [
        {
          id_background: 1,
          id_user: 2,
          name_company: 'egor',
          id_district: 13,
          id_position: 1,
          begin_date: '2024-05-20',
          end_date: null,
          descricao_position: 'Programador UIPATH'
        }
      ]
    };
    axios.get.mockResolvedValue(mockResponse);

    const id_user = 2;
    const body = { district: true };
    const data = await getUserBackgrounds(id_user, body);
    expect(data).toEqual(mockResponse.data);
  });

  test('should throw an error for NaN user ID', async () => {
    const id_user = 'invalid_id';
    const body = { district: true };
    await expect(getUserBackgrounds(id_user, body)).rejects.toThrow('User ID must be an integer');
  });

  test('should throw an error for more than one body element', async () => {
    const id_user = 2;
    const body = { district: true, position: 1 };
    await expect(getUserBackgrounds(id_user, body)).rejects.toThrow('Only one body element is allowed');
  });
});

describe('Integration Test for createUserBackground', () => {
  test('should return success message if background creation was successful', async () => {
    const mockResponse = {
      data: 'Background created successfully',
      status: 201
    };
    axios.post.mockResolvedValue(mockResponse);

    const id_user = 2;
    const body = {
      company: 'egor',
      idDistrict: 13,
      description: 'Programador UIPATH',
      idPosition: 1,
      beginDate: '2024-05-20'
    };
    const data = await createUserBackground(id_user, body);
    expect(data).toEqual(mockResponse.data);
  });

  test('should throw an error for missing fields', async () => {
    const id_user = 2;
    const body = {};
    await expect(createUserBackground(id_user, body)).rejects.toThrow('Bad request! Must provide company, idPosition, description, begin date, idUser and idDistrict');
  });

  test('should throw an error for existing background', async () => {
    axios.post.mockRejectedValue({ response: { status: 409, data: { msg: 'Background is already in the database' } } });

    const id_user = 2;
    const body = {
      company: 'egor',
      idDistrict: 13,
      description: 'Programador UIPATH',
      idPosition: 1,
      beginDate: '2024-05-20'
    };
    await expect(createUserBackground(id_user, body)).rejects.toThrow('Background is already in the database');
  });

  test('should throw an error for malformed JWT', async () => {
    axios.post.mockRejectedValue({ response: { status: 401, data: { msg: 'Malformed JWT! Please login again.' } } });

    const id_user = 2;
    const body = {
      company: 'egor',
      idDistrict: 13,
      description: 'Programador UIPATH',
      idPosition: 1,
      beginDate: '2024-05-20'
    };
    await expect(createUserBackground(id_user, body)).rejects.toThrow('Malformed JWT! Please login again.');
  });

  test('should throw an error for invalid token', async () => {
    axios.post.mockRejectedValue({ response: { status: 401, data: { msg: 'Your token has expired! Please login again.' } } });

    const id_user = 2;
    const body = {
      company: 'egor',
      idDistrict: 13,
      description: 'Programador UIPATH',
      idPosition: 1,
      beginDate: '2024-05-20'
    };
    await expect(createUserBackground(id_user, body)).rejects.toThrow('Your token has expired! Please login again.');
  });
});

describe('Integration Test for getUserXP', () => {
  test('should return xp for a valid user ID', async () => {
    const mockResponse = {
      data: [
        {
          xp: 100
        }
      ]
    };
    axios.get.mockResolvedValue(mockResponse);

    const id_user = 2;
    const data = await getUserXP(id_user);
    expect(data).toEqual(mockResponse.data);
  });

  test('should throw an error for NaN user ID', async () => {
    const id_user = 'invalid_id';
    await expect(getUserXP(id_user)).rejects.toThrow('user ID must be an integer');
  });

  test('should throw an error for malformed JWT', async () => {
    axios.get.mockRejectedValue({ response: { status: 401, data: { msg: 'Malformed JWT! Please login again.' } } });

    const id_user = 2;
    await expect(getUserXP(id_user)).rejects.toThrow('Malformed JWT! Please login again.');
  });

  test('should throw an error for invalid token', async () => {
    axios.get.mockRejectedValue({ response: { status: 401, data: { msg: 'Your token has expired! Please login again.' } } });

    const id_user = 2;
    await expect(getUserXP(id_user)).rejects.toThrow('Your token has expired! Please login again.');
  });
});