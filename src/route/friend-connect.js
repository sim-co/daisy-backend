import { Router } from "express";
import { verifyToken } from "../middleware/verifyToken";
import User from "../../schemas/users";
import APIError from "../util/apiError";
import errors from "../util/errors";
import asyncWrapper from "../util/asyncWrapper";

const router = Router();

// 친구코드 생성
function generateFriendCode(id) {
    // id 값을 기반으로 랜덤 문자열 생성
    const randomString = Math.random().toString(36).substring(2, 10).toUpperCase();
    return randomString;
}

router.post('/my-id', verifyToken, asyncWrapper( async (req, res) => {
    const myId = res.app.user.id; 
    const friendCode = generateFriendCode(myId);

    try {
        await User.findByIdAndUpdate(myId, {
            my_connection_id : friendCode
        });
        res.send("친구코드 생성이 완료되었습니다.");

    } catch(error) {
        throw new APIError(
           errors.FRIEND_CODE_CREATE_ERROR.statusCode,
           errors.FRIEND_CODE_CREATE_ERROR.errorCode,
           errors.FRIEND_CODE_CREATE_ERROR.errorMsg
        )
    }}
));


router.post('/', verifyToken, asyncWrapper( async (req, res) => {
    const friendConnectionCode = req.body.friendConnectionCode;
    const myId = res.app.user.id;

    try {
        const friend_db = await User.findOne({my_connection_id : friendConnectionCode});

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
        
        console.log(friend_db);
    } catch(error) {
        throw new APIError(
           errors.FRIEND_CODE_ERROR.statusCode,
           errors.FRIEND_CODE_ERROR.errorCode,
           errors.FRIEND_CODE_ERROR.errorMsg
        )
    }}
));

export default router;