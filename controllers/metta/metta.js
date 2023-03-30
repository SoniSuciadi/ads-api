import { facebookConfig } from "../../configs/facebook.js";
import client from "../../configs/pocketbase.js";
import { createCampaign } from "../../services/metta/index.js";

export const createAds = async (req, res, next) => {
  const { id } = req.body;
  try {
    const content = await client.collection("research_ads").getOne(id, {
      expand:
        "account, hashtag, campaign.campaignObjectif, optimizationGoaloptimizationGoal",
    });
    const facebookClient = facebookConfig(
      content.expand.account.credentials.facebook.access_token,
      content.expand.account.credentials.facebook.account_id
    );
    let campaignId = content.expand.campaign.campaign_id?.facebook || "";
    if (!campaignId) {
      campaignId = await createCampaign(
        content.expand.campaign,
        facebookClient
      );
    }

    res.status(200).json({ msg: "oghe" });
  } catch (error) {
    console.log("👻 ~ file: metta.js:11 ~ createAds ~ error:", error);
  }
};
export const updateAds = (req, res, next) => {
  try {
  } catch (error) {}
};
export const changeStatusAds = (req, res, next) => {
  try {
  } catch (error) {}
};
export const createNewCampaign = async (req, res, next) => {
  const { id } = req.body;
  try {
    const campaign = await client.collection("research_campaings").getOne(id, {
      expand: "campaignObjectif, account",
    });
    const facebookClient = facebookConfig(
      campaign.expand.account.credentials.facebook.access_token,
      campaign.expand.account.credentials.facebook.account_id
    );
    const campaignId = await createCampaign(campaign, facebookClient);
    res.status(200).json({ msg: "oghe", id: campaignId });
  } catch (error) {
    console.log("👻 ~ file: metta.js:51 ~ createNewCampaign ~ error:", error);
  }
};
