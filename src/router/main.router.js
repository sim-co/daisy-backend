import { Router } from "express";
import { verifyToken } from "../middleware/verifyToken";
import { generateCourse, addLocation, deleteCourse } from '../controller/main.controller';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: main
 *   description: 메인화면
*/

/**
 * @swagger
 *
 * /main/add-course:
 *   post:
 *     summary: "데이트코스 추가"
 *     description: "데이트 코스를 추가한다."
 *     tags: [main]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               courseName:
 *                 type: string
 *               course:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     shopName:
 *                       type: string
 *                     order:
 *                       type: integer
 *                     coordinateX:
 *                       type: integer
 *                     coordinateY:
 *                       type: integer
 *             example:
 *               courseName: "My Course"
 *               course:
 *               - shopName: "Shop 1"
 *                 order: 1
 *                 coordinateX: 10
 *                 coordinateY: 20
 *               - shopName: "Shop 2"
 *                 order: 2
 *                 coordinateX: 30
 *                 coordinateY: 40
 *     responses:
 *       200:
 *         description: OK
 */
router.post('/add-course', verifyToken, generateCourse);


router.post('/add-location', verifyToken, addLocation);


// router.patch('/patch-course', verifyToken, )


router.delete('/del-course/:myId/:courseId', verifyToken, deleteCourse);

export default router;