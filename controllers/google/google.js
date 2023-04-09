import { client } from "../../configs/google.js";
import { createNewCampaign } from "../../services/google/index.js";

export const createCampaign = async (req, res, next) => {
  try {
    createNewCampaign("8360232056", client);

    res.status(200).json({
      messsage: `Success`,
    });
  } catch (error) {

    next(error);
  }
};
