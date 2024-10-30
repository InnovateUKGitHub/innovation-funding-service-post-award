import { Cache } from "@innovateuk/common/Cache";
import { configuration } from "@server/features/common/config";
import { TsforceConnection } from "@innovateuk/tsforce/TsforceConnection";
import {
  getSalesforceAccessToken,
  TsforceTokenInfo,
  TsforceSalesforceAccessTokenProps,
} from "@innovateuk/tsforce/TsforceToken";

export const tokenCache = new Cache<TsforceTokenInfo>(configuration.timeouts.token);

export const getSalesforceConnection = async ({
  email,
  traceId,
  clientId,
  connectionUrl,
}: {
  email: string;
  traceId: string;
  clientId: string;
  connectionUrl: string;
}) => {
  const { accessToken, url } = await getCachedSalesforceAccessToken({
    clientId,
    connectionUrl,
    currentUsername: email,
    privateKey: configuration.certificates.salesforce,
  });

  return new TsforceConnection({
    accessToken,
    instanceUrl: url,
    email,
    traceId,
  });
};

export const getCachedSalesforceAccessToken = async (
  salesforceDetails: TsforceSalesforceAccessTokenProps,
): Promise<TsforceTokenInfo> => {
  const fetchToken = () => getSalesforceAccessToken(salesforceDetails);
  return tokenCache.fetchAsync(salesforceDetails.currentUsername, fetchToken);
};

export const salesforceConnectionWithToken = async (
  salesforceDetails: TsforceSalesforceAccessTokenProps,
  traceId: string,
): Promise<TsforceConnection> => {
  return getCachedSalesforceAccessToken(salesforceDetails).then(
    signedToken =>
      new TsforceConnection({
        accessToken: signedToken.accessToken,
        instanceUrl: signedToken.url,
        email: salesforceDetails.currentUsername,
        traceId,
      }),
  );
};
