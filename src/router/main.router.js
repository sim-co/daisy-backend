import { Router } from "express";
import { verifyToken } from "../middleware/verifyToken";
import { generateCourse } from '../controller/main.controller';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: main
 *   description: 메인화면
*/
router.post('/add-course', verifyToken, generateCourse)

// router.post('/add-course',verifyToken,asyncWrapper( async(req, res) => {
//     const userInfo = await User.findById(res.app.user.id);
//     //데이트 코스 추가하는 로직은 추후에 개발 예정
//     //나중에 데이트 코스 개수 제한을 걸어서 유료화로 가져가는 것도 나쁘지 않을듯 합니다.
//     let course = ['김밥나라','구르는 파스타'];
//     let courseUserList = [];
//     courseUserList.push(userInfo.id);
//     try { //친구 동기화
//         if (userInfo.connection === true) {
//             const friendInfo = await User.findOne({ my_connection_id: userInfo.connection_id})
//             courseUserList.push(friendInfo.id);
//         }
//         await Course.create({ users: courseUserList,course: course });
//     } catch(e) {
//         throw e;
//     }
//     res.send("코스 추가 완료");
// }))

export default router;