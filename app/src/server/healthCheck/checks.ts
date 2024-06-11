import { ErrorCode } from "@framework/constants/enums";
import { Api } from "@gql/sf/Api";
import { configuration } from "@server/features/common/config";
import { CompaniesHouse } from "@server/repositories/companiesRepository";
import { AppError } from "@shared/appError";
import { ILogger } from "@shared/logger";
import gql from "graphql-tag";

export interface HealthCheckResult {
  id: string;
  status: "Success" | "Failed";
  error?: unknown;
}

export interface CombinedHealthCheckResult {
  results: { salesforce: HealthCheckResult; googleAnalytics: HealthCheckResult; companiesHouse: HealthCheckResult };
  success: boolean;
  lastChecked: Date;
}

/**
 * Checks the health of the salesforce connection
 */
export async function checkSalesforce(logger: ILogger): Promise<HealthCheckResult> {
  const check = { id: "salesforce" };

  try {
    const api = await Api.asSystemUser();
    const soqlTestPromise = api.executeSOQL<{ totalSize: number; done: boolean; records: { Id: string }[] }>({
      query: "SELECT Id FROM User LIMIT 1",
    });
    const gqlTestPromise = api.executeGraphQL<{
      data: { uiapi: { query: { User: { edges: { node: { Id: string } }[] } } } };
    }>({
      document: gql`
        query AccHealthCheckQuery {
          uiapi {
            query {
              User(first: 1) {
                edges {
                  node {
                    Id
                  }
                }
              }
            }
          }
        }
      `,
    });

    const [soqlTest, gqlTest] = await Promise.all([soqlTestPromise, gqlTestPromise]);

    if (!gqlTest?.data?.uiapi?.query?.User?.edges?.length) {
      logger.error("Salesforce Health Check GQL failure");

      return {
        ...check,
        status: "Failed",
        error: "Failed to execute GQL",
      };
    }

    if (!soqlTest.done) {
      logger.error("Salesforce Health Check SOQL failure");

      return {
        ...check,
        status: "Failed",
        error: "Failed to execute SOQL",
      };
    }

    logger.info("Salesforce Health Check success!");

    return { ...check, status: "Success" };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    logger.error("Salesforce Health Check exception", error);

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
