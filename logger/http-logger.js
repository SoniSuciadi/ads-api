import morgan from "morgan";
import morganJson from "morgan-json";
import { httpLogger, httpLoggerInfo } from "./logger.js";

const format = morganJson({
  method: ":method",
  url: ":url",
  status: ":status",
  contentLength: ":res[content-length]",
  responseTime: ":response-time",
  userAgent: ":user-agent",
  remoteAddr: ":remote-addr",
  remoteAddrForwarded: ":req[x-forwarded-for]",
  referrer: ":referrer",
});

const morganHttpLogger = morgan(format, {
  stream: {
    write: (message) => {
      const {
        method,
        url,
        status,
        contentLength,
        responseTime,
        userAgent,
        remoteAddr,
        remoteAddrForwarded,
        referrer,
      } = JSON.parse(message);

      const objLog = {
        name: "HTTP_ACCESS_LOG",
        timestamp: new Date().toString(),
        method,
        url,
        statusCode: Number(status),
        contentLength,
        responseTime: Number(responseTime),
        userAgent,
        remoteAddr,
        remoteAddrForwarded,
        referrer,
      };
      if (status >= 400) {
        httpLogger.error("HTTP_ACCESS_LOG", objLog);
      } else {
        httpLoggerInfo.info("HTTP_ACCESS_LOG", objLog);
      }
    },
  },
});

export default morganHttpLogger;
