const axios = require('axios');
const { deletePostById, 
        createPost, 
        getPosts, 
        createComment, 
        getComments, 
        createPresence, 
        deletePresence, 
        getPresentUsers, 
        getLikes, 
        deleteLike, 
        addLike } = require('./post');
const { token } = require('../config');
const fs = require('fs');
const FormData = require('form-data');

jest.mock('axios');

describe('Integration Test for deletePostById', () => {
  test('should return success message if deletion was successful', async () => {
    const mockResponse = {
      data: "Post deleted successfully",
      status: 200
    };

    axios.delete.mockResolvedValue(mockResponse);

    const id_post = 2; 

    const data = await deletePostById(id_post, token);
    expect(data).toEqual(mockResponse.data);
  });

  test('should throw an error for invalid post ID', async () => {
    axios.delete.mockRejectedValue(new Error('error'));

    const id_post = 999;

    await expect(deletePostById(id_post)).rejects.toThrow('error');
  });
});

describe('Integration Test for createPost', () => {
  test('should return success message if creation was successful', async () => {
    const mockResponse = {
      data: "Post created successfully",
      status: 201 
    };

    const formData = new FormData();
    formData.append("idType", "1");
    formData.append("content", "Novo Evento no porto 4");
    formData.append("district", "13");
    formData.append("beginDate", "2024-05-17");
    formData.append("endDate", "2024-05-20 01:00:00");
    const filePath = './651a877bffd49c7ce8c1f6d2_workshop.jpg';
    const fileStream = fs.createReadStream(filePath);
    formData.append("image", fileStream);

    axios.post.mockResolvedValue(mockResponse);

    const data = await createPost(formData, token);
    expect(data).toEqual(mockResponse.data);
  });

  test('should throw an error if post creation fails', async () => {
    axios.post.mockRejectedValue(new Error('Failed to create post'));

    const formData = new FormData();
    formData.append("idType", "1");
    formData.append("content", "Novo Evento no porto 4");
    formData.append("district", "13");
    formData.append("beginDate", "2024-05-17");
    formData.append("endDate", "2024-05-20 01:00:00");

    const filePath = './651a877bffd49c7ce8c1f6d2_workshop.jpg';
    const fileStream = fs.createReadStream(filePath);
    formData.append("image", fileStream);

    await expect(createPost(formData, token)).rejects.toThrow('Failed to create post');
  });
});

describe('Integration Test for getPosts', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return an array of posts', async () => {
    const mockResponse = [
      {
        "id_post": 1,
        "id_type_post": 1,
        "content": "Evento 123",
        "date_post": "2024-05-13",
        "id_district": 13,
        "begin_date": "2024-05-13",
        "end_date": "2024-05-15T00:00:00.000Z",
        "image": null,
        "cloudinary_id": null,
        "link": null
      },
      {
        "id_post": 2,
        "id_type_post": 1,
        "content": "Novo Evento no porto 4",
        "date_post": "2024-06-06",
        "id_district": 13,
        "begin_date": "2024-05-17",
        "end_date": "2024-05-20T00:00:00.000Z",
        "image": "http://res.cloudinary.com/dvyic4oaf/image/upload/v1717681758/scqyrss2uw8dxizcdgjs.jpg",
        "cloudinary_id": "scqyrss2uw8dxizcdgjs",
        "link": null
      },
      {
        "id_post": 3,
        "id_type_post": 1,
        "content": "Novo Evento no porto 4",
        "date_post": "2024-06-07",
        "id_district": 13,
        "begin_date": "2024-05-17",
        "end_date": "2024-05-20T00:00:00.000Z",
        "image": "http://res.cloudinary.com/dvyic4oaf/image/upload/v1717769621/appjzptrbc3ofigkquxz.jpg",
        "cloudinary_id": "appjzptrbc3ofigkquxz",
        "link": null
      }
    ];

    axios.get.mockResolvedValue({ data: mockResponse });

    const data = await getPosts();
    expect(data).toEqual(mockResponse);
  });

  test('should throw an error if fetching posts fails', async () => {
    axios.get.mockRejectedValue(new Error('Failed to fetch posts'));

    await expect(getPosts()).rejects.toThrow('Failed to fetch posts');
  });
});

describe('Integration Test for createComment', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const postId = 5;
  const commentData = { content: "Comentario 2 blah blah bah", idUser: 2 };

  test('should return success message if comment creation was successful', async () => {
    const mockResponse = {
      data: "Comment created successfully",
      status: 201 
    };

    axios.post.mockResolvedValue(mockResponse);

    const data = await createComment(postId, commentData, token);
    expect(data).toEqual(mockResponse.data);
  });

  test('should throw error for repeated comment', async () => {
    const errorResponse = {
      response: {
        data: {
          success: false,
          msg: "Comment is already in the database"
        },
        status: 400
      }
    };

    axios.post.mockRejectedValue(errorResponse);

    await expect(createComment(postId, commentData, token)).rejects.toThrow('Comment is already in the database');
  });

  test('should throw error if IDs are NaN', async () => {
    const errorResponse = {
      response: {
        data: {
          error: "ID's must be an integer"
        },
        status: 400
      }
    };

    axios.post.mockRejectedValue(errorResponse);

    await expect(createComment("NaN", commentData, token)).rejects.toThrow("ID's must be an integer");
  });

  test('should throw error if User ID not found', async () => {
    const errorResponse = {
      response: {
        data: {
          success: false,
          msg: "Not a valid User ID."
        },
        status: 404
      }
    };

    axios.post.mockRejectedValue(errorResponse);

    await expect(createComment(postId, commentData, token)).rejects.toThrow('Not a valid User ID.');
  });

  test('should throw error if Post ID not found', async () => {
    const errorResponse = {
      response: {
        data: {
          success: false,
          msg: "Post ID not found"
        },
        status: 404
      }
    };

    axios.post.mockRejectedValue(errorResponse);

    await expect(createComment(postId, commentData, token)).rejects.toThrow('Post ID not found');
  });

  test('should throw error for malformed token', async () => {
    const errorResponse = {
      response: {
        data: {
          success: false,
          msg: "Malformed JWT! Please login again."
        },
        status: 401
      }
    };

    axios.post.mockRejectedValue(errorResponse);

    await expect(createComment(postId, commentData, token)).rejects.toThrow('Malformed JWT! Please login again.');
  });

  test('should throw error for expired token', async () => {
    const errorResponse = {
      response: {
        data: {
          success: false,
          msg: "Your token has expired! Please login again."
        },
        status: 401
      }
    };

    axios.post.mockRejectedValue(errorResponse);

    await expect(createComment(postId, commentData, token)).rejects.toThrow('Your token has expired! Please login again.');
  });

  test('should throw error if content is not provided', async () => {
    const errorResponse = {
      response: {
        data: {
          success: false,
          msg: "Fill content field"
        },
        status: 400
      }
    };

    const incompleteCommentData = { idUser: 2 };

    axios.post.mockRejectedValue(errorResponse);

    await expect(createComment(postId, incompleteCommentData, token)).rejects.toThrow('Fill content field');
  });
});

describe('Integration Test for getComments', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const postId = 5;

  test('should return an array of comments if fetching was successful', async () => {
    const mockResponse = [
      {
        "id_comment": 2,
        "id_user": 1,
        "content": "Comentario 2 blah blah bah",
        "id_post": 5,
        "date": "2024-06-07T14:36:54.000Z"
      }
    ];

    axios.get.mockResolvedValue({ data: mockResponse });

    const data = await getComments(postId);
    expect(data).toEqual(mockResponse);
  });

  test('should throw error if Post ID is NaN', async () => {
    const errorResponse = {
      response: {
        data: {
          error: "Post ID must be an integer"
        },
        status: 400
      }
    };

    axios.get.mockRejectedValue(errorResponse);

    await expect(getComments("NaN")).rejects.toThrow("Post ID must be an integer");
  });

  test('should throw error if Post ID not found', async () => {
    const errorResponse = {
      response: {
        data: {
          success: false,
          msg: "Post ID not found."
        },
        status: 404
      }
    };

    axios.get.mockRejectedValue(errorResponse);

    await expect(getComments(postId)).rejects.toThrow('Post ID not found.');
  });
});

describe('Integration Test for createPresence', () => {
  afterEach(() => {
    jest.clearAllMocks(); 
  });

  const presenceData = { idUser: 1, idPost: 5 };

  test('should return success message if presence creation was successful', async () => {
    const mockResponse = {
      data: "Presence created successfully",
      status: 201 
    };

    axios.post.mockResolvedValue(mockResponse);

    const data = await createPresence(presenceData, token);
    expect(data).toEqual(mockResponse.data);
  });

  test('should throw error for repeated presence', async () => {
    const errorResponse = {
      response: {
        data: {
          success: false,
          msg: "present_user is already in the database"
        },
        status: 400 
      }
    };

    axios.post.mockRejectedValue(errorResponse);

    await expect(createPresence(presenceData, token)).rejects.toThrow('present_user is already in the database');
  });

  test('should throw error if User does not exist', async () => {
    const errorResponse = {
      response: {
        data: {
          success: false,
          msg: "User not exists"
        },
        status: 404 
      }
    };

    axios.post.mockRejectedValue(errorResponse);

    await expect(createPresence(presenceData, token)).rejects.toThrow('User not exists');
  });

  test('should throw error if IDs are NaN', async () => {
    const errorResponse = {
      response: {
        data: {
          error: "ID's must be an integer"
        },
        status: 400
      }
    };

    const invalidPresenceData = { idUser: "NaN", idPost: "NaN" };

    axios.post.mockRejectedValue(errorResponse);

    await expect(createPresence(invalidPresenceData, token)).rejects.toThrow("ID's must be an integer");
  });

  test('should throw error if Post does not exist', async () => {
    const errorResponse = {
      response: {
        data: {
          success: false,
          msg: "Post not exists"
        },
        status: 404
      }
    };

    axios.post.mockRejectedValue(errorResponse);

    await expect(createPresence(presenceData, token)).rejects.toThrow('Post not exists');
  });

  test('should throw error for malformed JWT', async () => {
    const errorResponse = {
      response: {
        data: {
          success: false,
          msg: "Malformed JWT! Please login again."
        },
        status: 401
      }
    };

    axios.post.mockRejectedValue(errorResponse);

    await expect(createPresence(presenceData, token)).rejects.toThrow('Malformed JWT! Please login again.');
  });

  test('should throw error for expired or invalid token', async () => {
    const errorResponse = {
      response: {
        data: {
          success: false,
          msg: "Your token has expired! Please login again."
        },
        status: 401
      }
    };

    axios.post.mockRejectedValue(errorResponse);

    await expect(createPresence(presenceData, token)).rejects.toThrow('Your token has expired! Please login again.');
  });

  test('should throw error if not enough fields are provided', async () => {
    const errorResponse = {
      response: {
        data: {
          error: "Bad request! Must provide idUser and idPost"
        },
        status: 400
      }
    };

    const incompletePresenceData = { idUser: 1 };

    axios.post.mockRejectedValue(errorResponse);

    await expect(createPresence(incompletePresenceData, token)).rejects.toThrow('Bad request! Must provide idUser and idPost');
  });
});

describe('Integration Test for deletePresence', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const presenceData = { idUser: 2, idPost: 5 };

  test('should return success message if presence deletion was successful', async () => {
    const mockResponse = {
      data: {
        success: true,
        msg: "Presence was successfully deleted!"
      },
      status: 200
    };

    axios.delete.mockResolvedValue(mockResponse);

    const data = await deletePresence(presenceData, token);
    expect(data).toEqual(mockResponse.data);
  });

  test('should throw error if token expired', async () => {
    const errorResponse = {
      response: {
        data: {
          success: false,
          msg: "Your token has expired! Please login again."
        },
        status: 401
      }
    };

    axios.delete.mockRejectedValue(errorResponse);

    await expect(deletePresence(presenceData, token)).rejects.toThrow('Your token has expired! Please login again.');
  });

  test('should throw error for malformed JWT', async () => {
    const errorResponse = {
      response: {
        data: {
          success: false,
          msg: "Malformed JWT! Please login again."
        },
        status: 401
      }
    };

    axios.delete.mockRejectedValue(errorResponse);

    await expect(deletePresence(presenceData, token)).rejects.toThrow('Malformed JWT! Please login again.');
  });

  test('should throw error if presence not found', async () => {
    const errorResponse = {
      response: {
        data: {
          error: "Presence not found, check id's"
        },
        status: 404
      }
    };

    axios.delete.mockRejectedValue(errorResponse);

    await expect(deletePresence(presenceData, token)).rejects.toThrow("Presence not found, check id's");
  });

  test('should throw error if IDs are NaN', async () => {
    const errorResponse = {
      response: {
        data: {
          error: "ID's must be an integer"
        },
        status: 400
      }
    };

    const invalidPresenceData = { idUser: "NaN", idPost: "NaN" };

    axios.delete.mockRejectedValue(errorResponse);

    await expect(deletePresence(invalidPresenceData, token)).rejects.toThrow("ID's must be an integer");
  });

  test('should throw error if not enough fields are provided', async () => {
    const errorResponse = {
      response: {
        data: {
          error: "Bad request! Must provide idUser and idPost"
        },
        status: 400 
      }
    };

    const incompletePresenceData = { idUser: 2 };

    axios.delete.mockRejectedValue(errorResponse);

    await expect(deletePresence(incompletePresenceData, token)).rejects.toThrow('Bad request! Must provide idUser and idPost');
  });
});

describe('Integration Test for getPresentUsers', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const postId = 10;

  test('should return present users if request was successful', async () => {
    const mockResponse = {
      data: [
        {
          "id_user": 1,
          "id_post": 1
        }
      ],
      status: 200 
    };

    axios.get.mockResolvedValue(mockResponse);

    const data = await getPresentUsers(postId, token);
    expect(data).toEqual(mockResponse.data);
  });

  test('should throw error if Post ID is NaN', async () => {
    const errorResponse = {
      response: {
        data: {
          error: "Post ID must be an integer"
        },
        status: 400
      }
    };

    axios.get.mockRejectedValue(errorResponse);

    await expect(getPresentUsers("NaN", token)).rejects.toThrow("Post ID must be an integer");
  });

  test('should throw error if Post not found', async () => {
    const errorResponse = {
      response: {
        data: {
          success: false,
          msg: "Post ID not found."
        },
        status: 404
      }
    };

    axios.get.mockRejectedValue(errorResponse);

    await expect(getPresentUsers(postId, token)).rejects.toThrow("Post ID not found.");
  });
});

describe('Integration Test for getLikes', () => {
  afterEach(() => {
    jest.clearAllMocks(); 
  });

  const postId = 4;

  test('should return likes if request was successful', async () => {
    const mockResponse = {
      data: [
        {
          "id_user": 2,
          "id_post": 3
        },
        {
          "id_user": 1,
          "id_post": 3
        }
      ],
      status: 200
    };

    axios.get.mockResolvedValue(mockResponse);

    const data = await getLikes(postId, token);
    expect(data).toEqual(mockResponse.data);
  });

  test('should throw error if Post not found', async () => {
    const errorResponse = {
      response: {
        data: {
          success: false,
          msg: "Post ID not found."
        },
        status: 404
      }
    };

    axios.get.mockRejectedValue(errorResponse);

    await expect(getLikes(postId, token)).rejects.toThrow("Post ID not found.");
  });

  test('should throw error if Post ID is NaN', async () => {
    const errorResponse = {
      response: {
        data: {
          error: "Post ID must be an integer"
        },
        status: 400
      }
    };

    axios.get.mockRejectedValue(errorResponse);

    await expect(getLikes("NaN", token)).rejects.toThrow("Post ID must be an integer");
  });
});

describe('Integration Test for deleteLike', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const idUser = 2;
  const idPost = 5;

  test('should return success message if deletion was successful', async () => {
    const mockResponse = {
      data: {
        success: true,
        msg: "Like was successfully deleted!"
      },
      status: 200 
    };

    axios.delete.mockResolvedValue(mockResponse);

    const data = await deleteLike(idUser, idPost, token);
    expect(data).toEqual(mockResponse.data);
  });

  test('should throw error if token is expired', async () => {
    const errorResponse = {
      response: {
        data: {
          success: false,
          msg: "Your token has expired! Please login again."
        },
        status: 401 
      }
    };

    axios.delete.mockRejectedValue(errorResponse);

    await expect(deleteLike(idUser, idPost, token)).rejects.toThrow("Your token has expired! Please login again.");
  });

  test('should throw error if JWT is malformed', async () => {
    const errorResponse = {
      response: {
        data: {
          success: false,
          msg: "Malformed JWT! Please login again."
        },
        status: 400 
      }
    };

    axios.delete.mockRejectedValue(errorResponse);

    await expect(deleteLike(idUser, idPost, token)).rejects.toThrow("Malformed JWT! Please login again.");
  });

  test('should throw error if like not found', async () => {
    const errorResponse = {
      response: {
        data: {
          error: "Like not found, check id's"
        },
        status: 404 
      }
    };

    axios.delete.mockRejectedValue(errorResponse);

    await expect(deleteLike(idUser, idPost, token)).rejects.toThrow("Like not found, check id's");
  });

  test('should throw error if ID\'s are NaN', async () => {
    const errorResponse = {
      response: {
        data: {
          error: "ID's must be an integer"
        },
        status: 400
      }
    };

    axios.delete.mockRejectedValue(errorResponse);

    await expect(deleteLike("NaN", "NaN", token)).rejects.toThrow("ID's must be an integer");
  });

  test('should throw error if not enough fields', async () => {
    const errorResponse = {
      response: {
        data: {
          error: "Bad request! Must provide idUser and idPost"
        },
        status: 400
      }
    };

    axios.delete.mockRejectedValue(errorResponse);

    await expect(deleteLike(undefined, undefined, token)).rejects.toThrow("Bad request! Must provide idUser and idPost");
  });
});

describe('Integration Test for addLike', () => {
  afterEach(() => {
    jest.clearAllMocks(); 
  });

  const idUser = 2;
  const idPost = 5;

  test('should return success message if like was added successfully', async () => {
    const mockResponse = {
      data: "Like created successfuly",
      status: 200 
    };

    axios.post.mockResolvedValue(mockResponse);

    const data = await addLike(idUser, idPost, token);
    expect(data).toEqual(mockResponse.data);
  });

  test('should throw error if like is already in the database', async () => {
    const errorResponse = {
      response: {
        data: {
          success: false,
          msg: "Like is already in the database"
        },
        status: 400 
      }
    };

    axios.post.mockRejectedValue(errorResponse);

    await expect(addLike(idUser, idPost, token)).rejects.toThrow("Like is already in the database");
  });

  test('should throw error if ID\'s must be an integer', async () => {
    const errorResponse = {
      response: {
        data: {
          error: "ID's must be an intenger"
        },
        status: 400 
      }
    };

    axios.post.mockRejectedValue(errorResponse);

    await expect(addLike("NaN", "NaN", token)).rejects.toThrow("ID's must be an intenger");
  });

  test('should throw error if user does not exist', async () => {
    const errorResponse = {
      response: {
        data: {
          success: false,
          msg: "User not exists"
        },
        status: 404 
      }
    };

    axios.post.mockRejectedValue(errorResponse);

    await expect(addLike(idUser, idPost, token)).rejects.toThrow("User not exists");
  });

  test('should throw error if post does not exist', async () => {
    const errorResponse = {
      response: {
        data: {
          success: false,
          msg: "Post not exists"
        },
        status: 404 
      }
    };

    axios.post.mockRejectedValue(errorResponse);

    await expect(addLike(idUser, idPost, token)).rejects.toThrow("Post not exists");
  });
});