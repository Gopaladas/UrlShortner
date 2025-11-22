import mongoose from "mongoose";

const urlSchema = new mongoose.Schema(
  {
    shortid: {
      type: String,
      required: true,
      unique: true,
    },
    redirectUrl: {
      type: String,
      required: true,
    },
    fullUrl: {
      type: String,
      required: true,
    },
    visitedHistory: [
      {
        timestamp: { type: Date },
      },
    ],
  },
  { timestamps: true }
);

const urlModel = mongoose.model("url", urlSchema);
export default urlModel;
