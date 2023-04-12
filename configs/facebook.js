import { FacebookAdsApi, AdAccount } from "facebook-nodejs-business-sdk";
export const facebookConfig = (accessToken, adAccount) => {
  console.log(
    "👻 ~ file: facebook.js:3 ~ facebookConfig ~ accessToken:",
    accessToken
  );
  FacebookAdsApi.init(accessToken);
  return new AdAccount(adAccount);
};
