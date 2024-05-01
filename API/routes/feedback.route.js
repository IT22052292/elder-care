import { create ,getfeed} from "../controllers/feedback.controller.js";
import express from "express";


const router = express.Router();

router.post("/create", create);
router.get("/getfeed", getfeed);


export default router;
