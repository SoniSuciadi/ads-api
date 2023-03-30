import express from "express";
import { createAds } from "../../controllers/metta/metta.js";

const mettaRouter = express.Router();

mettaRouter.use("/", createAds);

export default mettaRouter;
