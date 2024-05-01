import Service from "../models/service.model.js";
import { errorHandler } from "../utils/error.js";

//creating a service

export const createService = async (req,res,next) =>{
    const newService = new Service({
        ...req.body,
    });

    try{
        const savedService = await newService.save();
        res.status(201).json(savedService);
    }catch(error){
        next(error);
    }
};

//function to read services
export const getService = async (req, res, next) => {
    try {
      const start = parseInt(req.query.start) || 0;
      const limit = parseInt(req.query.limit) || 15;
      const sort = req.query.order === "asc" ? 1 : -1;
  
      const service = await Service.find({
        ...(req.query.serviceId && { _id: req.query.serviceId }),
        
  
        ...(req.query.search && {
          title: { $regex: req.query.search, $options: "i" },
        }),
      })
        .sort({ updatedAt: sort })
        .skip(start);
  
      const totalService = await Service.countDocuments(); //to count total vacs in db
  
      res.status(200).json({
        totalService,
        service
        
      });
    } catch (error) {
      next(error);
    }
  };

  //function to delete service
  export const deleteService = async (req, res, next) => {
    try {
      await Service.findByIdAndDelete(req.params.serviceId);
      res.status(200).json("The service has been deleted successfully");
    } catch (error) {
      next(error);
    }
  };

  //function to edit service

  export const updateService = async (req, res, next) => {
    try {
      const updatedService = await Service.findByIdAndUpdate(
        req.params.serviceId,
        {
          $set: {
            serviceName: req.body.serviceName,
            serviceCategory: req.body.serviceCategory,
            servicePrice: req.body.servicePrice,
            serviceDescription: req.body.serviceDescription,
          },
        },
        { new: true }
      );
      res.status(200).json(updatedService);
    } catch (error) {
      next(error);
    }
  };
