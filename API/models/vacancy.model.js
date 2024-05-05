import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    reference: {
      type: String,
      required: true,
      unique: true,   
      validate: {
        validator: function (v) {
          //  does not contain any spaces
          return !/\s/.test(v);
        },
        message: "Reference must not contain spaces.",
      },
    },
    salary: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          //number greater than 0
          return /^\d+(\.\d+)?$/.test(v) && parseFloat(v) > 0;
        },
        message: "Salary must be a number greater than 0.",
      },
    },
    description: {
      type: String,
    },
    category: {
      type: String,
    },
    image: {
      type: String,
      default:
        "https://www.trevenacross.co.uk/wp-content/uploads/2019/03/Job-Vacancy.jpg",
    },
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", jobSchema);
export default Job;
