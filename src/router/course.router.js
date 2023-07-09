import { Router } from "express";
import { verifyToken } from "../middleware/verifyToken";
import { 
    generateCourse,
    addLocation,
    deleteCourse,
    modifyCourse,
    viewCourse, 
    searchLocation,
    getPlacesInLatLngRange,
    registLocation} from '../controller/course.controller';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: course
 *   description: 데이트 코스
*/

/**
 * @swagger
 *
 * /course/add-course:
 *   post:
 *     summary: "데이트코스 추가"
 *     description: "데이트 코스를 추가한다."
 *     tags: [course]
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

/**
 * @swagger
 *
 * /course/modify-course:
 *   patch:
 *     summary: "데이트코스 수정"
 *     description: "데이트 코스를 수정한다."
 *     tags: [course]
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
router.patch('/modify-course', verifyToken, modifyCourse);

/**
 * @swagger
 * /course/del-course/{courseId}:
 *   delete:
 *     summary: 데이트코스 삭제
 *     description: 해당 courseId (MongoDB ID)를 파라미터로 입력하여 데이트 코스를 삭제합니다.
 *     tags:
 *       - course
 *     parameters:
 *       - name: courseId
 *         in: path
 *         description: 삭제할 데이트 코스의 고유 ID (MongoDB ID)
 *         required: true
 */ 
router.delete('/del-course/:courseId', verifyToken, deleteCourse);

/**
 * @swagger
 *
 * /course/view-course:
 *   post:
 *     summary: "데이트코스 보여주기"
 *     description: "데이트 코스를 추가한다."
 *     tags: [course]
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
router.get('/view-course', verifyToken, viewCourse);

router.post('/add-location', verifyToken, addLocation);

router.get('/search-location', verifyToken, searchLocation);

router.get('/get-places-inlat-lng-range', verifyToken, getPlacesInLatLngRange);

router.post('/regist-location', verifyToken, registLocation);

export default router;