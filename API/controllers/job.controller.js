import Job from "../models/vacancy.model.js";
import { errorHandler } from "../utils/error.js";

export const create = async (req, res, next) => {
  const newJob = new Job({
    ...req.body,
  });

  try {
    const savedJob = await newJob.save();
    res.status(201).json(savedJob);
  } catch (error) {
    next(error);
  }
};

//function to read jobs
export const getjobs = async (req, res, next) => {
  try {
    const start = parseInt(req.query.start) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sort = req.query.order === "asc" ? 1 : -1;

    const job = await Job.find({
      ...(req.query.jobId && { _id: req.query.jobId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.reference && { reference: req.query.reference }),

      ...(req.query.search && {
        title: { $regex: req.query.search, $options: "i" },
      }),
    })
      .sort({ updatedAt: sort })
      .skip(start);

    const totalVacancy = await Job.countDocuments(); //to count total vacs in db

    res.status(200).json({
      totalVacancy,
      job,
    });
  } catch (error) {
    next(error);
  }
};

//finction to delete jobs
export const deletejob = async (req, res, next) => {
  try {
    await Job.findByIdAndDelete(req.params.jobId);
    res.status(200).json("The vacancy has been deleted successfully");
  } catch (error) {
    next(error);
  }
};

export const updatejob = async (req, res, next) => {
  try {
    const updatedJob = await Job.findByIdAndUpdate(
      req.params.jobId,
      {
        $set: {
          title: req.body.title,
          category: req.body.category,
          salary: req.body.salary,
          description: req.body.description,
        },
      },
      { new: true }
    );
    res.status(200).json(updatedJob);
  } catch (error) {
    next(error);
  }
};
