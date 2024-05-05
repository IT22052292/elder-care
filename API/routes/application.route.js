import express from "express";
import {
  submitapplication,
  getapplications,
  deleteapp,
  updateStatus
} from "../controllers/application.controller.js";

const router = express.Router();

router.post("/submitapplication", submitapplication);
router.get("/getapplications", getapplications);
router.delete("/deleteapp/:appId", deleteapp);
router.put("/updatestatus/:appId",updateStatus)
export default router;
