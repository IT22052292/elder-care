import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  serviceName:{type:String,required:true,},
  servicePrice: {type:Number,required:true,},
  
  
});

const orderSchema = new mongoose.Schema(
  {

    orderId: {
      type: String,
      required:true,
      
    },
    customerName:{
        type: String,
        required:true,
        
    },
    customerEmail:{
      type:String,
      required:true,
      
    },
    
    orderItems:[orderItemSchema],

    totalPrice: {
        type:Number,
        required:true,
        
    },

  },
  { timestamps: true }
);
const Order = mongoose.model("Order", orderSchema);
export default Order;