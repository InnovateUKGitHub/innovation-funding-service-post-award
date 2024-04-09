import { Router, Request, Response } from "express";
import { Logger } from "@shared/developmentLogger";
import { ILogger } from "@shared/logger";
import { configuration } from "./features/common/config";
import { checkSalesforce, checkGoogleAnalytics, checkCompaniesHouse } from "./healthCheck/checks";
import { HealthCheckResult } from "./healthCheck/checks";

export const healthRouter: Router = Router();
const healthCheckLogger = new Logger("Health check");

const getHealthIndex = async (req: Request, res: Response) => {
  const { originalUrl } = req;

  const healthDirectory = [
    {
      name: "Health Directory",
      endpoint: originalUrl,
    },
    {
      name: "details",
      endpoint: originalUrl + "details",
    },
    {
      name: "version",
      endpoint: originalUrl + "version",
    },
  ];

  res.json(healthDirectory);
};

export const health = async (
  logger: ILogger,
): Promise<{
  status: number;
  response: Record<string, HealthCheckResult>;
}> => {
  const healthEndpoints: Promise<HealthCheckResult>[] = [
    checkSalesforce(logger),
    checkGoogleAnalytics(logger),
    checkCompaniesHouse(logger),
  ];

  const settledResponse = (await Promise.allSettled(healthEndpoints)) as PromiseFulfilledResult<HealthCheckResult>[];
  const hasInvalidResponse = settledResponse.some(result => result.value.status === "Failed");

  // Note: Derive order from array index and payload from HealthCheckResult
  const response = settledResponse.reduce((results, { value }) => {
    const { id, ...payload } = value;
    return { ...results, [id]: payload };
  }, {});

  const healthCheckResponse = {
    status: hasInvalidResponse ? 500 : 200,
    response,
  };

  if (hasInvalidResponse) logger.error("A health check has failed to execute.", healthCheckResponse);

  return healthCheckResponse;
};

const getHealthCheck = async (_req: Request, res: Response) => {
  const { status, response } = await health(healthCheckLogger);

  healthCheckLogger.debug("Health check completed.", { status, response });

  return res.status(status).json(response);
};

const getBuildVersion = (_req: Request, res: Response) => res.send(configuration.build);

healthRouter.get("/", getHealthIndex);
healthRouter.get("/details", getHealthCheck);
healthRouter.get("/version", getBuildVersion);
