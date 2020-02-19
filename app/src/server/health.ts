import express from "express";
import { Configuration } from "../server/features/common/config";
import { salesforceConnectionWithToken } from "./repositories/salesforceConnection";
import { CostCategoryRepository } from "./repositories";
import { ILogger, Logger } from "../server/features/common/logger";
import { AppError } from "./features/common";
import { ErrorCode } from "@framework/types";

export const router = express.Router();

const endpoint = "/api/health";

type HealthCheckResult = "Success" | "Failed" | "Not Applicable";

const checkSalesforce = (logger: ILogger) => {
  const getSalesforceConnection = () => salesforceConnectionWithToken({
    clientId: Configuration.salesforce.clientId,
    connectionUrl: Configuration.salesforce.connectionUrl,
    currentUsername: Configuration.salesforce.serivceUsername
  });

  return new CostCategoryRepository(getSalesforceConnection, logger)
    .getAll()
    .then<HealthCheckResult>(() => "Success")
    .catch<HealthCheckResult>(e => {
      logger.error("SALESFORCE HEALTH CHECK", new AppError(ErrorCode.UNKNOWN_ERROR, e.message, e));
      return "Failed";
    });
};

const checkGoogleAnalytics = (logger: ILogger) => {
  if (!Configuration.googleTagManagerCode) {
    return Promise.resolve<HealthCheckResult>("Not Applicable");
  }

  const url = `https://www.googletagmanager.com/ns.html?id=${Configuration.googleTagManagerCode}`;
  return fetch(url)
    .then<HealthCheckResult>((e) => {
      if (e.ok) {
        return "Success";
      }
      throw new Error(`Failed get request to ${url}`);
    })
    .catch<HealthCheckResult>(e => {
      logger.error("GOOGLE ANALYTICS HEALTH CHECK", new AppError(ErrorCode.UNKNOWN_ERROR, e.message, e));
      return "Failed";
    });
};

export const health = async (logger: ILogger) => {
  const salesforce = checkSalesforce(logger);
  const googleAnalytics = checkGoogleAnalytics(logger);

  const results = await Promise.all<HealthCheckResult>([salesforce, googleAnalytics]);

  // awaits in response are required to get result but will have already run in promise all
  // status calculated from if all results are true or null (ie not applied)
  return {
    status: results.some(x => x === "Failed") ? 500 : 200,
    response: {
      salesforce: await salesforce,
      googleAnalytics: await googleAnalytics
    }
  };
};

// health check endpoint tests dependencies ie salesforce connection
router.get(`${endpoint}/details`, async (req, res) => {
  const logger = new Logger("Health check");
  const result = await health(logger);
  logger.debug("HEALTH CHECK COMPLETE", result);
  return res.status(result.status).send(result.response);
});

// version endpoint
router.get(`${endpoint}/version`, (req, res) => res.send(Configuration.build));

// general ok endpoint
router.get(endpoint, (req, res) => res.send(true));
