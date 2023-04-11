import fs from "fs";

export const createNewCampaign = async (data, tiktokClient, advertiser_id) => {
  const { name, campaignObjective, budgetMode, totalBudget, status } = data;
  const payload = {
    advertiser_id,
    campaign_name: name,
    campaign_type: "REGULAR_CAMPAIGN",
    objective_type: campaignObjective,
    budget_mode: budgetMode,
    budget: totalBudget,
    operation_status: status ? "ENABLE" : "DISABLE",
  };
  const result = await tiktokClient.post("/campaign/create/", payload);

  return result.data;
};

export const createNewAdgroup = async (payload, ad_account, tiktokClient) => {
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
  } = payload;
  const { data } = await tiktokClient.post(`/adgroup/create/`, {
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
  });
  return data;
};

export const findCity = (cityName) => {
  const data = JSON.parse(fs.readFileSync("tiktok-location.json", "utf8"));

  return data.filter(
    (el) => el.name.toLowerCase().indexOf(cityName.toLowerCase()) > -1
  );
};
export const findInterest = async (interests, advertiser_id, tiktokClient) => {
  const { data } = await tiktokClient.get(
    `/tool/interest_category/?advertiser_id=${advertiser_id}`
  );
  const list = data.data.interest_categories;
  return interests
    .map((el) =>
      list.filter(
        (elem) =>
          elem.interest_category_name.toLowerCase().indexOf(el.toLowerCase()) >
          -1
      )
    )
    .flatMap((el) => el)
    .map((el) => ({
      id: el.interest_category_id,
      name: el.interest_category_name,
    }));
};

export const uploadVideoFromURL = async (
  video_url,
  advertiser_id,
  tiktokClient
) => {
  const { data } = await tiktokClient.post("/file/video/ad/upload/", {
    advertiser_id,
    video_url: video_url.resource,
    upload_type: "UPLOAD_BY_URL",
  });
  return data?.data[0]?.video_id;
};
export const uploadImageFromUrl = async (
  content,
  advertiser_id,
  tiktokClient
) => {
  const { data } = await tiktokClient.post("file/image/ad/upload/", {
    advertiser_id,
    upload_type: "UPLOAD_BY_URL",
    image_url: content.resource,
  });

  return data.data.image_id;
};
export const creatNewAd = async (payload, ad_account, tiktokClient) => {
  const { adSetId, contents, name, pageId, status } = payload;
  const content = await Promise.all(
    contents.map((el) => uploadVideoFromURL(el, ad_account, tiktokClient))
  );
  const imgTumb = await uploadImageFromUrl(
    { resource: contents[0].resourceThumbnail },
    ad_account,
    tiktokClient
  );

  let creativePayload = {
    ad_format: "SINGLE_VIDEO",
    identity_id: pageId,
    identity_type: "TT_USER",
    ad_name: contents[0]?.title,
    display_name: name,
    video_id: content[0] || "v10033g50000cgm50kjc77u51rric8dg",
    ad_text: contents[0]?.description,
    landing_page_url: contents[0]?.link,
    call_to_action: contents[0]?.call_to_action?.type,
    image_ids: [imgTumb],
  };
  if (contents[0].type == "BOOST POST") {
    const itemId = await getItemTiktokId(
      contents[0].authCode,
      tiktokClient,
      ad_account
    );
    creativePayload = {
      ad_format: "SINGLE_VIDEO",
      identity_id: pageId,
      identity_type: "TT_USER",
      ad_name: contents[0].title,
      tiktok_item_id: itemId,
    };
  }
  const { data } = await tiktokClient.post("/ad/create/", {
    advertiser_id: ad_account,
    adgroup_id: adSetId,
    creatives: [creativePayload],
    operation_status: status ? "ENABLE" : "DISABLE",
  });
  return data;
};
export const updateCampaignById = async (payload, tiktokClient) => {
  const newPayload = {};
  const keys = Object.keys(payload);
  keys.forEach((el) => {
    if (payload[el]) {
      newPayload[el] = payload[el];
    }
  });
  const { data } = await tiktokClient.post("/campaign/update/", newPayload);
  return data;
};

export const updateAdsetById = async (payload, tiktokClient) => {
  const newPayload = {};
  const keys = Object.keys(payload);
  keys.forEach((el) => {
    newPayload[el] = payload[el];
  });
  const { data } = await tiktokClient.post("/adgroup/update/", newPayload);
  return data;
};

export const updateAdById = async (
  payload,
  tiktokClient,
  ad_account,
  ad_id
) => {
  const { adSetId, contents, name, pageId, status } = payload;
  const content = await Promise.all(
    contents.map((el) => uploadVideoFromURL(el, ad_account, tiktokClient))
  );
  const imgTumb = await uploadImageFromUrl(
    { resource: contents[0].resourceThumbnail },
    ad_account,
    tiktokClient
  );

  const { data } = await tiktokClient.post("/ad/update/", {
    advertiser_id: ad_account,
    adgroup_id: adSetId,
    creatives: [
      {
        ad_id,
        ad_format: "SINGLE_VIDEO",
        identity_id: pageId,
        identity_type: "TT_USER",
        ad_name: contents[0].title,
        display_name: name,
        video_id: content[0] || "v10033g50000cgm50kjc77u51rric8dg",
        ad_text: contents[0].description,
        landing_page_url: contents[0].link,
        call_to_action: contents[0].call_to_action.type,
        image_ids: [imgTumb],
      },
    ],
    operation_status: status ? "ENABLE" : "DISABLE",
  });

  return data;
};
const getItemTiktokId = async (authCode, tiktokClient, ad_account) => {
  await tiktokClient.post("/tt_video/authorize/", {
    advertiser_id: ad_account,
    auth_code: authCode,
  });

  const { data } = await tiktokClient.get(
    `/tt_video/list/?advertiser_id=${ad_account}`
  );
  console.log("👻 ~ file: index.js:238 ~ getItemTiktokId ~ data:", data);
  return data.data.list.find((el) => el.item_info.auth_code == authCode)
    ?.item_info?.item_id;
};
export const getAllAd = async (tiktokClient, ad_account) => {
  const data = await tiktokClient.get(`/ad/get/?advertiser_id=${ad_account}`);
  return data.data.data.list.map((el) => ({
    campaignId: el.campaign_id,
    adSetId: el.adgroup_id,
    id: el.ad_id,
    name: el.ad_name,
    status: el.operation_status,
  }));
};
