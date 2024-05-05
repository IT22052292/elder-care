import Feedback from "../models/feedback.model.js";

export const create = async (req, res, next) => {
  const newFeed = new Feedback({
    ...req.body,
  });

  try {
    const savedFeed = await newFeed.save();
    res.status(201).json(savedFeed);
  } catch (error) {
    next(error);
  }
};

export const getfeed = async (req, res, next) => {
  try {
    const start = parseInt(req.query.start);
    const sort = req.query.order === "asc" ? 1 : -1;

    const feedback = await Feedback.find({
      ...(req.query.feedId && { _id: req.query.feedId }),
    })
      .sort({ updatedAt: sort })
      .skip(start);

    res.status(200).json({
      feedback,
    });
  } catch (error) {
    next(error);
  }
};
