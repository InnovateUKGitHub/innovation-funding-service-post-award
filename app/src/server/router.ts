import { getGraphQLSchema } from "@gql/getGraphQLSchema";
import { createContext } from "@gql/GraphQLContext";
import { Api } from "@gql/sfdc-graphql-endpoint/src/sfdc/api";
import { Connection } from "@gql/sfdc-graphql-endpoint/src/sfdc/connection";
import { router as apiRoutes } from "@server/apis";
import { componentGuideRender } from "@server/componentGuideRender";
import { configureFormRouter } from "@server/forms/formRouter";
import { healthRouter } from "@server/health";
import { serverRender } from "@server/serverRender";
import { NotFoundError } from "@shared/appError";
import { Logger } from "@shared/developmentLogger";
import { isAccDevOrDemo, isLocalDevelopment } from "@shared/isEnv";
import csrf from "csurf";
import { Router } from "express";
import { createHandler } from "graphql-http/lib/use/express";
import { configuration } from "./features/common";
import { getSalesforceAccessToken } from "./repositories/salesforceConnection";

export const noAuthRouter = Router();

// Support routes
noAuthRouter.use("/api/health", healthRouter);

const getServerRoutes = async () => {
  const router = Router();
  const logger = new Logger("Router");

  const csrfProtection = csrf();

  // Obtain a Salesforce access token and URL
  const { accessToken, url } = await getSalesforceAccessToken({
    clientId: configuration.salesforceServiceUser.clientId,
    connectionUrl: configuration.salesforceServiceUser.connectionUrl,
    currentUsername: configuration.salesforceServiceUser.serviceUsername,
  });

  // Create a new Connection and API object to fetch Salesforce data from.
  const adminConnection = new Connection({
    instanceUrl: url,
    accessToken,
    email: configuration.salesforceServiceUser.serviceUsername,
  });
  const adminApi = new Api({ connection: adminConnection });
  const schema = await getGraphQLSchema({ connection: adminConnection, api: adminApi });

  router.use(async (req, res, next) => {
    // Obtain a Salesforce access token and URL
    try {
      const { accessToken, url } = await getSalesforceAccessToken({
        clientId: configuration.salesforceServiceUser.clientId,
        connectionUrl: configuration.salesforceServiceUser.connectionUrl,
        currentUsername: req.session?.user.email,
      });

      const email = req.session?.user.email ?? null;

      // Create a new Connection and API object to fetch Salesforce data from.
      const connection = new Connection({ instanceUrl: url, accessToken, email });
      const api = new Api({ connection });

      res.locals.connection = connection;
      res.locals.api = api;
      res.locals.schema = schema;
      res.locals.email = email;
    } catch {
      res.locals.schema = schema;
      res.locals.email = null;
    }

    next();
  });

  // App routes
  router.use("/api", apiRoutes);
  router.use("/graphql", (req, res, next) => {
    logger.debug("Executing GraphQL", res.locals.email);

    // Allow the override of the user email if `sudo` is included.
    if (!configuration.sso.enabled && typeof req.query.sudo === "string") {
      res.locals.email = req.query.sudo;
      const connection = new Connection({ instanceUrl: url, accessToken, email: req.query.sudo });
      const api = new Api({ connection });

      res.locals.connection = connection;
      res.locals.api = api;
    }

    createHandler({
      schema: schema,
      context: createContext({ logger: new Logger("Client GraphQL"), res }),
    })(req, res, next);
  });

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
