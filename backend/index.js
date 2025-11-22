import express from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "https://url-shortner-inky-delta.vercel.app",
    methods: ["POST", "GET", "DELETE", "PUT", "PATCH"],
  })
);

import connectDB from "./config/mongoDB.js";
import urlRouter from "./routes/url.js";
connectDB(process.env.MONGO_URI);

app.use("/", urlRouter);

app.listen(process.env.PORT, () => {
  console.log(`server is running at Port : ${process.env.PORT}`);
});
