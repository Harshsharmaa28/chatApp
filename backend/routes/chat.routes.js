import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { 
    accessChat,
    fetchchats,
    createdGroupChat,
    removeFromGroup,
    addToGroup,
    renameGroup, 
} from "../controllers/chat.controller.js";

const router = Router();

router.route("/").post(verifyJWT,accessChat);
router.route("/getChats").get(verifyJWT,fetchchats);
router.route("/group").post(verifyJWT,createdGroupChat);
router.route("/rename").put(verifyJWT,renameGroup);
router.route("/groupremove").put(verifyJWT,removeFromGroup);
router.route("/groupadd").put(verifyJWT,addToGroup);

export default router