import { tiktokClient as tc } from "../../configs/tiktok.js";
import {
  createNewAdgroup,
  createNewCampaign,
  creatNewAd,
  findCity,
  findInterest,
  getAllAd,
  getCommentAd,
  updateAdById,
  updateAdsetById,
  updateCampaignById,
} from "../../services/tiktok/index.js";

export const createCampaign = async (req, res, next) => {
  const { ad_account } = req.params;
  try {
    const tiktokClient = tc(req.headers.access_token);

    const data = await createNewCampaign(req.body, tiktokClient, ad_account);
    if (data.code) {
      throw {
        status: Math.floor(data.code / 100),
        message: data.message,
      };
    }
    res.status(200).json({
      message: "Success",
      data: data.data.campaign_id,
    });
  } catch (error) {
    next(error);
  }
};
export const createAdset = async (req, res, next) => {
  const { ad_account } = req.params;

  try {
    const tiktokClient = tc(req.headers.access_token);
    const data = await createNewAdgroup(req.body, ad_account, tiktokClient);
    if (data.code) {
      throw {
        status: Math.floor(data.code / 100),
        message: data.message,
      };
    }
    res.status(200).json({
      message: "Success",
      data: data.data.adgroup_id,
    });
  } catch (error) {
    next(error);
  }
};
export const createAd = async (req, res, next) => {
  const { ad_account } = req.params;

  try {
    const tiktokClient = tc(req.headers.access_token);

    const result = await creatNewAd(req.body, ad_account, tiktokClient);
    if (result.code) {
      throw {
        status: Math.floor(result.code / 100),
        message: result.message,
      };
    }
    res.status(200).json({
      message: "Success",
      data: result.data.ad_ids[0],
    });
  } catch (error) {
    next(error);
  }
};
export const updateCampaign = async (req, res, next) => {
  const { name, campaignObjective, budgetMode, totalBudget, status } = req.body;
  const { ad_account, campaign_id } = req.params;
  try {
    const tiktokClient = tc(req.headers.access_token);
    const payload = {
      advertiser_id: ad_account,
      campaign_name: name,
      campaign_type: "BRAND_AWARENESS",
      objective_type: campaignObjective,
      budget_mode: budgetMode,
      budget: totalBudget,
      operation_status: status ? "ENABLE" : "DISABLE",
      campaign_id,
    };
    const data = await updateCampaignById(payload, tiktokClient);
    if (data.code) {
      throw {
        status: Math.floor(data.code / 100),
        message: data.message,
      };
    }
    res.status(200).json({
      message: "Success",
      data: data.data.campaign_id,
    });
  } catch (error) {
    next(error);
  }
};
export const updateAdset = async (req, res, next) => {
  const { ad_account, adset_id } = req.params;
  const {
    campaignId,
    name,
    optimizationGoal,
    billingEvent,
    startDate,
    endDate,
    status,
    bidAmount,
    targeting,
    budget,
  } = req.body;
  try {
    const tiktokClient = tc(req.headers.access_token);
    const payload = {
      advertiser_id: ad_account,
      campaign_id: campaignId,
      adgroup_name: name,
      budget_mode: "BUDGET_MODE_DAY",
      budget,
      billing_event: billingEvent,
      bid_price: bidAmount,
      optimization_goal: optimizationGoal,
      schedule_start_time: new Date(startDate),
      schedule_end_time: new Date(endDate),
      schedule_type: "SCHEDULE_START_END",
      location_ids: targeting.geo_locations.cities.map((el) => el.location_id),
      age_groups: targeting.age,
      genders: ["GENDER_MALE", "GENDER_FEMALE"],
      placements: ["PLACEMENT_TIKTOK"],
      interests: targeting.interests.map((el) => el.id),
      frequency: 5,
      frequency_schedule: 2,
      operation_status: status ? "ENABLE" : "DISABLE",
      adgroup_id: adset_id,
    };
    const data = await updateAdsetById(payload, tiktokClient);
    if (data.code) {
      throw {
        status: Math.floor(data.code / 100),
        message: data.message,
      };
    }
    res.status(200).json({
      message: "Success",
      data: data.data.campaign_id,
    });
  } catch (error) {
    next(error);
  }
};
export const updateAd = async (req, res, next) => {
  const { ad_account, ad_id } = req.params;

  try {
    const tiktokClient = tc(req.headers.access_token);

    const data = await updateAdById(req.body, tiktokClient, ad_account, ad_id);
    if (data.code) {
      throw {
        status: Math.floor(data.code / 100),
        message: data.message,
      };
    }
    res.status(200).json({
      message: "Success",
      data: data.data.ad_ids[0],
    });
  } catch (error) {
    next(error);
  }
};
export const getLocationTargeting = async (req, res, next) => {
  const { city } = req.query;

  try {
    const data = city.split(",").map((el) => findCity(el));
    res.status(200).json({
      message: "Success",
      data: data.flatMap((el) => el),
    });
  } catch (error) {
    next(error);
  }
};
export const getInterestTargeting = async (req, res, next) => {
  const { interest } = req.query;

  const { ad_account } = req.params;
  try {
    const tiktokClient = tc(req.headers.access_token);

    const data = await findInterest(
      interest.split(","),
      ad_account,
      tiktokClient
    );
    res.status(200).json({
      message: "Success",
      data,
    });
  } catch (error) {
    next(error);
  }
};
export const getAllAds = async (req, res, next) => {
  const { ad_account } = req.params;
  try {
    const tiktokClient = tc(req.headers.access_token);

    const data = await getAllAd(tiktokClient, ad_account);
    res.status(200).json({
      message: "Success",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getComment = async (req, res, next) => {
  const { ad_account } = req.params;
  const { endDate, startDate, id, search_field } = req.body;
  try {
    const tiktokClient = tc(req.headers.access_token);

    const data = await getCommentAd(
      tiktokClient,
      ad_account,
      endDate,
      startDate,
      id,
      search_field
    );
    res.status(200).json({
      message: "Success",
      data,
    });
  } catch (error) {
    next(error);
  }
};
