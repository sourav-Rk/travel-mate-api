export enum HTTP_STATUS {
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
}

export const SUCCESS_MESSAGES = {
  DETAILS_FETCHED: "Details fetched successfully",
  AUTHENTICATION: {
    REGISTER_SUCCESS: "User registered successfully",
    LOGIN_SUCCESS: "Login successful",
    TOKEN_REFRESHED: "Token refreshed successfully",
    LOGOUT_SUCCESS: "Logged out successfully",
  },
  POSTS: {
    CREATED_SUCCESSFULLY: "Post created successfully",
    POST_UPDATED: "Post updated successfully",
    POST_DELETED: "Post deleted successfully",
  },
};

export const ERROR_MESSAGES = {
  AUTHENTICATION: {
    EMAIL_ALREADY_EXISTS: "User with this email already exists",
    EMAIL_NOT_EXIST: "Email doesnt exist",
    UNAUTHORIZED: "Unauthorized",
    PASSWORD_INCORRECT: "Incorrect password",
    USER_NOT_FOUND: "User not found",
    TOKEN_REQUIRED: "Token is required",
    ACCESS_TOKEN_EXPIRED: "Access token expired",
    REFRESH_TOKEN_EXPIRED: "Refresh token expired. Please login again",
    INVALID_TOKEN: "Invalid token",
    INVALID_REFRESH_TOKEN: "Invalid refresh token",
    NO_TOKEN_PROVIDED: "Access denied. No token provided",
  },
  POSTS: {
    IMAGE_REQUIRED: "Image is required",
    FAILED_TO_CREATE_POST: "Failed to create post",
    POST_NOT_FOUND: "Post not found",
    NOT_AUTHORIZED_TO_UPDATE_POST: "You are not authorized to update this post",
    NOT_AUTHORIZED_TO_DELETE_POST: "You are not authorized to delete this post",
    FAILED_TO_UPDATE_POST: "Failed to update post",
  },
  MEDIA:{
    IVALID_FILE_TYPE :"Invalid file type. Allowed types: JPEG, PNG, GIF, WebP",
    EXCEED_LIMIT:"File size exceeds 5MB limit",
    FAILED_TO_UPLOAD_IMAGE:"Failed to upload image"
  }
};
