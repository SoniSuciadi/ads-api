import express from "express";
import {
  createAds,
  createNewAdset,
  createNewCampaign,
  getInterestTargeting,
  getLocationTargeting,
  updateAds,
  updateAdset,
  updateCampaign,
} from "../../controllers/metta/metta.js";

const mettaRouter = express.Router();

mettaRouter.post("/campaign/:ad_account", createNewCampaign);
mettaRouter.post("/campaign/:ad_account", createNewCampaign);
mettaRouter.patch("/campaign/:ad_account/:campaign_id", updateCampaign);
mettaRouter.post("/adset/:ad_account", createNewAdset);
mettaRouter.patch("/adset/:ad_account/:adset_id", updateAdset);
mettaRouter.post("/ads/:ad_account", createAds);
mettaRouter.patch("/ads/:ad_account/:ad_id", updateAds);
mettaRouter.get("/targeting-location/:ad_account", getLocationTargeting);
mettaRouter.get("/targeting-interest/:ad_account", getInterestTargeting);

export default mettaRouter;
