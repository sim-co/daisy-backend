import { verify } from "jsonwebtoken";
import User from "../../models/User";
import APIError from "../util/apiError";
import asyncWrapper from "../util/asyncWrapper";
import errors from "../util/errors";

// 이 미들웨어를 지나게 되는 경우 request시 Bearer Auth에 토큰 정보를 반드시 담고 있어야 합니다.

export function verifyToken(req, res, next) {
  const origin = async (req, res, next) => {
    try {

      // 토큰이 담겨있지 않은 상태로 요청될 경우
      if (req.headers.authorization === undefined) {
        throw new APIError(
          errors.TOKEN_ERROR_UNDEFINED.statusCode,
          errors.TOKEN_ERROR_UNDEFINED.errorCode,
          errors.TOKEN_ERROR_UNDEFINED.errorMsg
        )
      }
      // 이건 모르겠어요 원호가 짰는데 한번 물어봐야 할듯
      if (!req.headers.authorization.startsWith("Bearer ")) {
        throw new APIError(
          errors.TOKEN_NOT_BEARER.statusCode,
          errors.TOKEN_NOT_BEARER.errorCode,
          errors.TOKEN_NOT_BEARER.errorMsg
        )
      }
      const token = req.headers.authorization.split("Bearer ")[1]

      // 이렇게 할경우 문제점 1. provider(간편 로그인 가입 사이트)를 구분하지 못함.
      const { userid } = verify(token, process.env.JWT_SECRET);
      console.log("유저 아이디:",userid.trim())

      const user =  await User.findOne({
        where: { snsId: userid },
     });

      console.log(user)

      res.app.user = user;
      return next();
    } catch (error) {
      console.log(error);
      //헤더 혹은 페이로드가 위변조 되었는지, 토큰의 유효기간이 초과되었는지 확인
      if (error.name === "TokenExpiredError") {
        // 유효기간 초과
        throw new APIError(
          errors.TOKEN_EXPIRED.statusCode,
          errors.TOKEN_EXPIRED.errorCode,
          errors.TOKEN_EXPIRED.errorMsg
        );
      } else if (error.name === "JsonWebTokenError") {
        throw new APIError(
          errors.INVALID_TOKEN.statusCode,
          errors.INVALID_TOKEN.errorCode,
          errors.INVALID_TOKEN.errorMsg
        );
      }
    }
  };

  asyncWrapper(origin)(req, res, next);
}

export default verifyToken;
