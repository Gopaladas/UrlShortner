import urlModel from "../models/url.js";
import shortid from "shortid";
import { isWebUri } from "valid-url";

const add = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) return res.json({ message: "Enter the url" });

    if (!isWebUri(url))
      return res.status(400).json({ message: "Invalid url format." });

    const urlExist = await urlModel.findOne({ redirectUrl: url });
    if (urlExist) return res.json({ message: "Url already exist" });

    const shortId = shortid.generate();
    const fullUrl = "https://urlshortner-silk-seven.vercel.app" + "/" + shortId;
    const urlData = await urlModel.create({
      shortid: shortId,
      redirectUrl: url,
      fullUrl: fullUrl,
      visitedHistory: [],
    });

    return res.status(200).json({
      id: urlData.shortid,
      fullUrl: urlData.fullUrl,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const redirect = async (req, res) => {
  try {
    const shortid = req.params.code;

    if (!shortid) return res.json(400).json({ message: "Invalid url" });
    const data = await urlModel.findOneAndUpdate(
      { shortid },
      {
        $push: {
          visitedHistory: { timestamp: new Date() },
        },
      }
    );
    if (!data)
      return res
        .status(404)
        .json({ message: "404 not Found: url is not found or url is deleted" });
    res.redirect(302, data.redirectUrl);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const deleteUrl = async (req, res) => {
  try {
    const shortid = req.params.code;
    if (!shortid) return res.status(400).json({ message: "url is not valid" });

    const exist = await urlModel.findOneAndDelete({ shortid });
    if (!exist) return res.status(404).json({ message: "url not found" });

    return res.status(204).json({ message: "url deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getData = async (req, res) => {
  try {
    const shortid = req.params.code;
    if (!shortid) return res.status(404).json({ message: "url not valid" });
    const data = await urlModel.findOne({ shortid });
    return res
      .status(200)
      .json({ data: data, message: "successfully fetched the data" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getLinks = async (req, res) => {
  try {
    const data = await urlModel.find().sort({ createdAt: -1 });
    return res
      .status(200)
      .json({ data: data, message: "data fetched successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const healthz = async (req, res) => {
  try {
    res.status(200).json({
      ok: true,
      version: "1.0",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { add, redirect, deleteUrl, getData, getLinks, healthz };
