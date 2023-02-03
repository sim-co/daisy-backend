import { JsonWebTokenError, verify, decode } from "jsonwebtoken";
import User from '../../schemas/users';
import APIError from "../util/apiError";
import errors from "../util/errors";
import { generateAccessToken, verifyTK } from "../util/jwt";

export async function reissueTK(token) {
    console.log("재발급 진행")
    const { userid } = decode(token, process.env.JWT_SECRET);
    console.log("userid", userid);
    let resfreshTK, accessToken;
    try {
        await User.findById(userid).then((user) => {
            console.log(user);
            resfreshTK = user.refreshToken;
            const myRefreshTK = verifyTK(resfreshTK);
            if (myRefreshTK === "jwt expired") {
                //다시 로그인 하셈
                throw new APIError(
                    errors.PLEASE_LOGIN_AGAIN.statusCode,
                    errors.PLEASE_LOGIN_AGAIN.errorCode,
                    errors.PLEASE_LOGIN_AGAIN.errorMsg
                );
            }
            console.log("재발급 진행중");
            // console.log(generateAccessToken(userid) === token);
            accessToken = generateAccessToken(userid);
            // console.log(accessToken);

            //토큰이 너무 길어서인지 리턴보내면 undefine값으로 뜹니다.
            return accessToken
        })
    } catch (error) {
        console.log(error)
    }
    
}
