import express from "express";
import {
  submitapplication,
  getapplications,
  deleteapp,
} from "../controllers/application.controller.js";

const router = express.Router();

router.post("/submitapplication", submitapplication);
router.get("/getapplications", getapplications);
router.delete("/deleteapp/:appId", deleteapp);
export default router;
