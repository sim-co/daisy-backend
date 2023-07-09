import { JsonWebTokenError, verify, decode } from "jsonwebtoken";
import User from '../../schemas/users';
import APIError from "../util/apiError";
import asyncWrapper from "../util/asyncWrapper";
import errors from "../util/errors";
import { reissueTK } from "../util/reissueTK";
import { verifyTK } from "../util/jwt";

export function verifyToken(req, res, next) {
  const origin = async (req, res, next) => {
    if (req.headers.authorization === undefined) {
      throw new JsonWebTokenError("Authorization is not provided")
    }
    if (!req.headers.authorization.startsWith("Bearer ")) {
      throw new JsonWebTokenError("Authorization is not Bearer")
    }
    let token = req.headers.authorization.split("Bearer ")[1]
    // console.log(token)
    try{
      const myToken = verifyTK(token);
      if (myToken === "jwt expired") {
        // access토큰 만료시 재발급
        await reissueTK(token);
        console.log("토큰 재발급 완료!");
      } else {
        const user = await User.findById(myToken.userid);
        res.app.user = user;
        console.log(res.app.user);
      }
      // 이부분이 문제, 만약 엑세스 토큰을 재발급된 했을 경우 프론트에 이 재발급된 토큰을 어떻게 전달할지?
      return next();
    } catch(error) {
      console.log(error);
      if (error.name === "TokenExpiredError") {
        // 유효기간 초과
        throw new APIError(
          errors.TOKEN_EXPIRED.statusCode,
          errors.TOKEN_EXPIRED.errorCode,
          errors.TOKEN_EXPIRED.errorMsg
        );
      }
      if (error.name === "JsonWebTokenError") {
        // 잘못된 토큰
        throw new APIError(
          errors.TOKEN_EXPIRED.statusCode,
          errors.TOKEN_EXPIRED.errorCode,
          errors.TOKEN_EXPIRED.errorMsg
        );
      }
    }
  };
  asyncWrapper(origin)(req, res, next);
}


// import { JsonWebTokenError, verify } from "jsonwebtoken";
// import User from '../../schemas/users';
// import APIError from "../util/apiError";
// import asyncWrapper from "../util/asyncWrapper";
// import errors from "../util/errors";

// export function verifyToken(req, res, next) {
//   const origin = async (req, res, next) => {
//     try {
//       if (req.headers.authorization === undefined) {
//         throw new JsonWebTokenError("Authorization is not provided")
//       }

//       if (!req.headers.authorization.startsWith("Bearer ")) {
//         throw new JsonWebTokenError("Authorization is not Bearer")
//       }

//       const token = req.headers.authorization.split("Bearer ")[1]

//       //위변조, 만료되지 않은경우 토큰값을 디코딩하여 저장?
//       const { userid } = verify(token, process.env.JWT_SECRET);
//       console.log(userid)

//       // const user = (await User.findByPk(userid)).dataValues;
//       const user = await User.findById(userid);
//       console.log(user)

//       res.app.user = user;
//       return next();
//     } catch (error) {
//       //헤더 혹은 페이로드가 위변조 되었는지, 토큰의 유효기간이 초과되었는지 확인
//       if (error.name === "TokenExpiredError") {
//         // 유효기간 초과
//         throw new APIError(
//           errors.TOKEN_EXPIRED.statusCode,
//           errors.TOKEN_EXPIRED.errorCode,
//           errors.TOKEN_EXPIRED.errorMsg
//         );
//       } else if (error.name === "JsonWebTokenError") {
//         throw new APIError(
//           errors.INVALID_TOKEN.statusCode,
//           errors.INVALID_TOKEN.errorCode,
//           errors.INVALID_TOKEN.errorMsg
//         );
//       }
//     }
//   };

//   asyncWrapper(origin)(req, res, next);
// }

export default verifyToken
