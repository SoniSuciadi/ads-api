import express from "express";
import { createCampaign } from "../../controllers/google/google.js";
const googleRouter = express.Router();

googleRouter.post("/campaign", createCampaign);

export default googleRouter;
