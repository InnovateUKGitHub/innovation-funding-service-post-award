import winston, { transports, format } from "winston";

const baseLogger = winston.createLogger({
  level: "info",
  format: format.json(),
  defaultMeta: { service: "sirloadalot" },
  transports: [
    new transports.File({ filename: "sirloadalot.log" }),
    new transports.Console({
      format: format.simple(),
    }),
  ],
});

export { baseLogger };
