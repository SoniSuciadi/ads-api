import express from "express";
import mettaRouter from "./metta/index.js";
const routers = express.Router();

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
routers.use("/meta", mettaRouter);

export default routers;
