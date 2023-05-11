import APIError from "../util/apiError";
import errors from "../util/errors";
import querystring from "querystring";
import { generateAccessToken, generateRefreshToken } from "../util/jwt";
import User from "../../schemas/users";
import { body } from "express-validator";

/**
 * access, refresh 토큰을 query에 담은 뒤 query값을 리턴
 * @param {String} userId
 */
const generateQueryService = (userId) => {
    const accessToken = generateAccessToken(userId);
    console.log(accessToken);
    const refreshToken = generateRefreshToken(userId);
    const query = querystring.stringify({
        access: accessToken,
        refresh: refreshToken,
        });
        return query
}

/**
 * loginLog를 확인해서 
 * @param {String} id 
 * @param {String} nickName 
 * @param {String} gender 
 * @param {String} local 
 * @param {String} birthDay 
 */
const loginLogAddData = async ({ userId, nickName, gender, local, birthDay }) => {
    try {
        const user = await User.findOneAndUpdate({_id: userId, loginLog: false}, {
          nickName: nickName,
          gender: gender,
          local: local,
          birthDay: birthDay,
          loginLog: true,
        }, {new: true});
        
        if (!user) {
          throw new APIError(
            errors.CLIENT_NOT_EXISTS.statusCode,
            errors.CLIENT_NOT_EXISTS.errorCode,
            errors.CLIENT_NOT_EXISTS.errorMsg
          );
        }
        return user;

      } 
      catch (error) {
        //사용자 정보를 업데이트하는 과정에서 오류가 발생했습니다.
        throw new APIError(
          errors.CANT_UPDATE_USER_INFORMATION.statusCode,
          errors.CANT_UPDATE_USER_INFORMATION.errorCode,
          errors.CANT_UPDATE_USER_INFORMATION.errorMsg
        );
      }
}

const userUdpate = async (myId, body) => {
  const { nickName, gender, local, birthDay } = body;
  const updatedUser = await User.findByIdAndUpdate(myId, {
    nickName,
    gender,
    local,
    birthDay
  })
  return updatedUser;
}
export default {
    generateQueryService,
    loginLogAddData,
    userUdpate
}