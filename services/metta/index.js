import axios from "axios";
import { Campaign, AdSet, AdImage, Ad } from "facebook-nodejs-business-sdk";

import { fetchUrltoBytes } from "../../helpers/fetchImageByte.js";

export const createCampaign = async (data, facebookClient) => {
  console.log("👻 ~ file: index.js:7 ~ createCampaign ~ data:", data);
  const { name, status, totalBudget, campaignObjective } = data;

  const { _data } = await facebookClient.createCampaign([Campaign.Fields.Id], {
    [Campaign.Fields.name]: name,
    [Campaign.Fields.status]: status
      ? Campaign.Status.active
      : Campaign.Status.paused,
    [Campaign.Fields.objective]: campaignObjective,
    [Campaign.Fields.special_ad_categories]: ["NONE"],
    [Campaign.Fields.lifetime_budget]: totalBudget,
  });

  return _data.id;
};

export const createAdset = async (data, facebookClient) => {
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
  } = data;

  const response = await facebookClient.createAdSet(
    [AdSet.Fields.id, AdSet.Fields.name],
    new AdSet(null, {
      [AdSet.Fields.name]: name,
      [AdSet.Fields.bid_amount]: bidAmount,
      [AdSet.Fields.campaign_id]: campaignId,
      [AdSet.Fields.optimization_goal]: optimizationGoal,
      [AdSet.Fields.billing_event]: billingEvent,
      [AdSet.Fields.targeting]: targeting,
      [AdSet.Fields.start_time]: new Date(startDate).toISOString(),
      [AdSet.Fields.end_time]: new Date(endDate).toISOString(),
      [AdSet.Fields.status]: status ? "ACTIVE" : "PAUSED",
    })
  );
  return response._data.id;
};
export const createAd = async (data, facebookClient) => {
  const {
    adSetId,
    contents,
    name,
    link,
    message,
    pageId,
    description,
    status,
    instagram_actor_id,
  } = data;

  const child_attachments = await Promise.all(
    uploadContent(contents, facebookClient)
  );

  let dataAd = {
    name,
    object_story_spec: {
      page_id: pageId,
      instagram_actor_id,
      link_data: {
        message,
        link,
        name,
        description,
        child_attachments,
      },
    },
  };
  if (contents.length == 1) {
    if (contents[0].type == "VIDEO") {
      const { description, title, link, ...property } = child_attachments[0];
      dataAd = {
        name,
        object_story_spec: {
          page_id: pageId,
          video_data: { ...property },
        },
      };
    } else {
      const { title, ...property } = child_attachments[0];
      dataAd = {
        name,
        object_story_spec: {
          page_id: pageId,
          link_data: { ...property, name: title },
        },
      };
    }
  }

  const creative = await facebookClient.createAdCreative([], dataAd);
  const adData = {
    name,
    adset_id: adSetId,
    creative: {
      creative_id: creative._data.id,
    },
    status: status ? "ACTIVE" : "PAUSED",
  };
  const ad = await facebookClient.createAd([], adData);
  return ad._data.id;
};

export const uploadContent = (contents, facebookClient) => {
  return contents.map(async (el) => {
    if (el.type == "IMAGE") {
      const byte = await fetchUrltoBytes(el.resource);
      const data = await facebookClient.createAdImage([AdImage.Fields.Hash], {
        bytes: byte,
      });
      const { type, resource, ...property } = el;

      return { ...property, image_hash: data._data.images.bytes.hash };
    } else if (el.type == "VIDEO") {
      const videoData = {
        file_url: el.resource,
      };
      const video = await facebookClient.createAdVideo([], videoData);
      const byte = await fetchUrltoBytes(el.resourceThumbnail);
      const data = await facebookClient.createAdImage([AdImage.Fields.Hash], {
        bytes: byte,
      });

      const { type, resource, resourceThumbnail, ...property } = el;
      return {
        video_id: video._data.id,
        image_hash: data._data.images.bytes.hash,
        ...property,
      };
    }
  });
};
export const updateCampaignById = async (campaign_id, newValue) => {
  const { name, status, totalBudget, campaignObjective } = newValue;
  const campaign = new Campaign(campaign_id, {
    fields: Campaign.fields,
  });
  await campaign.get();

  name ? (campaign.name = name) : "";
  status !== undefined ? (campaign.status = status ? "ACTIVE" : "PAUSED") : "";
  totalBudget ? (campaign.lifetime_budget = totalBudget) : "";
  campaignObjective ? (campaign.objective = campaignObjective) : "";

  await campaign.update();

  console.log("Campaign updated:", campaign._data);
};

export const updateAdSetById = async (adset_id, newValue) => {
  const {
    name,
    optimizationGoal,
    billingEvent,
    startDate,
    endDate,
    status,
    bidAmount,
    targeting,
  } = newValue;

  const adset = new AdSet(adset_id, {
    fields: AdSet.fields,
  });

  await adset.get();
  name ? (adset.name = name) : "";
  optimizationGoal ? (adset.optimization_goal = optimizationGoal) : "";
  billingEvent ? (adset.billing_event = billingEvent) : "";
  startDate ? (adset.start_time = startDate) : "";
  endDate ? (adset.end_time = endDate) : "";
  status ? (adset.status = AdSet.Status[status.toUpperCase()]) : "";
  bidAmount ? (adset.bid_amount = bidAmount) : "";
  targeting ? (adset.targeting = targeting) : "";

  await adset.update();

  console.log("AdSet updated:", adset._data);
};
export const updateAdById = async (ad_id, newValue, facebookClient) => {
  const { contents, name, link, message, pageId, description, status } =
    newValue;
  let creative = "";
  if (contents?.length) {
    const child_attachments = await Promise.all(
      uploadContent(contents, facebookClient)
    );

    let dataAd = {
      name,
      object_story_spec: {
        page_id: pageId,
        link_data: {
          message,
          link,
          name,
          description,
          child_attachments,
        },
      },
    };
    if (contents.length == 1) {
      if (contents[0].type == "VIDEO") {
        const { description, title, link, ...property } = child_attachments[0];
        dataAd = {
          name,
          object_story_spec: {
            page_id: pageId,
            video_data: { ...property },
          },
        };
      } else {
        const { title, ...property } = child_attachments[0];
        dataAd = {
          name,
          object_story_spec: {
            page_id: pageId,
            link_data: { ...property, name: title },
          },
        };
      }
    }

    creative = await facebookClient.createAdCreative([], dataAd);
    creative = creative._data.id;
  }

  const ad = new Ad(ad_id);
  const updateData = {
    status: status ? "ACTIVE" : "PAUSED",
  };

  if (name) {
    updateData.name = name;
  }

  if (creative) {
    updateData.creative = {
      creative_id: creative,
    };
  }

  await ad.update([], updateData);

  return ad_id;
};
export const querySearch = async (arr, contex, access_token) => {
  const result = await Promise.all(
    arr.map((el) =>
      axios
        .get(`${process.env.GRAPH_API_FACEBOOK}/search`, {
          params: {
            access_token,
            q: el,
            type: contex,
          },
        })
        .then((res) => res.data.data)
    )
  );
  return result.flatMap((el) => el);
};

export const getStatisticById = async (searchId, context) => {
  const data =
    context == "Campaign"
      ? new Campaign(searchId)
      : context == "Adset"
      ? new AdSet(searchId)
      : new Ad(searchId);

  const insightsFields = ["impressions", "spend", "clicks", "actions"];
  const insights = await data.getInsights(insightsFields);

  return insights;
};
