import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
    serviceName: {
        type: String,
        required: [true, "Service name is required"],
        minlength: [2, "Service name must be at least 2 characters long"],
        maxlength: [50, "Service name cannot exceed 50 characters"],
    },
    serviceDescription: {
        type: String,
        required: [true, "Service description is required"],
        minlength: [10, "Service description must be at least 10 characters long"],
        maxlength: [500, "Service description cannot exceed 500 characters"],
    },
    servicePrice: {
        type: Number,
        required: [true, "Service price is required"],
        min: [1, "Service price must be a non-negative number and not zero"],
        max:[99, "Service must be less than 100 usd"]
    },
    serviceCategory: {
        type: String,
        required: [true, "Service category is required"],
        enum: {
            values: ["Physical Activities", "Arts and Crafts", "Music and Performing Arts","Cultural and Educational"], 
            message: "Invalid service category",
        },
    },
});

const Service = mongoose.model("Service", serviceSchema);
export default Service;
