import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { getAllUser, loginUser, logoutUser, registerUSer } from "../controllers/user.controller.js";


const router = Router();

router.route('/login').post(loginUser)
router.route('/signup').post(registerUSer)
router.route('/logout').post(verifyJWT,logoutUser)
router.route('/').get(verifyJWT,getAllUser);


export default router