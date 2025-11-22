import express from "express";
import {
  add,
  deleteUrl,
  getData,
  getLinks,
  healthz,
  redirect,
} from "../controller/url.js";

const urlRouter = express.Router();

urlRouter.post("/", add);
urlRouter.get("/:code", redirect);
urlRouter.delete("/:code", deleteUrl);
urlRouter.get("/code/:code", getData);
urlRouter.get("/", getLinks);
urlRouter.get("/healthz", healthz);
export default urlRouter;
