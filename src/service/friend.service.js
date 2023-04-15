import APIError from "../util/apiError";
import errors from "../util/errors";
import User from "../../schemas/users";

/**
 * 나의 친구코드를 만들어준다.
 * @param {Stirng} myId
 */
const generateFriendCode =  async (myId) => {
    const friendCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    try {
        const code = await User.findByIdAndUpdate(myId, {
            my_connection_id : friendCode
        });
        return friendCode
    } catch(error) {
        throw new APIError(
            errors.FRIEND_CODE_CREATE_ERROR.statusCode,
            errors.FRIEND_CODE_CREATE_ERROR.errorCode,
            errors.FRIEND_CODE_CREATE_ERROR.errorMsg
        )
    }
}

const connectCode = async ({myId, friendConnectionCode}) => {
    try {
        const friend_db = await User.findOne({my_connection_id : friendConnectionCode});
        // if (friend_db.connection == true) {
        //     throw new APIError(
        //         errors.FRIEND_ALREADY_ADDED.statusCode,
        //         errors.FRIEND_ALREADY_ADDED.errorCode,
        //         errors.FRIEND_ALREADY_ADDED.errorMsg,
        //     )
        // }

        if (friend_db == null) {
            throw new APIError(
                errors.FRIEND_CODE_ERROR.statusCode,
                errors.FRIEND_CODE_ERROR.errorCode,
                errors.FRIEND_CODE_ERROR.errorMsg
            )
        } 
  
        const my_db = await User.findByIdAndUpdate(myId, {
            connection : true,
            connection_id : friendConnectionCode
        });

        await User.findByIdAndUpdate(friend_db._id, {
            connection : true,
            connection_id : my_db.my_connection_id
        });
        return "친구 코드가 연결되었습니다."
    } catch(error) {
        throw new APIError(
           errors.FRIEND_CODE_ERROR.statusCode,
           errors.FRIEND_CODE_ERROR.errorCode,
           errors.FRIEND_CODE_ERROR.errorMsg
        )
    }
}

export default {
    generateFriendCode,
    connectCode
}