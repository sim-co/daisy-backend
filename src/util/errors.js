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
};

export default errors;
