import { decode } from "jsonwebtoken";
import User from '../../schemas/users';
import APIError from "../util/apiError";
import errors from "../util/errors";
import { generateAccessToken, verifyTK } from "../util/jwt";

export async function reissueTK(token) {
    let userid, type;

    try {
        const { userid: parsedUserId, type: parsedType } = decode(token, process.env.JWT_SECRET);
        userid = parsedUserId;
        type = parsedType;

        if (type !== "refresh") {
            throw "Invalid RefreshToken";
        }
    } catch {
        throw new APIError(errors.INVALID_TOKEN.statusCode, errors.INVALID_TOKEN.errorCode, errors.INVALID_TOKEN.errorMsg);
    }

    const user = await User.findById(userid)

    const resfreshTK = user.refreshToken;
    const verifyResult = verifyTK(resfreshTK);

    if (verifyResult === "jwt expired") {
        throw new APIError(
            errors.TOKEN_EXPIRED.statusCode,
            errors.TOKEN_EXPIRED.errorCode,
            errors.TOKEN_EXPIRED.errorMsg
        );
    }

    const accessToken = generateAccessToken(userid);

    return accessToken

}
