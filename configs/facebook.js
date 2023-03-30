import { FacebookAdsApi, AdAccount } from "facebook-nodejs-business-sdk";
export const facebookConfig = (accessToken, adAccount) => {
  try {
    FacebookAdsApi.init(accessToken);
    return new AdAccount(adAccount);
  } catch (error) {
    console.log("👻 ~ file: index.js:41 ~ facebookClient ~ error:", error);
  }
};
