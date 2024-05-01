import express from "express";
import { createService,deleteService,getService, updateService } from "../controllers/service.controller.js";


const router= express.Router();

router.post("/createService",createService);
router.get("/getService",getService);
router.delete("/deleteService/:serviceId",deleteService);
router.put("/updateService/:serviceId",updateService);

export default router;