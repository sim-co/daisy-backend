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
  // 여기서 에러 정보를 기록하시고 사용하시면 됩니다.

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

  CANT_UPDATE_USER_INFORMATION: {
    errorCode: "CANT_UPDATE_USER_INFORMATION",
    statusCode: 401,
    errorMsg: "사용자 정보를 업데이트하는 과정에서 오류가 발생했습니다. "
  },

  PLEASE_LOGIN_AGAIN: {
    errorCode: "PLEASE_LOGIN_AGAIN",
    statusCode: 400,
    errorMsg: "다시 로그인 해주세요"
  },
  FRIEND_CODE_ERROR: {
    errorCode: "FRIEND_CODE_ERROR",
    statusCode: 400,
    errorMsg: "DB내 대응되는 친구코드를 찾을 수 없거나 ID가 일치하지않습니다."
  },
  FRIEND_CODE_CREATE_ERROR: {
    errorCode: "FRIEND_CODE_CREATE_ERROR",
    statusCode: 400,
    errorMsg: "DB내 ID를 찾을 수 없거나 틀렸습니다."
  }
};

export default errors;
