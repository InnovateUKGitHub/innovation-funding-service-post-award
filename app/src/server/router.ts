import { getGraphQLSchema } from "@gql/getGraphQLSchema";
import { createContext } from "@gql/GraphQLContext";
import { Api } from "@gql/sf/Api";
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

let index = 0;
export const noAuthRouter = Router();

// Support routes
noAuthRouter.use("/api/health", healthRouter);

const getServerRoutes = async () => {
  const router = Router();
  const logger = new Logger("Router");

  const csrfProtection = csrf();

  const adminApi = await Api.asSystemUser();
  const schema = await getGraphQLSchema({ api: adminApi });

  router.use(async (req, res, next) => {
    // Obtain a Salesforce access token and URL
    console.log("fetching sf access token");
    try {
      const email = req.session?.user.email ?? null;

      if (email) {
        const api = await Api.asUser(email);

        res.locals.api = api;
        res.locals.email = email;
        console.log("setting api email as ", res.locals.email);
      }
    } catch {
      res.locals.email = null;
    }

    next();
  });

  // App routes
  router.use("/api", apiRoutes);
  router.use("/graphql", async (req, res, next) => {
    // Allow the override of the user email if `sudo` is included.

    let api: Api;

    console.log(`\n===\ngraphql request: ${index++}\n======`);
    if (!configuration.sso.enabled && typeof req.query.sudo === "string") {
      res.locals.email = req.query.sudo;
      api = await Api.asUser(req.query.sudo);
      res.locals.api = api;
    } else {
      const email = req?.session?.user.email ?? null;
      api = await Api.asUser(email);
      res.locals.email = email;
      res.locals.api = api;
    }

    const requestSchema = await getGraphQLSchema({ api });

    logger.debug("Executing GraphQL", res.locals.email);

    createHandler({
      schema: requestSchema,
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
