import { JsonWebTokenError, verify } from "jsonwebtoken";
import User from "../../models/User";
import APIError from "../util/apiError";
import asyncWrapper from "../util/asyncWrapper";
import errors from "../util/errors";

export function verifyToken(req, res, next) {
  const origin = async (req, res, next) => {
    try {
      if (req.headers.authorization === undefined) {
        throw new JsonWebTokenError("Authorization is not provided")
      }

      if (!req.headers.authorization.startsWith("Bearer ")) {
        throw new JsonWebTokenError("Authorization is not Bearer")
      }

      const token = req.headers.authorization.split("Bearer ")[1]

      //위변조, 만료되지 않은경우 토큰값을 디코딩하여 저장?
      const { userid } = verify(token, process.env.JWT_SECRET);
      console.log(userid)

      const user = (await User.findByPk(userid)).dataValues;
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
