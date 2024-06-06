import { Router, Request, Response } from "express";
import { Logger } from "@shared/developmentLogger";
import { configuration } from "./features/common/config";
import {
  checkSalesforce,
  checkGoogleAnalytics,
  checkCompaniesHouse,
  CombinedHealthCheckResult,
} from "./healthCheck/checks";
import { Cache } from "./features/common/cache";

export const healthRouter: Router = Router();
const healthCheckLogger = new Logger("Health check");

// Ensure Health Check can only be checked every 3 minutes
const healthCheckCache = new Cache<CombinedHealthCheckResult>(3);

const health = async (): Promise<CombinedHealthCheckResult> => {
  const [salesforce, googleAnalytics, companiesHouse] = await Promise.all([
    checkSalesforce(healthCheckLogger),
    checkGoogleAnalytics(healthCheckLogger),
    checkCompaniesHouse(healthCheckLogger),
  ]);

  const results = { salesforce, googleAnalytics, companiesHouse };
  const success = [salesforce, googleAnalytics, companiesHouse].every(x => x.status === "Success");

  if (newrelic) {
    newrelic.recordCustomEvent("ACCHealthCheck", {
      env: configuration.newRelic.appName,
      results: JSON.stringify(results),
      success,
    });
  }

  healthCheckLogger.info("Health check complete:", { results, success });

  return { results, success, lastChecked: new Date() };
};

healthRouter
  .get("/details", async (_req: Request, res: Response) => {
    const healthCheck = await healthCheckCache.fetchAsync("health", health);
    return res.status(healthCheck.success ? 200 : 500).json(healthCheck);
  })
  .get("/version", (req, res) => {
    res.json(configuration.build);
  });
