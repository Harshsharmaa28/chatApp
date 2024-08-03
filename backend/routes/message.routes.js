import { Router } from "express";
import { allMessage, sendMessage } from "../controllers/message.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/:chatId").get(verifyJWT,allMessage);
router.route("/send").post(verifyJWT, sendMessage);

export default router;