import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { loginUser, logoutUser, registerUSer } from "../controllers/user.controller.js";


const router = Router();

router.route('/login').post(loginUser)
router.route('/signup').post(registerUSer)
router.route('/logout').post(verifyJWT,logoutUser)


export default router