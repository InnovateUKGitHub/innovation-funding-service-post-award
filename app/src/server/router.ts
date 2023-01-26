import { Router } from "express";
import csrf from "csurf";

import { healthRouter } from "@server/health";
import { router as apiRoutes } from "@server/apis";

import { configureFormRouter } from "@server/forms/formRouter";
import { NotFoundError } from "@shared/appError";
import { serverRender } from "@server/serverRender";
import { componentGuideRender } from "@server/componentGuideRender";
import { isAccDevOrDemo, isLocalDevelopment } from "@shared/isEnv";
import { getGraphQLRoutes } from "@gql/getGraphQLExpressRoutes";
import { getSalesforceAccessToken } from "./repositories/salesforceConnection";
import { configuration } from "./features/common";
import { Connection } from "@gql/sfdc-graphql-endpoint/src/sfdc/connection";
import { Api } from "@gql/sfdc-graphql-endpoint/src/sfdc/api";
import { getGraphQLSchema } from "@gql/getGraphQLSchema";
import { Logger } from "@shared/developmentLogger";
import { isSalesforceTokenError, SalesforceTokenError } from "./repositories";

export const noAuthRouter = Router();
const logger = new Logger("Router");

// Support routes
noAuthRouter.use("/api/health", healthRouter);

const getServerRoutes = async () => {
  const router = Router();

  const csrfProtection = csrf();

  let connection: Connection | undefined;
  let api: Api | undefined;

  try {
    // Obtain a Salesforce access token and URL
    const { accessToken, url } = await getSalesforceAccessToken({
      clientId: configuration.salesforceServiceUser.clientId,
      connectionUrl: configuration.salesforceServiceUser.connectionUrl,
      currentUsername: configuration.salesforceServiceUser.serviceUsername,
    });

    // Create a new Connection and API object to fetch Salesforce data from.
    connection = new Connection({ instanceUrl: url, accessToken });
    api = new Api({ connection });
  } catch (e: unknown) {
    if (isSalesforceTokenError(e)) {
      logger.error("Failed to connect to Salesforce.", e, e.tokenError);
    } else {
      logger.error("Failed to connect to Salesforce.", e);
    }
  }

  const schema = await getGraphQLSchema({ connection, api });

  // App routes
  router.use("/api", apiRoutes);
  router.use(await getGraphQLRoutes({ schema, connection, api }));

  // Only enable the components page if we're in development mode.
  if (isAccDevOrDemo || isLocalDevelopment) {
    router.use("/components", csrfProtection, componentGuideRender);
  }

  // Form posts
  router.post("*", configureFormRouter({ schema })(csrfProtection));
  router.get("*", csrfProtection, (req, res) => serverRender({ schema })(req, res));

  // Fallback route
  router.all("*", (req, res) => serverRender({ schema })(req, res, new NotFoundError()));

  return router;
};

export { getServerRoutes };
