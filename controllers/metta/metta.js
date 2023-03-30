import { FacebookAdsApi, AdAccount } from "facebook-nodejs-business-sdk";
import client from "../../configs/pocketbase.js";
import { searchTargeting } from "../../services/metta/index.js";

export const createAds = async (req, res, next) => {
  const { id } = req.body;
  try {
    const content = await client.collection("ads_research").getOne(id, {
      expand: "account, hashtag, campaing",
    });
    // const facebookClient = facebookConfig(
    //   content.expand.account.credentials.facebook,
    //   content.expand.account.credentials.account_id
    // );
    FacebookAdsApi.init(process.env.ACCESS_TOKEN);
    const facebookClient = new AdAccount(process.env.AD_ACCOUNT);
    const target = await searchTargeting("semarang", facebookClient);
    res.send(target);
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
