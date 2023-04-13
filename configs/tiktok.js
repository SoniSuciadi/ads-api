import axios from "axios";

export const tiktokClient = (token) =>
  axios.create({
    baseURL: process.env.BASE_URL_TIKTOK,
    headers: {
      "Content-Type": "application/json",
      "Access-Token": token,
    },
  });
