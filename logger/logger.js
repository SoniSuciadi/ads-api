import { config, createLogger, format, transports } from "winston";
const { combine, timestamp, printf, prettyPrint, colorize, errors } = format;

const options = {
  file: {
    level: "info",
    filename: "./app.log",
    handleExceptions: true,
    json: false,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
  },
  console: {
    level: "debug",
    handleExceptions: true,
    json: false,
    colorize: false,
  },
};

export const httpLogger = createLogger({
  levels: config.npm.levels,
  format: combine(errors({ stack: true }), prettyPrint(), colorize()),
  transports: [new transports.Console(options.console)],
  exitOnError: false,
});

export const httpLoggerInfo = createLogger({
  levels: config.npm.levels,
  format: combine(errors({ stack: true }), prettyPrint(), colorize()),
  transports: [new transports.Console(options.console)],
  exitOnError: false,
});
