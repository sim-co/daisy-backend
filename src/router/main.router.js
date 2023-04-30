import { Router } from "express";
import { verifyToken } from "../middleware/verifyToken";
import { generateCourse, addLocation } from '../controller/main.controller';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: 데이트 코스 추가
 *   description: 메인화면
*/
router.post('/add-course', verifyToken, generateCourse)

/**
 * @swagger
 * tags:
 *   name: 장소 추가
 *   description: 메인화면
*/
router.post('/add-location', verifyToken, addLocation)

export default router;