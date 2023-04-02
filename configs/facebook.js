import { FacebookAdsApi, AdAccount } from "facebook-nodejs-business-sdk";
export const facebookConfig = (accessToken, adAccount) => {
  FacebookAdsApi.init(accessToken);
  return new AdAccount(adAccount);
};
