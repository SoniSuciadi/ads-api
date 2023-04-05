import express from "express";
import googleRouter from "./google/index.js";
import mettaRouter from "./metta/index.js";
import tiktokRouter from "./tiktok/index.js";
const routers = express.Router();

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
routers.use("/meta", mettaRouter);
routers.use("/google", googleRouter);
routers.use("/tiktok", tiktokRouter);

export default routers;
