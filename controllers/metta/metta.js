import { facebookConfig } from "../../configs/facebook.js";
import {
  createAd,
  createAdset,
  createCampaign,
  featchAllMessages,
  fetchAllAds,
  fetchCommentById,
  getAllInstagramPost,
  getChats,
  getStatisticById,
  querySearch,
  replyCommentPosting,
  sendOneChat,
  updateAdById,
  updateAdSetById,
  updateCampaignById,
} from "../../services/metta/index.js";

export const createNewCampaign = async (req, res, next) => {
  const { ad_account } = req.params;
  const { token } = req.headers;
  console.log(
    "👻 ~ file: metta.js:20 ~ createNewCampaign ~ token:",
    req.headers,
    "dari req heder"
  );

  try {
    const facebookClient = await facebookConfig(token, ad_account);
    const campaignId = await createCampaign(req.body, facebookClient);
    res.status(200).json({
      msg: `Success create campaign with name ${req.body.name}`,
      id: campaignId,
    });
  } catch (error) {
    next(error);
  }
};
export const createNewAdset = async (req, res, next) => {
  const { ad_account } = req.params;
  const { token } = req.headers;
  try {
    const facebookClient = facebookConfig(token, ad_account);
    const adsetId = await createAdset(req.body, facebookClient);
    res.status(200).json({
      msg: `Success create adset with name ${req.body.name}`,
      id: adsetId,
    });
  } catch (error) {
    next(error);
  }
};
export const createAds = async (req, res, next) => {
  const { ad_account } = req.params;
  const { token } = req.headers;
  try {
    const facebookClient = facebookConfig(token, ad_account);
    const data = await createAd(req.body, facebookClient, token);

    res.status(200).json({
      messsage: `Berhasil membuat iklan dengan nama ${req.body.name}`,
      id: data,
    });
  } catch (error) {
    next(error);
  }
};
export const updateCampaign = async (req, res, next) => {
  const { ad_account, campaign_id } = req.params;
  const { token } = req.headers;
  try {
    facebookConfig(token, ad_account);
    await updateCampaignById(campaign_id, req.body);

    res.status(200).json({
      messsage: `Berhasil mengubah campaign `,
    });
  } catch (error) {
    next(error);
  }
};
export const updateAdset = async (req, res, next) => {
  const { ad_account, adset_id } = req.params;
  const { token } = req.headers;
  try {
    facebookConfig(token, ad_account);
    await updateAdSetById(adset_id, req.body);

    res.status(200).json({
      messsage: `Berhasil mengubah adset`,
    });
  } catch (error) {
    next(error);
  }
};
export const updateAds = async (req, res, next) => {
  const { ad_account, ad_id } = req.params;

  const { token } = req.headers;
  try {
    const facebookClient = facebookConfig(token, ad_account);

    await updateAdById(ad_id, req.body, facebookClient);

    res.status(200).json({
      messsage: `Berhasil mengubah Ad`,
    });
  } catch (error) {
    next(error);
  }
};
export const getLocationTargeting = async (req, res, next) => {
  const { ad_account } = req.params;
  const { city } = req.query;

  const { token } = req.headers;
  try {
    facebookConfig(token, ad_account);

    const result = await querySearch(city.split(","), "adgeolocation", token);

    res.status(200).json({
      messsage: `Success`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
export const getInterestTargeting = async (req, res, next) => {
  const { ad_account } = req.params;
  const { interest } = req.query;

  const { token } = req.headers;
  try {
    facebookConfig(token, ad_account);

    const result = await querySearch(interest.split(","), "adinterest", token);

    res.status(200).json({
      messsage: `Success`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
export const getStatisticCampaign = async (req, res, next) => {
  const { campaign_id } = req.params;
  const { token } = req.headers;
  try {
    facebookConfig(token);
    const result = await getStatisticById(campaign_id, "Campaign");
    res.status(200).json({
      messsage: `Success`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
export const getStatisticAdset = async (req, res, next) => {
  const { adset_id } = req.params;
  const { token } = req.headers;
  try {
    facebookConfig(token);
    const result = await getStatisticById(adset_id, "Adset");
    res.status(200).json({
      messsage: `Success`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
export const getStatisticAd = async (req, res, next) => {
  const { ad_id } = req.params;
  const { token } = req.headers;
  try {
    facebookConfig(token);
    const result = await getStatisticById(ad_id, "ad");
    res.status(200).json({
      messsage: `Success`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
export const getAllAds = async (req, res, next) => {
  const { ad_account } = req.params;
  const { token } = req.headers;
  try {
    const facebookClient = facebookConfig(token, ad_account);

    const result = await fetchAllAds(facebookClient);
    res.status(200).json({
      messsage: `Success`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
export const getComments = async (req, res, next) => {
  const { postId, access_token_page } = req.query;
  try {
    const result = await fetchCommentById(postId, access_token_page);
    res.status(200).json({
      messsage: `Success`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
export const getInstagramPost = async (req, res, next) => {
  const { access_token_page, accountId } = req.query;
  try {
    const result = await getAllInstagramPost(accountId, access_token_page);
    res.status(200).json({
      messsage: `Success`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
export const replyComment = async (req, res, next) => {
  const { access_token_page, commentId, socialMedia } = req.query;
  const { message } = req.body;
  try {
    const result = await replyCommentPosting(
      commentId,
      access_token_page,
      message,
      socialMedia
    );
    res.status(200).json({
      messsage: `Success`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (req, res, next) => {
  const { page_id } = req.params;
  const { access_token_page } = req.query;
  try {
    const data = await featchAllMessages(access_token_page, page_id);
    res.status(200).json({
      messsage: `Success`,
      data,
    });
  } catch (error) {
    next(error);
  }
};
export const getChatUser = async (req, res, next) => {
  const { page_id, user_id } = req.params;
  const { access_token_page } = req.query;
  try {
    const data = await getChats(access_token_page, page_id, user_id);
    res.status(200).json({
      messsage: `Success`,
      data,
    });
  } catch (error) {
    next(error);
  }
};
export const sendChat = async (req, res, next) => {
  const { page_id, user_id } = req.params;
  const { access_token_page } = req.query;
  const { message } = req.body;

  try {
    const data = await sendOneChat(
      access_token_page,
      page_id,
      user_id,
      message
    );
    res.status(200).json({
      messsage: `Success`,
      data,
    });
  } catch (error) {
    next(error);
  }
};
