import mongoose from "mongoose";
const applicationShcema = new mongoose.Schema(
  {
    vacancyReference: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },

    cv: {
      type: String,
    },
  },
  { timestamps: true }
);

const Application = mongoose.model("Application", applicationShcema);
export default Application;
