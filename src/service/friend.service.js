import APIError from "../util/apiError";
import errors from "../util/errors";
import User from "../../schemas/users";

/**
 * 친구 코드 생성 - 서비스
 * @param {Stirng} myId
 */
const generateFriendCode =  async (myId) => {
    const friendCode = Math.random().toString(36).substring(2, 13).toUpperCase();
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

/**
 * 친구 코드 연결 - 서비스
 */
const connectCode = async ({myId, friendConnectionCode}) => {
    try {
        const friend_db = await User.findOne({my_connection_id : friendConnectionCode});

        // if (checkConnection) {
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

/**
 * 친구 코드 끊기 - 서비스
 */
const disconnectFriendCode = async (myId) => {
    
    await checkConnection(myId);
    const myInformation = await User.findByIdAndUpdate(myId, {
        connection : false,
        connection_id : null
    });
    await User.updateOne(
        { connection_id:myInformation.my_connection_id }, 
        { $set: { 
            connection : false, 
            connection_id : null
        } 
    });
    return myInformation ;
}

/**
 * 친구연결 확인 - 서비스
 */
const checkConnection = async (myId) => {
    try {
        const myInformation = await User.findById(myId);
        return myInformation.connection;
    } catch(error) {
        throw new APIError(
            errors.FRIEND_ALREADY_DISCONNECTED.statusCode,
            errors.FRIEND_ALREADY_DISCONNECTED.errorCode,
            errors.FRIEND_ALREADY_DISCONNECTED.errorMsg,
        )
    }
}

/**
 * 친구코드 확인 - 서비스
 */
const showMyFriendCode = async (myId) => {
    await checkConnection(myId);
    const myInformation = await User.findById(myId);
    const friendInfo = await User.findOne({connection_id:myInformation.my_connection_id})
    return friendInfo.nickName;
}

export default {
    generateFriendCode,
    connectCode,
    disconnectFriendCode,
    showMyFriendCode
}