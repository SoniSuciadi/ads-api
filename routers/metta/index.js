import express from "express";
import { createAds, createNewCampaign } from "../../controllers/metta/metta.js";

const mettaRouter = express.Router();

mettaRouter.post("/campaign", createNewCampaign);
mettaRouter.post("/", createAds);

export default mettaRouter;
