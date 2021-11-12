import { ErrorCode } from "@framework/types";
import { CompaniesHouse } from "@server/repositories";

import { configuration, ILogger, AppError } from "@server/features/common";
import { getSalesforceAccessToken } from "@server/repositories/salesforceConnection";
import { HealthCheckResult } from "@server/health-check/health-check.interface";

export async function checkSalesforce(logger: ILogger): Promise<HealthCheckResult> {
  const check = { id: "salesforce" };

  const tokenPayload = {
    clientId: configuration.salesforce.clientId,
    connectionUrl: configuration.salesforce.connectionUrl,
    currentUsername: configuration.salesforce.serviceUsername,
  };

  try {
    await getSalesforceAccessToken(tokenPayload);

    return { ...check, status: "Success" };
  } catch (error) {
    logger.error("SALESFORCE HEALTH CHECK", new AppError(ErrorCode.UNKNOWN_ERROR, error.tokenError, error));

    return {
      ...check,
      status: "Failed",
      error,
    };
  }
}

export async function checkGoogleAnalytics(logger: ILogger): Promise<HealthCheckResult> {
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
  } catch (error) {
    logger.error("GOOGLE ANALYTICS HEALTH CHECK", new AppError(ErrorCode.UNKNOWN_ERROR, error.message, error));

    return { ...check, status: "Failed", error };
  }
}

export async function checkCompaniesHouse(logger: ILogger): Promise<HealthCheckResult> {
  const check = { id: "companiesHouse" };

  try {
    await new CompaniesHouse().searchCompany({ searchString: "test" });

    return { ...check, status: "Success" };
  } catch (error) {
    logger.error("COMPANIES HOUSE HEALTH CHECK", new AppError(ErrorCode.UNKNOWN_ERROR, error.message, error));

    return { ...check, status: "Failed", error };
  }
}
