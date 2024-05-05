import express from "express";
import { signup ,signin,google, getusers, signOut, deleteUser,updateUser} from "../controllers/auth.controller.js";

const router = express.Router()
router.post('/signup', signup );
router.post("/signin", signin);
router.post("/google", google);
router.get("/getusers", getusers);
router.delete("/deleteUser/:userId",deleteUser);
router.get('/signout',signOut);
router.put("/updateUser/:userId",updateUser);



export default router