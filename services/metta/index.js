import { FacebookAdsApi, AdAccount } from "facebook-nodejs-business-sdk";
export const createCampaing = (data) => {
  try {
  } catch (error) {}
};
export const searchTargeting = async (query, adAccount) => {
  try {
    const targetingSearchParams = {
      q: query,
      type: "adgeolocation",
      location_types: ["region", "city"],
      limit: 1000,
    };

    const data = await adAccount
      .getTargetingSearch(["id", "name"], targetingSearchParams)
      .then((res) =>
        res
          .map((el) => ({ id: el._data.id, name: el._data.name }))
          .filter(
            (el) =>
              el.name.toLowerCase().includes("kota") ||
              el.name.toLowerCase().includes("kabupaten")
          )
      );
    return data;
  } catch (error) {
    console.log("👻 ~ file: index.js:23 ~ searchTargeting ~ error:", error);
  }
};
export const createAdset = (data) => {
  try {
  } catch (error) {}
};

export const facebookConfig = (accessToken, adAccount) => {
  try {
    FacebookAdsApi.init(accessToken);
    return new AdAccount(adAccount);
  } catch (error) {
    console.log("👻 ~ file: index.js:41 ~ facebookClient ~ error:", error);
  }
};
