import express from "express";
import { Configuration } from "../server/features/common/config";
import { salesforceConnectionWithToken } from "./repositories/salesforceConnection";
import { CostCategoryRepository } from "./repositories";
import { Logger } from "../server/features/common/logger";
import { AppError } from "./features/common";
import { ErrorCode } from "../types";

export const router = express.Router();

const endpoint = "/api/health";
const logger = new Logger();

export const health = async () => {
  const salesforce = await new CostCategoryRepository(() => salesforceConnectionWithToken({
    clientId: Configuration.salesforce.clientId,
    connectionUrl: Configuration.salesforce.connectionUrl,
    currentUsername: Configuration.salesforce.serivceUsername
  }))
    .getAll()
    .then(_ => true)
    .catch(e => {
      logger.error("SALESFORCE HEALTH CHECK", new AppError(ErrorCode.UNKNOWN_ERROR, e.message, e));
      return false;
    });

  const status = salesforce ? 200 : 500;
  const response = { salesforce };
  return { status, response };
};

// health check endpoint tests dependencies ie slaesforce connection
router.get(`${endpoint}/details`, async (req, res) => {
  const result = await health();
  logger.debug("HEALTH CHECK COMPLETE", result);
  return res.status(result.status).send(result.response);
});

// general ok endpoint
router.get(endpoint, (req, res) => res.send(true));
