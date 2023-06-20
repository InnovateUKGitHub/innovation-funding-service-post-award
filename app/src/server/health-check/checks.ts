import { getSalesforceAccessToken } from "@server/repositories/salesforceConnection";
import { HealthCheckResult } from "@server/health-check/health-check.interface";
import { ILogger } from "@shared/developmentLogger";
import { ErrorCode } from "@framework/constants/enums";
import { configuration } from "@server/features/common/config";
import { CompaniesHouse } from "@server/repositories/companiesRepository";
import { AppError } from "@shared/appError";

/**
 * Checks the health of the salesforce connection
 */
export async function checkSalesforce(logger: ILogger): Promise<HealthCheckResult> {
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    logger.error("GOOGLE ANALYTICS HEALTH CHECK", new AppError(ErrorCode.UNKNOWN_ERROR, error.message, error));

    return { ...check, status: "Failed", error };
  }
}

/**
 * checks the health of the companies house connection
 */
export async function checkCompaniesHouse(logger: ILogger): Promise<HealthCheckResult> {
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
