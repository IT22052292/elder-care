import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  serviceName:{type:String,required:true,},
  servicePrice: {type:Number,required:true,},
  
  
});

const orderSchema = new mongoose.Schema(
  {

   
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
    orderStatus:{
      type:String,
      default:"Unfulfilled"
    },

  },
  { timestamps: true }
);
const Order = mongoose.model("Order", orderSchema);
export default Order;