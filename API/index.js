import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv"; // for hidden url
import authRouter from "./routes/auth.route.js";
import jobRoutes from "./routes/job.route.js";
import applicationRouter from "./routes/application.route.js";
import feedbackRouter from "./routes/feedback.route.js";
import serviceRouter from "./routes/service.route.js"
import orderRouter from "./routes/order.route.js"
import emailRoute from "./routes/mail.route.js";

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("connected to mongodb");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

app.use(express.json());

app.listen(8070, () => {
  console.log("Server running on port 8070");
});

app.use("/API/auth", authRouter);
app.use("/API/post", jobRoutes);
app.use("/API/application", applicationRouter);
app.use("/API/feedback", feedbackRouter);
app.use("/API/service",serviceRouter);
app.use("/API/order",orderRouter);
app.use("/API/sendmail", emailRoute);

//middleware for error handling
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500; // assign status code ,500 is nothing
  const message = err.message || "Internal server error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
