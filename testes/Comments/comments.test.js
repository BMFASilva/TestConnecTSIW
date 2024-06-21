const axios = require('axios');
const { deleteCommentById, likeComment, getCommentLikes, unlikeComment } = require('./comments');
const { token } = require('../config'); 

jest.mock('axios');

describe('Integration Test for deleteCommentById', () => {
  test('should return success message if deletion was successful', async () => {
    const mockResponse = {
      data: "Comment deleted successfully",
      status: 200
    };

    axios.delete.mockResolvedValue(mockResponse);

    const id_comment = 1;

    const data = await deleteCommentById(id_comment, token);
    expect(data).toEqual(mockResponse.data);
  });

  test('should throw an error for invalid comment ID', async () => {
    axios.delete.mockRejectedValue(new Error('error'));

    const id_comment = 999;

    await expect(deleteCommentById(id_comment, token)).rejects.toThrow('Error deleting comment');
  });

  test('should return an error if comment ID is NaN', async () => {
    const mockError = {
      response: {
        data: { error: "Comment ID must be an integer" },
        status: 400
      }
    };

    axios.delete.mockRejectedValue(mockError);

    const id_comment = 'NaN';

    await expect(deleteCommentById(id_comment, token)).rejects.toThrow('Error deleting comment');
  });

  test('should return an error for malformed JWT', async () => {
    const mockError = {
      response: {
        data: { success: false, msg: "Malformed JWT! Please login again." },
        status: 401
      }
    };

    axios.delete.mockRejectedValue(mockError);

    const id_comment = 1;
    const malformedToken = 'malformed.token.here';

    await expect(deleteCommentById(id_comment, malformedToken)).rejects.toThrow('Error deleting comment');
  });

  test('should return an error for invalid token', async () => {
    const mockError = {
      response: {
        data: { success: false, msg: "Your token has expired! Please login again." },
        status: 403
      }
    };

    axios.delete.mockRejectedValue(mockError);

    const id_comment = 1;
    const invalidToken = 'invalid.token.here';

    await expect(deleteCommentById(id_comment, invalidToken)).rejects.toThrow('Error deleting comment');
  });
});

describe('Integration Test for likeComment', () => {
  test('should return success message if like was added successfully', async () => {
    const mockResponse = {
      data: "Like added successfully",
      status: 201
    };

    axios.post.mockResolvedValue(mockResponse);

    const idComment = 4;
    const idUser = 2;

    const data = await likeComment(idComment, idUser, token);
    expect(data).toEqual(mockResponse.data);
  });

  test('should throw an error for invalid comment ID', async () => {
    axios.post.mockRejectedValue(new Error('error'));

    const idComment = 999;
    const idUser = 2;

    await expect(likeComment(idComment, idUser, token)).rejects.toThrow('Error liking comment');
  });

  test('should throw an error for invalid user ID', async () => {
    axios.post.mockRejectedValue(new Error('error'));

    const idComment = 4;
    const idUser = 999;

    await expect(likeComment(idComment, idUser, token)).rejects.toThrow('Error liking comment');
  });

  test('should return an error if IDs are NaN', async () => {
    const mockError = {
      response: {
        data: { error: "ID's must be an integer" },
        status: 400
      }
    };

    axios.post.mockRejectedValue(mockError);

    const idComment = 'NaN';
    const idUser = 'NaN';

    await expect(likeComment(idComment, idUser, token)).rejects.toThrow('Error liking comment');
  });

  test('should return an error if like is repeated', async () => {
    const mockError = {
      response: {
        data: { success: false, msg: "like is already in the database" },
        status: 409
      }
    };

    axios.post.mockRejectedValue(mockError);

    const idComment = 1;
    const idUser = 1;

    await expect(likeComment(idComment, idUser, token)).rejects.toThrow('Error liking comment');
  });

  test('should return an error if comment not found', async () => {
    const mockError = {
      response: {
        data: { success: false, msg: "Comment not exists" },
        status: 404
      }
    };

    axios.post.mockRejectedValue(mockError);

    const idComment = 999;
    const idUser = 1;

    await expect(likeComment(idComment, idUser, token)).rejects.toThrow('Error liking comment');
  });

  test('should return an error for malformed JWT', async () => {
    const mockError = {
      response: {
        data: { success: false, msg: "Malformed JWT! Please login again." },
        status: 401
      }
    };

    axios.post.mockRejectedValue(mockError);

    const idComment = 1;
    const idUser = 1;
    const malformedToken = 'malformed.token.here';

    await expect(likeComment(idComment, idUser, malformedToken)).rejects.toThrow('Error liking comment');
  });

  test('should return an error for invalid token', async () => {
    const mockError = {
      response: {
        data: { success: false, msg: "Your token has expired! Please login again." },
        status: 403
      }
    };

    axios.post.mockRejectedValue(mockError);

    const idComment = 1;
    const idUser = 1;
    const invalidToken = 'invalid.token.here';

    await expect(likeComment(idComment, idUser, invalidToken)).rejects.toThrow('Error liking comment');
  });
});

describe('Integration Test for getCommentLikes', () => {
  test('should return likes for a valid comment ID', async () => {
    const mockResponse = {
      data: [
        { id_user: 1, id_comment: 1 }
      ]
    };

    axios.get.mockResolvedValue(mockResponse);

    const idComment = 1;

    const data = await getCommentLikes(idComment, token);
    expect(data).toEqual(mockResponse.data);
  });

  test('should throw an error for invalid comment ID', async () => {
    axios.get.mockRejectedValue(new Error('error'));

    const idComment = 999;

    await expect(getCommentLikes(idComment, token)).rejects.toThrow('Error getting comment likes');
  });

  test('should return an error if comment ID is NaN', async () => {
    const mockError = {
      response: {
        data: { error: "Comment ID must be an integer" },
        status: 400
      }
    };

    axios.get.mockRejectedValue(mockError);

    const idComment = 'NaN';

    await expect(getCommentLikes(idComment, token)).rejects.toThrow('Error getting comment likes');
  });
});

describe('Integration Test for unlikeComment', () => {
  test('should return success message if unlike was successful', async () => {
    const mockResponse = {
      data: "Unlike successful",
      status: 200
    };

    axios.delete.mockResolvedValue(mockResponse);

    const idComment = 1;

    const data = await unlikeComment(idComment, token);
    expect(data).toEqual(mockResponse.data);
  });

  test('should throw an error for invalid comment ID', async () => {
    axios.delete.mockRejectedValue(new Error('error'));

    const idComment = 999;

    await expect(unlikeComment(idComment, token)).rejects.toThrow('Error unliking comment');
  });

  test('should return an error if IDs are NaN', async () => {
    const mockError = {
      response: {
        data: { error: "ID's must be an integer" },
        status: 400
      }
    };

    axios.delete.mockRejectedValue(mockError);

    const idComment = 'NaN';

    await expect(unlikeComment(idComment, token)).rejects.toThrow('Error unliking comment');
  });

  test('should return an error if not enough fields provided', async () => {
    const mockError = {
      response: {
        data: { error: "Bad request! Must provide idUser and idComment" },
        status: 400
      }
    };

    axios.delete.mockRejectedValue(mockError);

    const idComment = 1;

    await expect(unlikeComment(idComment, token)).rejects.toThrow('Error unliking comment');
  });

  test('should return an error if like not found', async () => {
    const mockError = {
      response: {
        data: { error: "Like not found, check id's" },
        status: 404
      }
    };

    axios.delete.mockRejectedValue(mockError);

    const idComment = 1;

    await expect(unlikeComment(idComment, token)).rejects.toThrow('Error unliking comment');
  });

  test('should return an error for malformed JWT', async () => {
    const mockError = {
      response: {
        data: { success: false, msg: "Malformed JWT! Please login again." },
        status: 401
      }
    };

    axios.delete.mockRejectedValue(mockError);

    const idComment = 1;
    const malformedToken = 'malformed.token.here';

    await expect(unlikeComment(idComment, malformedToken)).rejects.toThrow('Error unliking comment');
  });

  test('should return an error for invalid token', async () => {
    const mockError = {
      response: {
        data: { success: false, msg: "Your token has expired! Please login again." },
        status: 403
      }
    };

    axios.delete.mockRejectedValue(mockError);

    const idComment = 1;
    const invalidToken = 'invalid.token.here';

    await expect(unlikeComment(idComment, invalidToken)).rejects.toThrow('Error unliking comment');
  });
});