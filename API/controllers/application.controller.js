import Application from "../models/application.model.js";

export const submitapplication = async (req, res, next) => {
  const newApp = new Application({
    ...req.body,
  });
  try {
    const savedApp = await newApp.save();
    res.status(201).json(savedApp);
  } catch (error) {
    next(error);
  }
};

export const getapplications = async (req, res, next) => {
  try {
    const start = parseInt(req.query.start);
    const sort = req.query.order === "asc" ? 1 : -1;

    const application = await Application.find({
      ...(req.query.appId && { _id: req.query.appId }),
      ...(req.query.vacancyReference && { _id: req.query.vacancyReference }),
    })
      .sort({ updatedAt: sort })
      .skip(start);

    const totalApp = await Application.countDocuments();
    
    res.status(200).json({
      totalApp,
      application,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteapp = async (req, res, next) => {
  try {
    await Application.findByIdAndDelete(req.params.appId);
    res.status(200).json("The application has been deleted successfully");
  } catch (error) {
    next(error);
  }
};
