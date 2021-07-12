import Express from "express";

import { ErrorCode } from "@framework/types";
import { configuration, ILogger, Logger, AppError } from "@server/features/common";
import { getSalesforceAccessToken } from "@server/repositories/salesforceConnection";
import { CompaniesHouse } from "@server/resources/companiesHouse";

export const router = Express.Router();

const endpoint = "/api/health";

type HealthCheckResult = "Success" | "Failed" | "Not Applicable";

const checkSalesforce = async (logger: ILogger) => {
  const tokenPayload = {
    clientId: configuration.salesforce.clientId,
    connectionUrl: configuration.salesforce.connectionUrl,
    currentUsername: configuration.salesforce.serviceUsername,
  };

  try {
    await getSalesforceAccessToken(tokenPayload);

    return Promise.resolve<HealthCheckResult>("Success");
  } catch (error) {
    logger.error("SALESFORCE HEALTH CHECK", new AppError(ErrorCode.UNKNOWN_ERROR, error.message, error));

    return Promise.resolve<HealthCheckResult>("Failed");
  }
};

const checkGoogleAnalytics = async (logger: ILogger) => {
  if (!configuration.googleTagManagerCode) {
    return Promise.resolve<HealthCheckResult>("Not Applicable");
  }

  try {
    const tagManagerEndpoint = `https://www.googletagmanager.com/ns.html?id=${configuration.googleTagManagerCode}`;
    const response = await fetch(tagManagerEndpoint);

    if (!response.ok) throw new Error(`Failed get request to ${tagManagerEndpoint}`);

    return "Success";
  } catch (error) {
    logger.error("GOOGLE ANALYTICS HEALTH CHECK", new AppError(ErrorCode.UNKNOWN_ERROR, error.message, error));

    return "Failed";
  }
};

const checkCompaniesHouse = async (logger: ILogger) => {
  try {
    await new CompaniesHouse().searchCompany("test");

    return "Success";
  } catch (error) {
    logger.error("COMPANIES HOUSE HEALTH CHECK", new AppError(ErrorCode.UNKNOWN_ERROR, error.message, error));

    return "Failed";
  }
};

export const health = async (logger: ILogger) => {
  const healthEndpoints: Promise<HealthCheckResult>[] = [
    checkSalesforce(logger),
    checkGoogleAnalytics(logger),
    checkCompaniesHouse(logger),
  ];

  const response = await Promise.all<HealthCheckResult>(healthEndpoints);
  const [salesforce, googleAnalytics, companiesHouse] = response;

  const hasInvalidResponse = response.some(x => x === "Failed");

  return {
    status: hasInvalidResponse ? 500 : 200,
    response: {
      salesforce,
      googleAnalytics,
      companiesHouse,
    },
  };
};

// health check endpoint tests dependencies ie salesforce connection
router.get(`${endpoint}/details`, async (_req, res) => {
  const logger = new Logger("Health check");

  const { status, response } = await health(logger);

  logger.debug("HEALTH CHECK COMPLETE", { status, response });

  return res.status(status).send(response);
});

// version endpoint
router.get(`${endpoint}/version`, (_req, res) => res.send(configuration.build));

// general ok endpoint
router.get(endpoint, (_req, res) => res.send(true));
