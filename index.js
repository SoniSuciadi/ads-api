import "dotenv/config";
import express from "express";
import cors from "cors";
import morganHttpLogger from "./logger/http-logger.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import routers from "./routers/index.js";
import bodyParser from "body-parser";

const PORT = process.env.PORT || 80;

const app = express();

app.use(cors());
app.use((req, res, next) => {
  console.log(req.headers, "--------------------");
  next();
});
app.use(morganHttpLogger);
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use("/", routers);
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port : ${PORT}`));
