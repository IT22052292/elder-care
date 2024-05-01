import Order from "../models/order.model.js";
import { errorHandler } from "../utils/error.js";

//creating an order


export const createOrder = async (req,res,next) =>{
  const newOrder = new Order({
      ...req.body,
  });

  try{
      const savedOrder = await newOrder.save();
      res.status(201).json(savedOrder);
  }catch(error){
      next(error);
  }
};

//function to read orders

export const getOrder = async (req, res, next) => {
  try {
    const start = parseInt(req.query.start) || 0;
    const limit = parseInt(req.query.limit) || 100;
    const sort = req.query.order === "asc" ? 1 : -1;

    const order = await Order.find({
      ...(req.query.orderId && { _id: req.query.orderId }),
      

      ...(req.query.search && {
        title: { $regex: req.query.search, $options: "i" },
      }),
    })
      .sort({ updatedAt: sort })
      .skip(start);

    const totalOrder = await Order.countDocuments(); //to count total or in db

    res.status(200).json({
      totalOrder,
      order
      
    });
  } catch (error) {
    next(error);
  }
};