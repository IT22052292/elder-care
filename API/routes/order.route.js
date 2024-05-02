import express from "express";
import { createOrder,getOrder,getOrdersByMonth,updateOrder } from "../controllers/order.controller.js";


const router= express.Router();

router.post("/createOrder",createOrder);
router.get("/getOrder",getOrder);
router.put("/updateOrder/:orderId",updateOrder);
router.get("/getOrdersByMonth/:month",getOrdersByMonth);


export default router;