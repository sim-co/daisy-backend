import { Router } from "express";
import { verifyToken } from "../middleware/verifyToken";
import User from "../../schemas/users";
import APIError from "../util/apiError";
import errors from "../util/errors";
import asyncWrapper from "../util/asyncWrapper";
import { body } from "express-validator";
import validation from "../middleware/validation";

const router = Router();

// 친구코드 생성
function generateFriendCode(id) {
    // id 값을 기반으로 랜덤 문자열 생성
    const randomString = Math.random().toString(36).substring(2, 10).toUpperCase();
    return randomString;
}

/**
 * @swagger
 *
 * /friend-connect/my-id:
 *  post:
 *    summary: "친구코드 생성"
 *    description: "본인의 친구코드를 생성해준다."
 *    tags: [friend-connect]
 *    responses:
 *       "200":
 *          description: 추가된 데이터를 DB에 저장합니다.
 *          content:
 *             application/json:
 *                example:
 *                   my_connection_id: "ABC1234AB"
 * 
 */
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

/**
 * @swagger
 *
 * /friend-connect:
 *  post:
 *    summary: "친구코드 연결"
 *    description: "상대의 친구코드를 이용하여 친구 연결을 진행할 수 있다. (친구코드가 없을 시 오류)"
 *    tags: [friend-connect]
 *    requestBody:
 *       required: true
 *       content:
 *          application/json:
 *             schema:
 *                type: object
 *                properties:
 *                   friendConnectionCode:
 *                      type: string
 *    responses:
 *       "200":
 *          description: 추가된 데이터를 DB에 나눠 저장합니다. (친구코드를 등록한사람, 친구에 의해 친구코드가 등록된 사람)
 *          content:
 *             application/json:
 *                example:
 *                   connection: true
 *                   connection_id: "ABCAB123AC"
 * 
 */
router.post('/', verifyToken, body("friendConnectionCode").exists(), validation, asyncWrapper( async (req, res) => {
    const friendConnectionCode = req.body.friendConnectionCode;
    const myId = res.app.user.id;

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
        console.log(friend_db);
        res.send('끝');
    } catch(error) {
        throw new APIError(
           errors.FRIEND_CODE_ERROR.statusCode,
           errors.FRIEND_CODE_ERROR.errorCode,
           errors.FRIEND_CODE_ERROR.errorMsg
        )
    }}
));

export default router;