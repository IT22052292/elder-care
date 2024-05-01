import express from "express";
import { createOrder,getOrder } from "../controllers/order.controller.js";


const router= express.Router();

router.post("/createOrder",createOrder);
router.get("/getOrder",getOrder);


export default router;