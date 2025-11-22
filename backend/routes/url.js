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
urlRouter.get("/healthz", healthz);
urlRouter.get("/", getLinks);
urlRouter.get("/code/:code", getData);

urlRouter.post("/", add);
urlRouter.delete("/:code", deleteUrl);
urlRouter.get("/:code", redirect);

export default urlRouter;
