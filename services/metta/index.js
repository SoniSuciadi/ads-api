import { Campaign } from "facebook-nodejs-business-sdk";
import client from "../../configs/pocketbase.js";
export const createCampaign = async (data, facebookClient) => {
  const {
    id,
    name,
    target,
    status,
    campaign_id,
    totalBudget,
    expand: { campaignObjectif },
  } = data;

  try {
    const findTarget = await Promise.all(
      target.map((el) => searchTargeting(el, facebookClient))
    ).then((res) => res.flatMap((el) => el));

    const { _data } = await facebookClient.createCampaign(
      [Campaign.Fields.Id],
      {
        [Campaign.Fields.name]: name,
        [Campaign.Fields.status]: status
          ? Campaign.Status.active
          : Campaign.Status.paused,
        [Campaign.Fields.objective]: campaignObjectif.value,
        [Campaign.Fields.special_ad_categories]: ["NONE"],
        [Campaign.Fields.lifetime_budget]: totalBudget,
        [Campaign.Fields.targeting]: {
          geo_locations: {
            cities: findTarget,
            location_types: ["home", "recent"],
          },
        },
      }
    );

    await client.collection("research_campaings").update(id, {
      campaign_id: {
        ...campaign_id,
        facebook: _data.id,
      },
    });

    return _data.id;
  } catch (error) {
    console.log("👻 ~ file: index.js:9 ~ createCampaign ~ error:", error);
  }
};
export const searchTargeting = async (query, facebookClient) => {
  try {
    const targetingSearchParams = {
      q: query,
      limit: 1000,
    };

    const data = await facebookClient
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
