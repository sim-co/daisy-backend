import APIError from "../util/apiError";
import errors from "../util/errors";
import querystring from "querystring";
import { generateAccessToken, generateRefreshToken } from "../util/jwt";
import User from "../../schemas/users";
import { body } from "express-validator";
import AWS from "aws-sdk";
import dotenv from "dotenv";

dotenv.config();

/**
 * access, refresh 토큰을 query에 담은 뒤 query값을 리턴
 * @param {String} userId
 */
const generateQueryService = (userId) => {
    const accessToken = generateAccessToken(userId);
    const refreshToken = generateRefreshToken(userId);
    const query = querystring.stringify({
        access: accessToken,
        refresh: refreshToken,
        });
        return query
}

/**
 * loginLog를 확인해서 False인 유저들은 add data 진행 - 서비스
 * @param {String} id 
 * @param {String} nickName 
 * @param {String} gender 
 * @param {String} local 
 * @param {String} birthDay 
 */
const loginLogAddData = async ({ userId, nickName, gender, local, birthDay, imgName }) => {
    try {
        const user = await User.findOneAndUpdate({_id: userId, loginLog: false}, {
          nickName: nickName,
          gender: gender,
          local: local,
          birthDay: birthDay,
          loginLog: true,
          imgName: imgName
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

/**
 * 유저 업데이트 - 서비스
 */
const userUdpate = async (myId, body) => {
  try {
    const { nickName, gender, local, birthDay, imgName } = body;
    const updatedUser = await User.findByIdAndUpdate(myId, {
      nickName,
      gender,
      local,
      birthDay,
      imgName
    })
  } catch (error) {
    throw new APIError(
      errors.CANT_UPDATE_USER_INFORMATION.statusCode,
      errors.CANT_UPDATE_USER_INFORMATION.errorCode,
      errors.CANT_UPDATE_USER_INFORMATION.errorMsg
    )
  }
  return updatedUser;
}

/**
 * 유저 보여주기 - 서비스
 */
const showData = async (myId) => {
  const myData = await User.findById(myId);
  if(!myData) {
    throw new APIError(
      errors.CLIENT_NOT_EXISTS.statusCode,
      errors.CLIENT_NOT_EXISTS.errorCode,
      errors.CLIENT_NOT_EXISTS.errorMsg,
    )
  }
  return myData;
}

/**
 * 친구 보여주기 - 서비스
 */
const showFriendData = async (friendCode) => {
  try {
    const friendInfo = await User.findOne({my_connection_id: friendCode});
    return friendInfo;
  } catch(error) {
    throw new APIError(
      errors.CLIENT_NOT_EXISTS.statusCode,
      errors.CLIENT_NOT_EXISTS.errorCode,
      errors.CLIENT_NOT_EXISTS.errorMsg,
    )
  }
}

/**
 * 계정탈퇴 - 서비스
 */
const deactivateUserInfo = async (myId) => {
  try {
    const datadel = await User.deleteOne({ _id: myId });
    console.log(datadel);
    return datadel;
  } catch (error) {
    console.error(error);
  }
}

/**
 * 이미지 업로드 - 서비스
 */
const uploadProfileCode = async () => {
  const s3 = new AWS.S3({
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    region: process.env.S3_REGION
  });
  const filename = Date.now() + '-' + Math.random().toString(36).substring(2, 7).toUpperCase();
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: filename,
    Expires: 60*60*3,
  };

  try {
    return {
      "url" : await s3.getSignedUrlPromise("putObject", params),
      "filename" : filename
    };
  } catch(error) {
    console.log(error);
    throw new APIError(
      errors.FILE_UPLOAD_ERROR.statusCode,
      errors.FILE_UPLOAD_ERROR.errorCode,
      errors.FILE_UPLOAD_ERROR.errorMsg
    )
  } 
}

/**
 * 이미지 다운로드 - 서비스
 */
const downloadProfileCode = async (filename) => {
  const s3 = new AWS.S3({
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    region: process.env.S3_REGION
  });

  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: filename,
    Expires: 60*60*3,
  };
  
  try {
    const url = await s3.getSignedUrlPromise("getObject", params);
    return url
  } catch(error) {
    console.log(error);
    throw new APIError(
      errors.FILE_DOWNLOAD_ERROR.statusCode,
      errors.FILE_DOWNLOAD_ERROR.errorCode,
      errors.FILE_DOWNLOAD_ERROR.errorMsg
    )
  } 
}

export default {
    generateQueryService,
    loginLogAddData,
    userUdpate,
    showData,
    showFriendData,
    deactivateUserInfo,
    uploadProfileCode,
    downloadProfileCode
}