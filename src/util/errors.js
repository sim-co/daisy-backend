const errors = {
  VALIDATION_ERROR: {
    errorCode: "VALIDATION_ERROR",
    statusCode: 400,
  },

  CLIENT_NOT_EXISTS: {
    errorCode: "CLIENT_NOT_EXISTS",
    statusCode: 404,
    errorMsg: "존재하지 않는 유저입니다.",
  },

  INVALID_ERROR: {
    errorCode: "INVALID_ERROR",
    statusCode: 400,
    errorMsg: "INVALID ERROR",
  },
  
  TOKEN_EXPIRED: {
    errorCode: "TOKEN_EXPIRED",
    statusCode: 401,
    errorMsg: "만료된 토큰입니다"
  },

  INVALID_TOKEN: {
    errorCode: "INVALID_TOKEN",
    statusCode: 401,
    errorMsg: "유효하지 않은 토큰입니다"
  },
  TOKEN_ERROR_UNDEFINED: {
    errorCode: "TOKEN_ERROR_UNDEFINED",
    statusCode: 404,
    errorMsg: "Authorization is not provided"
  },
  TOKEN_NOT_BEARER: {
    errorCode: "TOKEN_NOT_BEARER",
    statusCode: 401,
    errorMsg: "Authorization is not Bearer"
  }

  // 여기서 에러 정보를 기록하시고 사용하시면 됩니다.
};

export default errors;
