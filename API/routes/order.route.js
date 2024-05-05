import express from "express";
import { createOrder,getOrder,getOrdersByMonth,updateOrder,getOrdersByUserName } from "../controllers/order.controller.js";


const router= express.Router();

router.post("/createOrder",createOrder);
router.get("/getOrder",getOrder);
router.put("/updateOrder/:orderId",updateOrder);
router.get("/getOrdersByMonth/:month",getOrdersByMonth);
router.get("/getOrdersByUserName/:username",getOrdersByUserName);



export default router;