import express from "express"
import authController from "../controller/authController.js";
const router= express.Router();

router.post('/login', authController.login);
router.post ('/refresh-token', authController.refreshToken)

export default router