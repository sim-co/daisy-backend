import jwt from "jsonwebtoken"

/**
 * 
 * @param {String} userid 
 */
export const generateAccessToken = (userid) => {
    // console.log(process.env.JWT_SECRET);
    const accessToken = jwt.sign({
        userid,
        type: "access"
    }, process.env.JWT_SECRET, {
        "expiresIn": process.env.JWT_ACCESS_TOKEN_EXPIRE
    })

    return accessToken
}

/**
 * @param {String} userid
 */
export const generateRefreshToken = (userid) => {
    const refreshToken = jwt.sign({
        userid,
        type: "refresh"
    }, process.env.JWT_SECRET, {
        "expiresIn": process.env.JWT_REFRESH_TOKEN_EXPIRE
    })

    return refreshToken
}

export const verifyTokenExpires = (token) => {
    payload = jwt.verify(token, process.env.JWT_SECRET)

    return payload
}

export function verifyTK(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error){
      return error.message;
    }
  }