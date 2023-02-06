import { Router } from "express";
import { verifyToken, verifyTokenExpires } from "../middleware/verifyToken";
import User from "../../schemas/users";
const router = Router();

router.post('/', verifyToken, async (req, res) => {
    const { token } = req.headers;
    const friendId = req.body.friendId

    payload = verifyTokenExpires(token);
    try {
        await User.findByIdAndUpdate(payload, {
            connection : true,
            connection_id : friendId
        });
        await User.findByIdAndUpdate(friendId, {
            connection : true,
            connection_id : payload
        });
    } catch(error) {
        //사용자 정보를 업데이트하는 과정에서 오류가 발생했습니다. 
        throw new APIError(
           errors.CANT_UPDATE_USER_INFORMATION.statusCode,
           errors.CANT_UPDATE_USER_INFORMATION.errorCode,
           errors.CANT_UPDATE_USER_INFORMATION.errorMsg
        )
    }
    
});

export default router;