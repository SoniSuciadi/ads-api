import express from "express";
import {
  createAd,
  createAdset,
  createCampaign,
  getAllAds,
  getComment,
  getInterestTargeting,
  getLocationTargeting,
  updateAd,
  updateAdset,
  updateCampaign,
} from "../../controllers/tiktok/tiktok.js";
const tiktokRouter = express.Router();

tiktokRouter.get("/:ad_account", getAllAds);
tiktokRouter.post("/comment/:ad_account", getComment);
tiktokRouter.post("/campaign/:ad_account", createCampaign);
tiktokRouter.patch("/campaign/:ad_account/:campaign_id", updateCampaign);

tiktokRouter.post("/adgroup/:ad_account", createAdset);
tiktokRouter.patch("/adgroup/:ad_account/:adset_id", updateAdset);

tiktokRouter.post("/ads/:ad_account", createAd);
tiktokRouter.patch("/ads/:ad_account/:ad_id", updateAd);

tiktokRouter.get("/targeting-location/:ad_account", getLocationTargeting);
tiktokRouter.get("/targeting-interest/:ad_account", getInterestTargeting);
export default tiktokRouter;
