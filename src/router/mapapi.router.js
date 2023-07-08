import { Router } from "express";
import { verifyToken } from "../middleware/verifyToken";

const router = Router();

router.post('/geocoding', verifyToken, geocoding);
router.post('/reverse-geocoding', verifyToken, reverseGeocoding);

export default router;
