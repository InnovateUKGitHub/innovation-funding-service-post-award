import { ErrorCode } from "@framework/types";
import { CompaniesHouse } from "@server/repositories";

import { configuration, AppError } from "@server/features/common";
import { getSalesforceAccessToken } from "@server/repositories/salesforceConnection";
import { HealthCheckResult } from "@server/health-check/health-check.interface";
import { Logger } from "@shared/developmentLogger";

const logger = new Logger("Health checker");

/**
 * Checks the health of the salesforce connection
 */
export async function checkSalesforce(): Promise<HealthCheckResult> {
  const check = { id: "salesforce" };

  const tokenPayload = {
    clientId: configuration.salesforceServiceUser.clientId,
    connectionUrl: configuration.salesforceServiceUser.connectionUrl,
    currentUsername: configuration.salesforceServiceUser.serviceUsername,
  };

  try {
    await getSalesforceAccessToken(tokenPayload);

    return { ...check, status: "Success" };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    logger.error("SALESFORCE HEALTH CHECK", new AppError(ErrorCode.UNKNOWN_ERROR, error.tokenError, error));

    return {
      ...check,
      status: "Failed",
      error,
    };
  }
}

/**
 * checks the health of the google analytics connection
 */
export async function checkGoogleAnalytics(): Promise<HealthCheckResult> {
  const check = { id: "googleAnalytics" };

  if (!configuration.googleTagManagerCode) {
    return {
      ...check,
      status: "Failed",
      error: "No configuration was supplied.",
    };
  }

  try {
    const tagManagerEndpoint = `https://www.googletagmanager.com/ns.html?id=${configuration.googleTagManagerCode}`;
    const response = await fetch(tagManagerEndpoint);

    if (!response.ok) throw new Error(`Failed get request to ${tagManagerEndpoint}`);

    return { ...check, status: "Success" };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    logger.error("GOOGLE ANALYTICS HEALTH CHECK", new AppError(ErrorCode.UNKNOWN_ERROR, error.message, error));

    return { ...check, status: "Failed", error };
  }
}

/**
 * checks the health of the companies house connection
 */
export async function checkCompaniesHouse(): Promise<HealthCheckResult> {
  const check = { id: "companiesHouse" };

  try {
    await new CompaniesHouse().searchCompany({ searchString: "test" });

    return { ...check, status: "Success" };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    logger.error("COMPANIES HOUSE HEALTH CHECK", new AppError(ErrorCode.UNKNOWN_ERROR, error.message, error));

    return { ...check, status: "Failed", error };
  }
}
