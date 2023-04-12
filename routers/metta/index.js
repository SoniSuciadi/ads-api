import express from "express";
import {
  createAds,
  createNewAdset,
  createNewCampaign,
  getAllAds,
  getComments,
  getInstagramPost,
  getInterestTargeting,
  getLocationTargeting,
  getStatisticAd,
  getStatisticAdset,
  getStatisticCampaign,
  replyComment,
  updateAds,
  updateAdset,
  updateCampaign,
} from "../../controllers/metta/metta.js";

const mettaRouter = express.Router();

mettaRouter.get("/instagram-post", getInstagramPost);
mettaRouter.get("/comments", getComments);
mettaRouter.post("/comments", replyComment);
mettaRouter.get("/:ad_account", getAllAds);
mettaRouter.get("/statistic-campaign/:campaign_id", getStatisticCampaign);
mettaRouter.post("/campaign/:ad_account", createNewCampaign);
mettaRouter.patch("/campaign/:ad_account/:campaign_id", updateCampaign);

mettaRouter.get("/statistic-adset/:adset_id", getStatisticAdset);
mettaRouter.post("/adset/:ad_account", createNewAdset);
mettaRouter.patch("/adset/:ad_account/:adset_id", updateAdset);

mettaRouter.get("/statistic-ad/:ad_id", getStatisticAd);
mettaRouter.post("/ads/:ad_account", createAds);
mettaRouter.patch("/ads/:ad_account/:ad_id", updateAds);

mettaRouter.get("/targeting-location/:ad_account", getLocationTargeting);
mettaRouter.get("/targeting-interest/:ad_account", getInterestTargeting);

export default mettaRouter;
