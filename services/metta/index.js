import axios from "axios";
import {
  Campaign,
  AdSet,
  AdImage,
  Ad,
  AdAccount,
} from "facebook-nodejs-business-sdk";

import { fetchUrltoBytes } from "../../helpers/fetchImageByte.js";

export const createCampaign = async (data, facebookClient) => {
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
    promoted_object,
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
      [AdSet.Fields.promoted_object]: promoted_object,
    })
  );
  return response._data.id;
};
export const createAd = async (data, facebookClient, token) => {
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
    } else if (contents[0].type == "FORM") {
      const result = await createLeadGenForm(contents[0], pageId, token);

      dataAd = {
        name,
        object_story_spec: {
          page_id: pageId,
          template_data: {
            call_to_action: {
              type: "LEARN_MORE",
              value: {
                lead_gen_form_id: result || "1001204414190821",
              },
            },
            link: contents[0].link,
            name: name,
            description: contents[0].description,
          },
        },
      };
    } else if (contents[0].type == "BOOST POST") {
      const { resource } = contents[0];

      dataAd = {
        name,
        object_story_spec: {
          page_id: pageId,
          link_data: { link: resource },
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
      } else if (contents[0].type == "FORM") {
        const result = await createLeadGenForm(contents[0], pageId, token);

        dataAd = {
          name,
          object_story_spec: {
            page_id: pageId,
            template_data: {
              call_to_action: {
                type: "LEARN_MORE",
                value: {
                  lead_gen_form_id: result || "1001204414190821",
                },
              },
              link: contents[0].link,
              name: name,
              description: contents[0].description,
            },
          },
        };
      } else if (contents[0].type == "BOOST POST") {
        const { resource } = contents[0];

        dataAd = {
          name,
          object_story_spec: {
            page_id: pageId,
            link_data: { link: resource },
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
export const querySearch = async (arr, contex, token) => {
  const result = await Promise.all(
    arr.map((el) =>
      axios
        .get(`${process.env.GRAPH_API_FACEBOOK}/search`, {
          params: {
            access_token: token,
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

const createLeadGenForm = async (formPayload, pageId, accessToken) => {
  const url = `${process.env.GRAPH_API_FACEBOOK}/${pageId}/leadgen_forms?access_token=${accessToken}`;

  const { data } = await axios.post(url, formPayload);
  return data.id;
};

export const fetchAllAds = async (facebookClient) => {
  const data = await facebookClient
    .getAds([
      Ad.Fields.campaign_id,
      Ad.Fields.campaign,
      Ad.Fields.adset_id,
      Ad.Fields.adset,
      Ad.Fields.id,
      Ad.Fields.name,
      Ad.Fields.tracking_specs,
      Ad.Fields.status,
    ])
    .then((ad) =>
      ad.map((el) => ({
        campaignId: el._data.campaign_id,
        adSetId: el._data.adset_id,
        id: el._data.id,
        name: el._data.name,
        status: el._data.status,
      }))
    );

  return data;
};
export const fetchCommentById = async (postId, access_token_page) => {
  const data = await axios.get(
    `${process.env.GRAPH_API_FACEBOOK}/${postId}/comments?access_token=${access_token_page}`
  );
  return data.data.data;
};
export const getAllInstagramPost = async (accountId, access_token_page) => {
  const data = await axios.get(
    `${process.env.GRAPH_API_FACEBOOK}/${accountId}/media?access_token=${access_token_page}`
  );
  return data.data.data;
};
export const replyCommentPosting = async (
  commentId,
  access_token_page,
  message,
  socialMedia
) => {
  const data = await axios.post(
    `${process.env.GRAPH_API_FACEBOOK}/${commentId}/${
      socialMedia != "Instagram" ? "comments" : "replies"
    }?access_token=${access_token_page}`,
    { message }
  );
  return data.data.data;
};
