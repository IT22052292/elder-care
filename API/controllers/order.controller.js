import Order from "../models/order.model.js";
import { errorHandler } from "../utils/error.js";

//creating an order


export const createOrder = async (req, res, next) => {
  try {
    //function to see if the order exists
    const existingOrder = await Order.findOne({
      customerName: req.body.customerName,
      orderStatus: { $ne: 'Fulfilled' }, //Check for orders that are not yet fulfilled
    });

    if (existingOrder) {
      return res.status(400).json({ message: "You already have an unfulfilled order. Please wait until it is fulfilled before placing another order." });
      
    }

    // Create a new order
    const newOrder = new Order({ ...req.body });
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    
    
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

//function to update servic status
export const updateOrder = async (req,res,next) =>{
  try{
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.orderId,
      {
        $set:{
          orderStatus: req.body.orderStatus,
        },
      },
      {new: true}
    );
    res.status(200).json(updatedOrder);
  }catch(error){
    next(error);

  }
};
//function to get orders by mont

export const getOrdersByMonth = async (req, res) => {
  const {month} = req.params;

  
  try {
    
    const monthIndex = parseFloat(month);
    
    if (isNaN(monthIndex) || monthIndex < 1 || monthIndex > 12) {
      return res.status(400).json({ message: "Invalid month value" });
    }

    // Construct start and end dates for the specified month
    const startDate = new Date(new Date().getFullYear(), monthIndex - 1, 1);
    const endDate = new Date(new Date().getFullYear(), monthIndex, 0);

    // Retrieve orders within the specified date range
    const orders = await Order.find({
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    });
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
