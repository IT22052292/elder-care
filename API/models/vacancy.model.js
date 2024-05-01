import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    reference: {
      type: String,
    },
    salary: {
      type: String,
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
