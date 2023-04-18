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


app.use(morganHttpLogger);
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  console.log("👻 ~ file: index.js:26 ~ app.get ~ token:", token);

  if (mode === "subscribe" && token === process.env.TOKEN_VERIFICATION) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

app.post("/webhook", (req, res) => {
  const data = req.body;
  console.log(
    "👻 ~ file: index.js:28 ~ app.post ~ data:",
    JSON.stringify(data)
  );

  if (data.object === "page") {
    data.entry.forEach((entry) => {
      entry.messaging.forEach((messagingEvent) => {
        const senderId = messagingEvent.sender.id;
        const message = messagingEvent.message.text;

        if (senderId && message) {
          console.log(`Message received from ${senderId}: ${message}`);
        }
      });
    });

    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});
app.use("/", routers);
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port : ${PORT}`));
