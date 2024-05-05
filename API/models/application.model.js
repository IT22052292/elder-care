import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    vacancyReference: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          // no spaces
          return !/\s/.test(v);
        },
        message: "Vacancy Reference must not contain spaces.",
      },
    },
    fullName: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          //  only letters and spaces
          return /^[a-zA-Z\s]+$/.test(v);
        },
        message: "Full Name must contain only letters and spaces.",
      },
    },
    email: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          //  valid email address format
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: "Email must be a valid email address.",
      },
    },
    phone: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          //  10-digit phone number
          return /^\d{10}$/.test(v);
        },
        message: "Phone must be a 10-digit number.",
      },
    },
    cv: {
      type: String,
    },
    status: {
      type: String,
      default: "PENDING",
    },
  },
  { timestamps: true }
);

const Application = mongoose.model("Application", applicationSchema);
export default Application;
