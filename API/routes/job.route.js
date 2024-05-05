import express from "express";
import { create } from "../controllers/job.controller.js";
import { getjobs } from "../controllers/job.controller.js";
import { deletejob } from "../controllers/job.controller.js";
import { updatejob } from "../controllers/job.controller.js";

const router = express.Router();

router.post("/create", create);
router.get("/getjobs", getjobs);
router.delete("/deletejob/:jobId", deletejob);
router.put("/updatejob/:jobId", updatejob);

export default router;
