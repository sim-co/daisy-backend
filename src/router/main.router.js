import { Router } from "express";
import { verifyToken } from "../middleware/verifyToken";
import { generateCourse, addLocation, deleteCourse } from '../controller/main.controller';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: 데이트 코스
 *   description: 메인화면
*/
router.post('/add-course', verifyToken, generateCourse);


router.post('/add-location', verifyToken, addLocation);


// router.patch('/patch-course', verifyToken, )


router.delete('/del-course/:myId/:courseId', verifyToken, deleteCourse);

export default router;